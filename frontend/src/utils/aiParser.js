import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up pdf.js worker using CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const RESUME_PROMPT = `You are an expert resume parser. Extract all information from the following resume and return a single valid JSON object — no markdown fences, no extra commentary.

The JSON must strictly follow this schema:
{
  "name": "Full Name",
  "title": "Professional Title / Target Role (infer from resume if not explicit)",
  "bio": "2–3 sentence professional summary",
  "contact": {
    "email": "",
    "phone": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "",
      "role": "",
      "duration": "e.g. Jan 2022 – Present",
      "description": "bullet points as a single string separated by \\n"
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "tech": ["tech1", "tech2"],
      "url": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "year": ""
    }
  ],
  "certifications": ["cert1", "cert2"]
}

Rules:
- Use empty string "" for missing string fields, [] for missing arrays.
- Do NOT invent information not present in the resume.
- Return only raw JSON, starting with { and ending with }.
`;

/**
 * Extract text from PDF
 */
async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

/**
 * Extract text from DOCX
 */
async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Convert file to Base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Clean & Parse Gemini JSON response
 */
function cleanAndParseJson(rawText) {
  let cleaned = rawText.trim();
  // Strip markdown code fences if present
  if (cleaned.includes('```')) {
    const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) cleaned = match[1].trim();
  }
  const startIdx = cleaned.indexOf('{');
  const endIdx = cleaned.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }
  return JSON.parse(cleaned);
}

/**
 * Main parse resume function
 */
export async function parseResumeWithAI(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  }

  const ext = file.name.split('.').pop().toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp'].includes(ext);

  let contents = [];

  if (isImage) {
    const base64Data = await fileToBase64(file);
    const mimeType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    contents = [
      {
        parts: [
          { text: RESUME_PROMPT + '\nResume Image attached below:' },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ];
  } else {
    let extractedText = '';
    if (ext === 'pdf') {
      extractedText = await extractTextFromPdf(file);
    } else if (ext === 'docx') {
      extractedText = await extractTextFromDocx(file);
    } else if (ext === 'txt') {
      extractedText = await file.text();
    } else {
      throw new Error(`Unsupported file format: .${ext}`);
    }

    if (!extractedText.trim()) {
      throw new Error('Could not extract text from this file. Please ensure the document is not empty.');
    }

    contents = [
      {
        parts: [{ text: `${RESUME_PROMPT}\nResume Text:\n${extractedText}` }],
      },
    ];
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API error (Status: ${response.status})`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini did not return any content.');
  }

  return cleanAndParseJson(rawText);
}

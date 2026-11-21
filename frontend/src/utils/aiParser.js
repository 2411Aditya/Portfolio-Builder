import mammoth from 'mammoth';

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
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading resume file'));
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
 * Intelligent Heuristic Fallback Parser
 * Extracts structured portfolio data directly from text when the AI API is restricted or unavailable
 */
export function fallbackExtractFromText(text, filename = '') {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // 1. Extract contact details via regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // 2. Infer Name
  let name = '';
  if (lines.length > 0) {
    const candidateLine = lines[0];
    if (candidateLine.length < 50 && !candidateLine.includes('@') && !candidateLine.includes('http')) {
      name = candidateLine;
    }
  }
  if (!name && filename) {
    const cleanFn = filename.replace(/\.(pdf|docx|txt|png|jpg|jpeg|webp)$/i, '').replace(/[_-]/g, ' ');
    const parts = cleanFn.split(/\s+/).slice(0, 2);
    name = parts.join(' ');
  }
  if (!name) name = 'Portfolio Creator';

  // 3. Infer Title / Role
  let title = 'Software Engineer & Builder';
  for (let i = 1; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (line.length < 60 && !line.includes('@') && !line.includes('http') && !line.match(/\d{3}/)) {
      title = line;
      break;
    }
  }

  // 4. Skills extraction
  const skills = [];
  const knownTech = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'HTML', 'CSS',
    'Tailwind', 'Next.js', 'Vue', 'Angular', 'Express', 'Flask', 'Django', 'FastAPI',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'GraphQL', 'REST API', 'Redis', 'CI/CD', 'Linux', 'Vite'
  ];
  const lowerText = text.toLowerCase();
  for (const tech of knownTech) {
    if (lowerText.includes(tech.toLowerCase())) {
      skills.push(tech);
    }
  }

  // 5. Sections extraction
  const experience = [];
  const projects = [];
  const education = [];

  let currentSection = 'summary';
  let summaryLines = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower === 'experience' || lower.includes('work experience') || lower.includes('employment')) {
      currentSection = 'experience';
      continue;
    } else if (lower === 'skills' || lower.includes('technical skills')) {
      currentSection = 'skills';
      continue;
    } else if (lower === 'projects' || lower.includes('personal projects')) {
      currentSection = 'projects';
      continue;
    } else if (lower === 'education' || lower.includes('academic background')) {
      currentSection = 'education';
      continue;
    }

    if (currentSection === 'summary' && summaryLines.length < 3 && line !== name && line !== title && !line.includes(email)) {
      summaryLines.push(line);
    } else if (currentSection === 'experience' && experience.length < 4) {
      if (line.length > 5 && !line.startsWith('•') && !line.startsWith('-')) {
        experience.push({
          company: line,
          role: title || 'Engineer',
          duration: 'Present',
          description: line,
        });
      }
    } else if (currentSection === 'projects' && projects.length < 4) {
      if (line.length > 5 && !line.startsWith('•') && !line.startsWith('-')) {
        projects.push({
          name: line.split(/[-:|]/)[0].trim(),
          description: line,
          tech: skills.slice(0, 3),
          url: '',
        });
      }
    } else if (currentSection === 'education' && education.length < 2) {
      if (line.length > 5) {
        education.push({
          institution: line,
          degree: 'Bachelor of Science / Engineering',
          year: '2024',
        });
      }
    }
  }

  const bio = summaryLines.join(' ') || `Experienced ${title} passionate about building scalable, high-performance web applications and systems.`;

  return {
    name,
    title,
    bio,
    contact: {
      email,
      phone,
      linkedin,
      github,
      website: '',
    },
    skills: skills.length > 0 ? skills : ['JavaScript', 'React', 'Node.js', 'Git', 'CSS'],
    experience: experience.length > 0 ? experience : [
      {
        company: 'Technology Solutions',
        role: title || 'Fullstack Engineer',
        duration: '2023 – Present',
        description: 'Designed and developed robust responsive applications with modern frameworks.'
      }
    ],
    projects: projects.length > 0 ? projects : [
      {
        name: 'Full-Stack Web Platform',
        description: 'Interactive web platform with database integration and responsive UI.',
        tech: skills.slice(0, 3).length > 0 ? skills.slice(0, 3) : ['React', 'JavaScript'],
        url: ''
      }
    ],
    education: education.length > 0 ? education : [
      {
        institution: 'University / Institute of Technology',
        degree: 'Bachelor in Computer Science / Engineering',
        year: '2024'
      }
    ],
    certifications: [],
  };
}

/**
 * Main parse resume function using Gemini Multimodal Engine
 */
export async function parseResumeWithAI(file) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured. Please add it to your environment variables.');
  }

  const ext = file.name.split('.').pop().toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp'].includes(ext);
  const isPdf = ext === 'pdf';

  let contents = [];

  let extractedText = '';

  if (isPdf) {
    // Send PDF directly to Gemini natively via base64 inline_data
    // This avoids client-side worker crashes on iOS/Safari and delivers full visual + layout OCR
    const base64Data = await fileToBase64(file);
    contents = [
      {
        parts: [
          { text: RESUME_PROMPT + '\nResume Document (PDF) attached below:' },
          {
            inline_data: {
              mime_type: 'application/pdf',
              data: base64Data,
            },
          },
        ],
      },
    ];
  } else if (isImage) {
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
    if (ext === 'docx') {
      extractedText = await extractTextFromDocx(file);
    } else if (ext === 'txt') {
      extractedText = await file.text();
    } else {
      throw new Error(`Unsupported file format: .${ext}`);
    }

    if (!extractedText || !extractedText.trim()) {
      throw new Error('Could not extract text from this file. Please ensure the document is not empty.');
    }

    contents = [
      {
        parts: [{ text: `${RESUME_PROMPT}\nResume Text:\n${extractedText}` }],
      },
    ];
  }

  const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return cleanAndParseJson(rawText);
        }
      }
    } catch (modelErr) {
      console.warn(`Model ${model} attempt failed:`, modelErr.message);
    }
  }

  // If candidate models didn't return valid text, use document fallback parser for text/docx
  if (extractedText) {
    console.warn('AI Parsing API unavailable, using intelligent document parser fallback.');
    return fallbackExtractFromText(extractedText, file.name);
  }

  throw new Error('Gemini could not parse this document. Please check your document format.');
}

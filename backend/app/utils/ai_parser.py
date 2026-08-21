"""
AI Resume Parser using Google Gemini (google-genai SDK).
Supports PDF, DOCX, TXT, and image files.
"""

import json
import io
from google import genai
from google.genai import types
from flask import current_app

# --------------------------------------------------------------------------- #
#  Text extractors
# --------------------------------------------------------------------------- #

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF using pdfplumber."""
    import pdfplumber
    text_parts = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
    return "\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file."""
    from docx import Document
    doc = Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)


def extract_text_from_txt(file_bytes: bytes) -> str:
    """Decode plain text."""
    for enc in ('utf-8', 'latin-1', 'cp1252'):
        try:
            return file_bytes.decode(enc)
        except UnicodeDecodeError:
            continue
    return file_bytes.decode('utf-8', errors='replace')


# --------------------------------------------------------------------------- #
#  Gemini prompt
# --------------------------------------------------------------------------- #

RESUME_PROMPT = """
You are an expert resume parser. Extract all information from the following resume text and return a single valid JSON object — no markdown fences, no extra commentary.

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

Resume Text:
"""


def parse_resume_with_gemini(text: str) -> dict:
    """Send resume text to Gemini and return structured JSON."""
    api_key = current_app.config.get('GEMINI_API_KEY', '')
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured. Set it in backend/.env")

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=RESUME_PROMPT + text
    )
    raw = response.text.strip()

    # Strip markdown fences if model wraps in ```json ... ```
    if '```' in raw:
        import re
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', raw)
        if match:
            raw = match.group(1).strip()

    # Find the outermost JSON object if any preamble exists
    start_idx = raw.find('{')
    end_idx = raw.rfind('}')
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        raw = raw[start_idx:end_idx+1]

    return json.loads(raw)


def parse_image_with_gemini(file_bytes: bytes, mime_type: str) -> dict:
    """Send an image directly to Gemini Vision and extract resume data."""
    api_key = current_app.config.get('GEMINI_API_KEY', '')
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)

    prompt = (
        "This is an image of a resume. Extract all information and return a single valid JSON object "
        "with no markdown fences. Follow this schema exactly:\n" + RESUME_PROMPT.split("Resume Text:")[0]
    )

    image_part = types.Part.from_bytes(data=file_bytes, mime_type=mime_type)

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, image_part]
    )
    raw = response.text.strip()

    if '```' in raw:
        import re
        match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', raw)
        if match:
            raw = match.group(1).strip()

    start_idx = raw.find('{')
    end_idx = raw.rfind('}')
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        raw = raw[start_idx:end_idx+1]

    return json.loads(raw)


# --------------------------------------------------------------------------- #
#  Main entry
# --------------------------------------------------------------------------- #

def parse_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Dispatch to the correct extractor based on file extension,
    then parse with Gemini.
    """
    ext = filename.rsplit('.', 1)[-1].lower()

    if ext == 'pdf':
        text = extract_text_from_pdf(file_bytes)
        return parse_resume_with_gemini(text)

    elif ext == 'docx':
        text = extract_text_from_docx(file_bytes)
        return parse_resume_with_gemini(text)

    elif ext == 'txt':
        text = extract_text_from_txt(file_bytes)
        return parse_resume_with_gemini(text)

    elif ext in ('png', 'jpg', 'jpeg', 'webp'):
        mime_map = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'webp': 'image/webp'}
        return parse_image_with_gemini(file_bytes, mime_map[ext])

    else:
        raise ValueError(f"Unsupported file type: .{ext}")

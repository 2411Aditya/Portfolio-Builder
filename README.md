# auoraa — Full-Stack Portfolio Builder

> Upload a resume → AI parses it → Get a stunning shareable portfolio URL instantly.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS v4 + Lucide icons
- **Backend:** Flask + Flask-JWT-Extended + SQLAlchemy (SQLite)
- **AI:** Google Gemini 1.5 Flash (resume parsing)

---

## 🚀 Getting Started

### 1. Set Your Gemini API Key

Edit `backend/.env` and set your key:
```
GEMINI_API_KEY=your_actual_key_here
```
Get a free key at: https://aistudio.google.com/

### 2. Start the Backend

```powershell
cd backend
pip install -r requirements.txt
python run.py
```
Backend runs at: **http://localhost:5000**

### 3. Start the Frontend

```powershell
cd frontend
npm install
npm run dev
```
Frontend runs at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, get JWT |
| POST | `/api/portfolio/generate` | JWT | Upload resume + generate portfolio |
| GET | `/api/portfolio/history` | JWT | List your portfolios |
| DELETE | `/api/portfolio/<id>` | JWT | Delete a portfolio |
| GET | `/api/public/portfolio/<username>/<id>` | — | Public portfolio data |

---

## 📁 Project Structure

```
Portfolio Builder/
├── backend/
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── config.py          # Configuration
│   │   ├── models.py          # User + Portfolio ORM
│   │   ├── auth/routes.py     # Auth endpoints
│   │   ├── portfolio/routes.py # Portfolio endpoints
│   │   └── utils/ai_parser.py # Gemini AI resume parser
│   ├── .env                   # ← Put your GEMINI_API_KEY here
│   ├── requirements.txt
│   └── run.py
└── frontend/
    ├── src/
    │   ├── pages/             # LandingPage, Login, Register, Dashboard, PortfolioViewer
    │   ├── components/
    │   │   └── portfolio-themes/  # DarkPortfolio.jsx, LightPortfolio.jsx
    │   ├── contexts/AuthContext.jsx
    │   └── api/client.js
    ├── index.html
    └── vite.config.js
```

---

## 🎨 Features

- **Drag-and-drop file upload** — PDF, DOCX, TXT, PNG, JPG, WebP
- **AI parsing** — Google Gemini extracts name, bio, skills, experience, projects, education, contact
- **Theme selection** — Dark (glassmorphism) or Light (clean white) portfolio themes
- **Instant public URL** — `/p/<username>/<portfolioId>` shareable link
- **Portfolio management** — Copy link, preview, and delete from dashboard
- **JWT authentication** — Secure register/login flow
- **Responsive** — Works on all screen sizes

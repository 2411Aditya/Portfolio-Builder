# auoraa — AI-Powered Full-Stack Portfolio Builder

> Transform any resume into a sleek, responsive, and shareable web portfolio in seconds using Google Gemini AI.

---

## 🌟 Overview

**auoraa** is a full-stack web platform designed to streamline professional portfolio creation. Users upload their resumes in various formats (PDF, DOCX, TXT, images) or import via Google Drive. The system leverages **Google Gemini AI** to extract and categorize candidate information (bio, skills, experience, projects, education, social links), instantly generating a live, hosted portfolio with a unique public URL.

The platform includes **10 distinct portfolio templates**, tiered subscription plans (**Free Starter**, **Lite Creator**, and **Pro Visionary**), integrated **Razorpay payments**, real-time **AI Design Customization**, and automated **SEO & Schema.org metadata generation**.

---

## ⚡ Tech Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design System
- **Icons & Graphics:** Lucide React, Three.js, OGL (WebGL visual background effects)
- **Document Parsing:** `pdfjs-dist` (PDF), `mammoth` (DOCX)
- **State & Routing:** React Router v7, Context API (`AuthContext`), `react-helmet-async`
- **Database & Auth Client:** `@supabase/supabase-js`

### Backend & Cloud Infrastructure
- **Database & Authentication:** Supabase (PostgreSQL with Row Level Security & Triggers)
- **Serverless / Edge Functions:** Supabase Deno Edge Functions
  - `create-razorpay-order` — Razorpay order generation & pricing logic
  - `razorpay-webhook` — Signature verification & automated user tier upgrade
  - `ai-customize-portfolio` — Gemini AI portfolio styling & content transformation
- **Payment Gateway:** Razorpay (UPI, Cards, NetBanking)
- **Alternative / Legacy Backend:** Python Flask + Flask-JWT-Extended + Flask-SQLAlchemy (SQLite / PostgreSQL) + `google-genai` + `pdfplumber` + `python-docx` + `Pillow`

### AI Engine
- **Model:** Google Gemini 1.5 Flash (`@google/genai` & Google AI Studio API)

---

## 🎨 Template Catalog & Subscription Tiers

auoraa features 10 built-in portfolio templates categorized into three access tiers:

| Tier | Price | Template ID | Template Name | Description & Key Features |
|:---|:---|:---|:---|:---|
| **Free Starter** | ₹0 / forever | `minimal` | **Minimal Classic** | Clean single-column layout, refined typography, fast loading. |
| | | `terminal` | **Developer Terminal** | Multi-page interactive CLI shell with tabbed navigation, command execution, and dual-mode theme. |
| **Lite Creator** | ₹19 / month | `bento` | **Bento Grid** | Modern rounded bento cards, dynamic grid hierarchy, stat pills, and dual-mode theme. |
| | | `executive` | **Executive Lead** | Corporate leadership layout with a sticky sidebar and editorial typography. |
| | | `creative_bold` | **Neo-Grotesque Bold** | High-contrast striking typography with neon highlights and bold headers. |
| | | `split_screen` | **Split Screen Pane** | Sticky profile card on the left with a smooth scrolling project timeline on the right. |
| **Pro Visionary** | ₹29 / month | `glassmorphism` | **Luminous Glass** | Frosted glassmorphism cards with backdrop blur and iridescent glowing borders. |
| | | `timeline_doc` | **Storytelling Roadmap** | Connected chronological milestone timeline with journey storytelling nodes. |
| | | `notion_doc` | **Notion Workspace** | Minimalist Notion-style documentation workspace with callout boxes and collapsible toggles. |
| | | `neumorphic` | **Soft Neumorphic** | Tactile embossed shadows and soft convex/concave interactive surfaces. |

*Pro Plan also unlocks the interactive **AI Design Customizer**.*

---

## 🚀 Key Features

- **Multi-Format Resume Upload:** Supports `.pdf`, `.docx`, `.txt`, `.png`, `.jpg`, `.jpeg`, `.webp`, plus direct **Google Drive** file picker integration.
- **Automated AI Parsing:** Extracts full name, job title, summary, technical & soft skills, categorized work experience, projects, education, and contact links.
- **AI Design Customizer (Pro):** Conversational side-drawer allowing users to customize colors, accents, font hierarchy, bio tone, and resume data using natural language prompts.
- **Instant Public Link:** Generates shareable, public URLs (`/p/:username/:portfolioId`) with responsive mobile layout and candidate metadata.
- **Live Template Switcher:** Change portfolio templates at any time from the dashboard with instant live re-rendering.
- **Secure Payments & Billing:** Razorpay checkout flow with automated webhook verification and 1-month subscription validity tracking.
- **SEO & Social Sharing:** Rich OpenGraph preview tags, dynamic page titles, and Schema.org `Person`/`ProfilePage` JSON-LD structured data.

---

## 🛠️ Project Structure

```
Portfolio Builder/
├── frontend/                     # React + Vite frontend application
│   ├── src/
│   │   ├── api/                  # API client (Supabase CRUD & LocalStorage caching)
│   │   ├── assets/               # Branding logos and static assets
│   │   ├── components/           # UI Modals, Navbar, AI Customizer Drawer, SEO, Visuals
│   │   │   ├── portfolio-themes/ # Legacy Dark/Light portfolio wrappers
│   │   │   ├── AICustomizerDrawer.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   ├── CookieConsent.jsx
│   │   │   ├── DashboardNavbar.jsx
│   │   │   ├── GoogleDriveModal.jsx
│   │   │   ├── PricingModal.jsx
│   │   │   ├── SEO.jsx
│   │   │   └── TemplatePreviewModal.jsx
│   │   ├── contexts/             # AuthContext (Supabase Auth & Plan Tier management)
│   │   ├── lib/                  # Supabase client configuration
│   │   ├── pages/                # LandingPage, LoginPage, RegisterPage, DashboardPage, etc.
│   │   │   └── dashboard/        # Dashboard tabs (ActiveLinks, PersonalInfo, AboutUs, Features)
│   │   ├── templates/            # 10 Portfolio template components & registry
│   │   └── utils/                # AI parser, Razorpay integration, Google Drive picker
│   ├── .env.example              # Frontend environment variables template
│   ├── package.json
│   └── vite.config.js
├── backend/                      # Python Flask alternative backend
│   ├── app/
│   │   ├── auth/                 # Flask JWT auth routes
│   │   ├── portfolio/            # Flask portfolio generation & parsing routes
│   │   ├── utils/                # Python Gemini resume parser
│   │   ├── config.py             # Flask configuration
│   │   └── models.py             # SQLAlchemy User & Portfolio models
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
├── supabase/                     # Supabase configuration & migrations
│   ├── functions/                # Deno Edge Functions (Razorpay order/webhook, AI customizer)
│   ├── migrations/               # SQL database migrations (profiles, orders, RLS policies)
│   └── SETUP_GUIDE.md            # Supabase & Razorpay setup instructions
├── USER_GUIDE.md                 # End-user manual & step-by-step walkthrough
├── DESIGN.md                     # Design system & design tokens specification
└── README.md
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18 or newer) & **npm**
- **Python** (3.10+ if using the Flask backend)
- **Supabase Account** & **Google Gemini API Key**
- **Razorpay Account** (optional for payment processing in test mode)

---

### 1. Frontend Setup (Recommended Primary App)

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating a `.env` file:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key

   # Google Gemini API Key
   VITE_GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here

   # Razorpay Key ID (optional, for payments)
   VITE_RAZORPAY_KEY_ID=rzp_test_...
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run at **http://localhost:5173**.

---

### 2. Supabase Database & Edge Functions Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and go to **SQL Editor**.
2. Run the migration scripts in order:
   - `supabase/migrations/20250101_init_payments_and_templates.sql`
   - `supabase/migrations/20250102_subscription_expiry.sql`
3. Deploy the Edge Functions:
   ```bash
   supabase functions deploy create-razorpay-order --no-verify-jwt
   supabase functions deploy razorpay-webhook --no-verify-jwt
   supabase functions deploy ai-customize-portfolio --no-verify-jwt
   ```
4. Set Edge Function secrets in Supabase CLI or Project Settings:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID="rzp_test_..." RAZORPAY_KEY_SECRET="..." RAZORPAY_WEBHOOK_SECRET="..." GEMINI_API_KEY="..."
   ```

*(See [supabase/SETUP_GUIDE.md](file:///c:/Users/Aditya%20Kulkarni/Desktop/Projects/Portfolio%20Builder/supabase/SETUP_GUIDE.md) for full details).*

---

### 3. Python Flask Backend Setup (Alternative Option)

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure backend `.env`:
   ```env
   SECRET_KEY=your-jwt-secret-key
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=sqlite:///portfolio_builder.db
   ```

4. Run the Flask server:
   ```bash
   python run.py
   ```
   The backend runs at **http://localhost:5000**.

---

## 📡 API Endpoints (Flask Alternative)

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | None | Register new user account |
| `POST` | `/api/auth/login` | None | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | JWT | Get authenticated user info |
| `POST` | `/api/portfolio/generate` | JWT | Upload resume file and parse with AI |
| `GET` | `/api/portfolio/history` | JWT | Retrieve all portfolios created by the user |
| `DELETE` | `/api/portfolio/<id>` | JWT | Delete a specific portfolio |
| `GET` | `/api/public/portfolio/<username>/<id>` | None | Fetch public portfolio data |

---

## 📖 Documentation & Guides

- 📘 **[USER_GUIDE.md](file:///c:/Users/Aditya%20Kulkarni/Desktop/Projects/Portfolio%20Builder/USER_GUIDE.md)**: End-to-end user manual covering resume uploads, template selection, AI live customization, payments, and sharing.
- 🛠️ **[supabase/SETUP_GUIDE.md](file:///c:/Users/Aditya%20Kulkarni/Desktop/Projects/Portfolio%20Builder/supabase/SETUP_GUIDE.md)**: Detailed cloud deployment, database triggers, Edge functions, and webhook setup.
- 🎨 **[DESIGN.md](file:///c:/Users/Aditya%20Kulkarni/Desktop/Projects/Portfolio%20Builder/DESIGN.md)**: Visual design tokens, color palettes, and typography guidelines.

---

## 📄 License

This project is licensed under the MIT License.

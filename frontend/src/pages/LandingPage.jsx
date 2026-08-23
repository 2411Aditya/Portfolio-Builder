import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, Upload, FileText, Image, X,
  Moon, Sun, Check, ChevronDown, Globe, Link2, Sparkles,
  Users
} from 'lucide-react';
import SEO from '../components/SEO';

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: 'What file formats does Portfolio Builder support?',
    a: 'We accept PDF, DOCX, and plain TXT resumes. Our AI engine is optimized for each format, extracting skills, experience, education, and contact information accurately.'
  },
  {
    q: 'How long does it take to generate a portfolio?',
    a: 'Most portfolios are live in under 30 seconds. Our AI parses your document, structures the data, and generates a fully hosted portfolio at a shareable URL instantly.'
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your resume data is processed securely and only used to generate your portfolio. We use JWT authentication and your portfolio content is only accessible via the unique link.'
  },
  {
    q: 'Can I delete or update my portfolio?',
    a: 'Absolutely. From your dashboard you can delete any portfolio instantly — the public link stops working immediately. Simply upload a new version of your resume to create a fresh portfolio.'
  },
  {
    q: 'Can I choose how my portfolio looks?',
    a: 'Yes! You can choose between a sleek Dark Mode and a clean Light Mode when generating. Both are recruiter-optimized, mobile-first, and look stunning on any device.'
  },
];

/* ─── Feature Cards ─── */
const features = [
  {
    icon: <Zap size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} aria-hidden="true" />,
    title: 'Instant AI Extraction',
    desc: 'No manual data entry. Our AI reads your resume and extracts every skill, role, and achievement — perfectly structured.',
  },
  {
    icon: <Link2 size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} aria-hidden="true" />,
    title: 'Shareable Custom Links',
    desc: 'Every portfolio gets a clean public URL at /p/username/id. Share it in your email signature, LinkedIn, or anywhere.',
  },
  {
    icon: <Users size={20} strokeWidth={1.5} style={{ color: '#818cf8' }} aria-hidden="true" />,
    title: 'Recruiter-Optimized Design',
    desc: 'Clean, mobile-first layouts designed to impress hiring managers. Both dark and light themes are crafted for clarity.',
  },
];

/* ─── FAQ Item with Accessibility ─── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`faq-item ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <span>{q}</span>
        <ChevronDown size={18} strokeWidth={1.5} className="faq-chevron" aria-hidden="true" />
      </button>
      <div className="faq-answer" aria-hidden={!open}>
        <div className="faq-answer-inner">{a}</div>
      </div>
    </article>
  );
}

/* ─── ACCEPTED types ─── */
const ACCEPTED = ['pdf', 'docx', 'txt'];
const STEPS = [
  'Parsing document structure…',
  'Extracting skills & experience…',
  'Styling live portfolio…',
];

/* ─── Upload Card (hero centerpiece) ─── */
function UploadCard() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(-1);
  const fileInputRef = useRef(null);

  const validateAndSet = (f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) return;
    if (f.size > 16 * 1024 * 1024) return;
    setFile(f);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) validateAndSet(f);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const simulateGeneration = async () => {
    if (!file) return;
    setGenerating(true);
    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 900));
    }
    setGenerating(false);
    setStep(-1);
  };

  const isImage = file && ['png', 'jpg', 'jpeg', 'webp'].includes(file.name.split('.').pop().toLowerCase());

  return (
    <div className="upload-card fade-up-3">
      <div className="upload-card-label">Upload Your Resume</div>

      {/* Drop zone */}
      {!file && (
        <div
          id="landing-drop-zone"
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload resume dropzone"
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            aria-label="Select resume file"
            onChange={e => { if (e.target.files[0]) validateAndSet(e.target.files[0]); }}
          />
          <div className="drop-upload-icon">
            <Upload size={22} strokeWidth={1.5} style={{ color: '#818cf8' }} aria-hidden="true" />
          </div>
          <p className="drop-main">Drop your resume here</p>
          <p className="drop-sub">or click to browse files</p>
          <div className="drop-pills">
            {['PDF', 'DOCX', 'TXT'].map(t => <span key={t} className="drop-pill">.{t}</span>)}
            <span className="drop-pill">Max 16 MB</span>
          </div>
        </div>
      )}

      {/* File preview */}
      {file && !generating && (
        <div className="file-preview">
          <div className="file-preview-icon">
            {isImage
              ? <Image size={20} strokeWidth={1.5} style={{ color: '#4ade80' }} aria-hidden="true" />
              : <FileText size={20} strokeWidth={1.5} style={{ color: '#4ade80' }} aria-hidden="true" />
            }
          </div>
          <div className="file-preview-info">
            <div className="file-preview-name">{file.name}</div>
            <div className="file-preview-size">{(file.size / 1024).toFixed(0)} KB</div>
          </div>
          <span className="file-preview-chip">Ready to Scan</span>
          <button
            type="button"
            className="file-preview-remove"
            onClick={() => setFile(null)}
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* 3-step progress */}
      {generating && (
        <div className="progress-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`progress-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
              <div className="progress-step-icon">
                {i < step
                  ? <Check size={12} strokeWidth={3} aria-hidden="true" />
                  : i === step
                  ? <div className="progress-step-spinner" />
                  : i + 1
                }
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* Theme segmented control */}
      {!generating && (
        <div className="theme-seg" role="group" aria-label="Portfolio theme selection">
          {[
            { value: 'dark', label: 'Dark Mode', icon: <Moon size={14} strokeWidth={1.5} aria-hidden="true" /> },
            { value: 'light', label: 'Light Mode', icon: <Sun size={14} strokeWidth={1.5} aria-hidden="true" /> },
          ].map(t => (
            <button
              key={t.value}
              type="button"
              className={`theme-seg-btn ${theme === t.value ? 'active' : ''}`}
              onClick={() => setTheme(t.value)}
              aria-pressed={theme === t.value}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      {!generating && (
        <Link to="/register" id="upload-card-cta" style={{ textDecoration: 'none' }} aria-label="Get started free with resume upload">
          <button
            type="button"
            className="generate-btn"
            onClick={file ? simulateGeneration : undefined}
          >
            <Zap size={16} strokeWidth={1.5} aria-hidden="true" />
            {file ? 'Scan Resume & Generate Portfolio' : 'Get Started Free'}
          </button>
        </Link>
      )}
    </div>
  );
}

/* ─── Browser Mockup ─── */
function BrowserMockup() {
  return (
    <div className="bento-inner">
      <div className="browser-mockup-bar">
        <div className="browser-dots" aria-hidden="true">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="browser-url-bar">
          <Globe size={11} style={{ color: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
          portfolio-builder-six-jet.vercel.app/p/alex/developer-portfolio
        </div>
      </div>
      <div className="browser-content" aria-label="Interactive portfolio theme preview">
        <div className="mock-sidebar">
          <div className="mock-avatar" />
          <div className="mock-name" />
          <div className="mock-title" />
          <div className="mock-divider" />
          <div className="mock-nav-item active" style={{ width: '70%' }} />
          <div className="mock-nav-item" style={{ width: '55%' }} />
          <div className="mock-nav-item" style={{ width: '65%' }} />
          <div className="mock-nav-item" style={{ width: '50%' }} />
        </div>
        <div className="mock-main">
          <div className="mock-section-title" />
          <div className="mock-card">
            <div className="mock-line medium" />
            <div className="mock-line short" />
            <div className="mock-line" style={{ width: '90%' }} />
            <div className="mock-tags">
              <div className="mock-tag" />
              <div className="mock-tag" />
              <div className="mock-tag" style={{ width: 50 }} />
            </div>
          </div>
          <div className="mock-card">
            <div className="mock-line" style={{ width: '95%' }} />
            <div className="mock-line medium" />
            <div className="mock-line short" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function LandingPage() {
  // Structured Data Schemas for Google Rich Results
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication'],
    name: 'AI Portfolio Builder',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication, DesignApplication',
    description: 'Turn your resume into a stunning, recruiter-ready developer portfolio in under 30 seconds. Powered by AI with custom themes and instant hosting.',
    url: 'https://portfolio-builder-six-jet.vercel.app/',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD'
    },
    featureList: [
      'Instant AI Resume Extraction from PDF, DOCX, and TXT',
      'One-click recruiter-optimized Dark & Light themes',
      'Shareable custom public URLs (/p/:username/:portfolioId)',
      'Rich OpenGraph and Social Media link previews',
      'Mobile-first responsive design'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PortfolioAI',
    url: 'https://portfolio-builder-six-jet.vercel.app/',
    description: 'AI-Powered Developer Portfolio Generator'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#09090b', overflowX: 'hidden' }}>
      {/* ── SEO Head & Schema Markup ── */}
      <SEO
        title="AI Portfolio Builder | Free Developer Portfolio Generator & Resume to Website"
        description="Turn your resume into a stunning, recruiter-ready developer portfolio in under 30 seconds. Powered by AI with dark & light themes, instant hosting, and rich SEO."
        keywords={[
          'AI Portfolio Builder',
          'Resume to Website',
          'Free Developer Portfolio Generator',
          'AI Resume Parser',
          'Developer Portfolio Maker',
          'Online Portfolio Builder',
          'Recruiter Ready Portfolio'
        ]}
        url="https://portfolio-builder-six-jet.vercel.app/"
        type="website"
        schema={[softwareAppSchema, faqSchema, websiteSchema]}
      />

      {/* ── Header & Navbar ── */}
      <header>
        <nav className="navbar" aria-label="Main Navigation">
          <Link to="/" className="navbar-logo" aria-label="PortfolioAI Homepage">
            <span>PortfolioAI</span>
          </Link>
          <div className="navbar-actions">
            <Link to="/login" className="navbar-link">Sign In</Link>
            <Link to="/register" id="nav-get-started-btn" className="navbar-cta">Get Started Free</Link>
          </div>
        </nav>
      </header>

      {/* ── Main Content Landmark ── */}
      <main>
        {/* ── Hero ── */}
        <section className="hero-section" aria-labelledby="hero-heading">
          <div className="hero-noise" />
          <div className="hero-grid" />
          <div className="orb float" style={{ top: '10%', left: '5%', width: 500, height: 500, background: 'rgba(99,102,241,0.05)' }} />
          <div className="orb float-2" style={{ bottom: '10%', right: '5%', width: 380, height: 380, background: 'rgba(139,92,246,0.04)' }} />

          <div className="hero-inner">
            <div className="hero-badge fade-up">
              <span className="hero-badge-dot" />
              ✨ AI-Powered &nbsp;•&nbsp; Turn Resumes into Live Sites
            </div>

            <h1 id="hero-heading" className="hero-title fade-up-1">
              Turn Your Resume Into a{' '}
              <span className="accent-word">Recruiter-Ready</span>{' '}
              Portfolio in 30 Seconds.
            </h1>

            <p className="hero-sub fade-up-2">
              Upload your resume, let our AI extract everything automatically, pick a theme — and get a beautiful, shareable portfolio URL instantly. No design skills needed.
            </p>

            <div className="hero-ctas fade-up-2">
              <Link to="/register" id="hero-cta-primary" className="hero-cta-primary" aria-label="Build My Portfolio">
                Build My Portfolio <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link to="/login" id="hero-cta-secondary" className="hero-cta-secondary" aria-label="Sign In to Existing Account">
                Sign In
              </Link>
            </div>

            <UploadCard />
          </div>

          {/* Scroll indicator */}
          <div className="anim-bounce" style={{ position: 'absolute', bottom: 24, left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: '#a1a1aa', fontSize: 10, letterSpacing: 3 }} aria-hidden="true">
            <span>SCROLL</span>
            <ChevronDown size={14} strokeWidth={1.5} />
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="section" id="features" aria-labelledby="features-heading">
          <div className="section-inner">
            <p className="section-eyebrow">Why PortfolioAI</p>
            <h2 id="features-heading" className="section-title">Everything you need to <span className="grad">stand out</span></h2>
            <p className="section-sub">From AI-powered parsing to beautiful themes — your whole job search toolkit, in one place.</p>

            <div className="features-grid">
              {features.map((f, i) => (
                <article key={i} className="feature-card-v2">
                  <div className="feature-icon-v2">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portfolio Preview Bento ── */}
        <section className="bento-section" id="preview" aria-labelledby="preview-heading">
          <div className="section-inner" style={{ marginBottom: 40 }}>
            <p className="section-eyebrow">Live Preview</p>
            <h2 id="preview-heading" className="section-title">Your portfolio, <span className="grad">beautifully crafted</span></h2>
            <p className="section-sub">See what your generated portfolio looks like — a clean, professional page ready to share with the world.</p>
          </div>
          <BrowserMockup />
        </section>

        {/* ── FAQ ── */}
        <section className="faq-section" id="faq" aria-labelledby="faq-heading">
          <div className="section-inner" style={{ marginBottom: 40 }}>
            <p className="section-eyebrow">FAQ</p>
            <h2 id="faq-heading" className="section-title">Frequently asked <span className="grad">questions</span></h2>
          </div>
          <div className="faq-inner">
            <div className="faq-list">
              {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="section" id="cta" style={{ paddingTop: 0 }} aria-labelledby="cta-heading">
          <div className="section-inner">
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="orb" style={{ top: '-30%', right: '-5%', width: 300, height: 300, background: 'rgba(139,92,246,0.06)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Sparkles size={32} strokeWidth={1.5} style={{ color: '#818cf8', margin: '0 auto 16px' }} aria-hidden="true" />
                <h2 id="cta-heading" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(26px,4vw,40px)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12, color: '#09090b' }}>Ready to impress recruiters?</h2>
                <p style={{ fontSize: 16, color: '#71717a', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>Join thousands of professionals who built their portfolio in under 2 minutes.</p>
                <Link to="/register" id="cta-bottom-register" className="hero-cta-primary" style={{ display: 'inline-flex' }} aria-label="Get Started Free">
                  Get Started Free <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <span>PortfolioAI</span>
              </div>
              <p className="footer-desc">Turn your resume into a stunning portfolio in seconds. No design skills required.</p>
            </div>
            <div className="footer-nav">
              <div className="footer-nav-col">
                <span className="footer-nav-heading">Product</span>
                <Link to="/register" className="footer-nav-link">Get Started</Link>
                <Link to="/login" className="footer-nav-link">Sign In</Link>
              </div>
              <div className="footer-nav-col">
                <span className="footer-nav-heading">Legal</span>
                <span className="footer-nav-link" style={{ cursor: 'default' }}>Privacy Policy</span>
                <span className="footer-nav-link" style={{ cursor: 'default' }}>Terms of Use</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 PortfolioAI. All rights reserved.</span>
            <div className="footer-status">
              <span className="footer-status-dot" aria-hidden="true" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

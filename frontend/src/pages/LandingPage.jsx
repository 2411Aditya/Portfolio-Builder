import React, { useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Upload, FileText, Image, X,
  Moon, Sun, Check, ChevronDown, Globe,
  Smartphone, Monitor, MessageCircle, Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';
import DotField from '../components/DotField';
import PricingModal from '../components/PricingModal';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/Logo.png';

/* ─── FAQ Data ─── */
const faqs = [
  {
    q: 'What file formats and import methods does auoraa support?',
    a: 'We accept PDF, DOCX, and plain TXT resumes, as well as direct import from Google Drive. Our AI engine accurately parses skills, experience, projects, education, and contact details.'
  },
  {
    q: 'How many portfolio templates are available?',
    a: 'auoraa offers 10 modular designer templates including Minimal, Bento Grid, Notion Document, Retro Terminal, Glassmorphic, Neumorphic, Executive, Creative, Split View, and Interactive Timeline.'
  },
  {
    q: 'How long does it take to generate a portfolio?',
    a: 'Most portfolios are live in under 30 seconds. Our AI structures your document into schema markup and generates a fully hosted, responsive portfolio at a shareable public URL instantly.'
  },
  {
    q: 'How does the AI Customizer Chatbox work?',
    a: 'On the Pro plan, you can customize your live portfolio using natural language (e.g., "change header color to neon purple", "refine my bio to sound more senior", or "highlight my React projects").'
  },
  {
    q: 'What are the pricing options?',
    a: 'We offer Free Forever (₹0 with 2 classic templates), Lite Creator (₹19/month with 6 dynamic templates & WhatsApp button), and Pro Visionary (₹29/month with all 10 templates, AI Customizer, and verified badge).'
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your resume data is processed securely with zero third-party data selling. You can edit or delete your portfolio anytime from your dashboard, and public links expire immediately upon deletion.'
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

/* ─── ACCEPTED File Types & Step Messages ─── */
const ACCEPTED = ['pdf', 'docx', 'txt'];
const STEPS = [
  'Parsing document structure & typography…',
  'Extracting skills, projects & experience…',
  'Styling live responsive portfolio…',
];

/* ─── Upload Card (Hero Centerpiece) ─── */
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
    e.preventDefault();
    setDragging(false);
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
    <div className="upload-card">
      <div className="upload-card-header">
        <div className="eyebrow-uppercase-sm">Instant Generator</div>
        <span className="badge-info-soft">AI Powered</span>
      </div>

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
            <Upload size={20} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="drop-main">Drop your resume file here</p>
          <p className="drop-sub">or click to browse local files</p>
          <div className="drop-pills">
            {['PDF', 'DOCX', 'TXT'].map(t => <span key={t} className="drop-pill">.{t}</span>)}
            <span className="drop-pill">MAX 16 MB</span>
          </div>
        </div>
      )}

      {/* File preview */}
      {file && !generating && (
        <div className="file-preview">
          <div className="file-preview-icon">
            {isImage
              ? <Image size={18} strokeWidth={1.5} aria-hidden="true" />
              : <FileText size={18} strokeWidth={1.5} aria-hidden="true" />
            }
          </div>
          <div className="file-preview-info">
            <div className="file-preview-name">{file.name}</div>
            <div className="file-preview-size">{(file.size / 1024).toFixed(0)} KB • Ready to parse</div>
          </div>
          <button
            type="button"
            className="file-preview-remove"
            onClick={() => setFile(null)}
            title="Remove file"
            aria-label="Remove uploaded file"
          >
            <X size={15} strokeWidth={2} aria-hidden="true" />
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
                  ? <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                  : i === step
                  ? <div className="spinner" style={{ width: 12, height: 12, borderWidth: 1.5 }} />
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
            { value: 'dark', label: 'Dark Mode', icon: <Moon size={13} strokeWidth={1.5} aria-hidden="true" /> },
            { value: 'light', label: 'Light Mode', icon: <Sun size={13} strokeWidth={1.5} aria-hidden="true" /> },
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

      {/* CTA Button */}
      {!generating && (
        <Link to="/register" id="upload-card-cta" style={{ textDecoration: 'none', display: 'block' }} aria-label="Get started free with resume upload">
          <button
            type="button"
            className="button-primary"
            style={{ width: '100%' }}
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

/* ─── Interactive Browser / Mobile Mockup ─── */
function BrowserMockup() {
  const [device, setDevice] = useState('desktop');

  return (
    <div>
      {/* Device Switcher */}
      <div className="device-switcher">
        <button
          type="button"
          className={`device-btn ${device === 'desktop' ? 'active' : ''}`}
          onClick={() => setDevice('desktop')}
          aria-label="Switch to Desktop Portfolio Preview"
        >
          <Monitor size={14} /> Desktop Canvas
        </button>
        <button
          type="button"
          className={`device-btn ${device === 'mobile' ? 'active' : ''}`}
          onClick={() => setDevice('mobile')}
          aria-label="Switch to Mobile Phone Portfolio Preview"
        >
          <Smartphone size={14} /> Mobile Phone
        </button>
      </div>

      {device === 'mobile' ? (
        /* Mobile Phone Mockup */
        <div className="phone-mockup-frame">
          <div className="phone-notch" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, color: '#5a5a5a', marginBottom: 8, padding: '0 4px' }}>
            <span>9:41</span>
            <span>5G • 100%</span>
          </div>

          <div className="browser-url" style={{ marginBottom: 12, padding: '3px 8px', fontSize: 10 }}>
            <Globe size={10} style={{ color: '#898989' }} />
            portfoliobuilder.app/p/alex
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #d8d8d8', borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 4, background: '#080808', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
                A
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#080808' }}>Alex Mercer</div>
                <div style={{ fontSize: 11, color: '#5a5a5a' }}>Staff Full-Stack Engineer</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="badge-green-soft" style={{ fontSize: 10, padding: '1px 5px' }}>✓ Verified</span>
              <span className="badge-neutral" style={{ fontSize: 10, padding: '1px 5px' }}>3 Roles</span>
              <span className="badge-neutral" style={{ fontSize: 10, padding: '1px 5px' }}>4 Projects</span>
            </div>
            <a href="#wa" onClick={e => e.preventDefault()} className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center', padding: '6px 10px', fontSize: 12 }}>
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ background: '#ffffff', border: '1px solid #d8d8d8', borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#080808', marginBottom: 4 }}>Work Experience</div>
              <div style={{ borderLeft: '2px solid #080808', paddingLeft: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#080808' }}>Senior Lead Engineer • Stripe</div>
                <div style={{ fontSize: 10, color: '#5a5a5a' }}>2022 — Present</div>
              </div>
              <div style={{ borderLeft: '2px solid #d8d8d8', paddingLeft: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#080808' }}>Frontend Architect • Vercel</div>
                <div style={{ fontSize: 10, color: '#5a5a5a' }}>2020 — 2022</div>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #d8d8d8', borderRadius: 8, padding: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#080808', marginBottom: 4 }}>Skills & Stack</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <span className="badge-neutral" style={{ fontSize: 10 }}>React</span>
                <span className="badge-neutral" style={{ fontSize: 10 }}>TypeScript</span>
                <span className="badge-neutral" style={{ fontSize: 10 }}>Node.js</span>
                <span className="badge-neutral" style={{ fontSize: 10 }}>PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Browser Frame */
        <div className="browser-frame">
          <div className="browser-bar">
            <div className="browser-dots" aria-hidden="true">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="browser-url">
              <Globe size={11} style={{ flexShrink: 0, color: '#898989' }} aria-hidden="true" />
              <span>portfolio-builder.app/p/alex/developer-portfolio</span>
            </div>
          </div>

          <div className="mockup-desktop-content">
            {/* Header Card */}
            <div className="mockup-header-box">
              <div className="mockup-header-left">
                <div style={{ width: 44, height: 44, borderRadius: 4, background: '#080808', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18, flexShrink: 0 }}>
                  A
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#080808', lineHeight: 1.2 }}>Alex Mercer</div>
                  <div style={{ fontSize: 12, color: '#5a5a5a', margin: '3px 0 6px' }}>Staff Full-Stack Engineer • San Francisco, CA</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="badge-green-soft" style={{ fontSize: 11 }}>✓ Verified Profile</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>3 Roles</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>4 Projects</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>12 Skills</span>
                  </div>
                </div>
              </div>
              <a href="#wa" onClick={e => e.preventDefault()} className="btn-whatsapp" style={{ flexShrink: 0, padding: '8px 14px', fontSize: 13 }}>
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

            {/* Grid Content */}
            <div className="mockup-desktop-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ border: '1px solid #d8d8d8', borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#080808', marginBottom: 6 }}>About & Summary</div>
                  <p style={{ fontSize: 12, color: '#363636', lineHeight: 1.55 }}>Specialized in building scalable distributed applications, microservices, and modern web architectures with high availability.</p>
                </div>
                <div style={{ border: '1px solid #d8d8d8', borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#080808', marginBottom: 10 }}>Work Experience</div>
                  <div style={{ borderLeft: '2px solid #080808', paddingLeft: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#080808' }}>Senior Lead Engineer • Stripe</div>
                    <div style={{ fontSize: 11, color: '#5a5a5a' }}>2022 — Present • Full-time</div>
                  </div>
                  <div style={{ borderLeft: '2px solid #d8d8d8', paddingLeft: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#080808' }}>Frontend Architect • Vercel</div>
                    <div style={{ fontSize: 11, color: '#5a5a5a' }}>2020 — 2022 • Remote</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ border: '1px solid #d8d8d8', borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#080808', marginBottom: 8 }}>Technical Stack</div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>React</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>TypeScript</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>Node.js</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>PostgreSQL</span>
                    <span className="badge-neutral" style={{ fontSize: 11 }}>Docker</span>
                  </div>
                </div>
                <div style={{ border: '1px solid #d8d8d8', borderRadius: 8, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#080808', marginBottom: 8 }}>Credentials</div>
                  <div style={{ fontSize: 11, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 7px', borderRadius: 4, marginBottom: 4 }}>✓ AWS Solutions Architect</div>
                  <div style={{ fontSize: 11, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '4px 7px', borderRadius: 4 }}>✓ Meta Senior React Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingTier, setPricingTier] = useState('pro');

  const handlePlanSelect = (tier) => {
    if (tier === 'free') {
      sessionStorage.removeItem('pendingCheckoutPlan');
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/register?plan=free');
      }
      return;
    }
    // Paid tier ('lite' or 'pro')
    sessionStorage.setItem('pendingCheckoutPlan', tier);
    if (user) {
      setPricingTier(tier);
      setPricingOpen(true);
    } else {
      navigate(`/register?plan=${tier}`);
    }
  };

  // Structured Data Schemas for Google Rich Results
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': ['WebApplication', 'SoftwareApplication'],
    name: 'auoraa — AI Portfolio Builder',
    operatingSystem: 'All',
    applicationCategory: 'BusinessApplication, DesignApplication, DeveloperApplication',
    description: 'Turn your resume into a stunning, recruiter-ready developer portfolio in under 30 seconds. Powered by AI with 10 modular themes, Google Drive sync, AI customizer, and instant hosting.',
    url: 'https://portfolio-builder-six-jet.vercel.app/',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Starter',
        price: '0.00',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        description: '2 Classic Templates, Instant OCR extraction, shareable public link'
      },
      {
        '@type': 'Offer',
        name: 'Lite Creator',
        price: '19.00',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        description: '6 Dynamic Templates (Bento, Creative, Executive), WhatsApp Direct, Google SEO Schema'
      },
      {
        '@type': 'Offer',
        name: 'Pro Visionary',
        price: '29.00',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        description: 'All 10 Templates, AI Customizer Chatbox, Natural Language Styling, Verified Pro Badge'
      }
    ],
    featureList: [
      'Instant AI Resume Extraction from PDF, DOCX, and TXT',
      'Google Drive Resume Import & Sync',
      '10 Modular Designer Templates (Bento, Notion, Terminal, Minimal, Glass, Neumorphic, Executive, Creative, Split, Timeline)',
      'AI Customizer Chatbox with natural language styling',
      '1-Click WhatsApp Direct Recruiter Contact',
      'Shareable custom public URLs (/p/:username/:portfolioId)',
      'Automated schema.org Person & ProfilePage Google Rich Snippets',
      'Rich OpenGraph and Social Media link previews'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    }
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
    name: 'auoraa',
    url: 'https://portfolio-builder-six-jet.vercel.app/',
    description: 'AI-Powered Developer Portfolio Generator & Resume to Website Builder',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://portfolio-builder-six-jet.vercel.app/p/{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'auoraa',
    url: 'https://portfolio-builder-six-jet.vercel.app/',
    logo: 'https://portfolio-builder-six-jet.vercel.app/og-image.jpg',
    sameAs: [
      'https://github.com/2411Aditya/Portfolio-Builder'
    ]
  };

  return (
    <div className="site-wrapper">
      {/* ── SEO Head & Schema Markup ── */}
      <SEO
        title="auoraa — AI Portfolio Builder | Free Developer Portfolio Generator & Resume to Website"
        description="Turn your resume into a stunning, recruiter-ready developer portfolio in under 30 seconds. Powered by AI with 10 modular themes, Google Drive sync, AI customizer, and rich SEO."
        keywords={[
          'auoraa',
          'AI Portfolio Builder',
          'Resume to Website',
          'Free Developer Portfolio Generator',
          'Bento Portfolio',
          'Notion Portfolio',
          'Terminal Portfolio',
          'AI Resume Parser',
          'Developer Portfolio Maker',
          'Online Portfolio Builder',
          'Recruiter Ready Portfolio'
        ]}
        url="https://portfolio-builder-six-jet.vercel.app/"
        type="website"
        schema={[softwareAppSchema, faqSchema, websiteSchema, organizationSchema]}
      />


      {/* ── Header & Navbar ── */}
      <header>
        <nav className="nav-bar" aria-label="Main Navigation">
          <div className="nav-container">
            <Link to="/" className="nav-brand" aria-label="auoraa Homepage">
              <img src={logoImg} alt="auoraa Logo" className="brand-logo" />
              <span>auoraa</span>
            </Link>
            <div className="nav-links">
              <a href="#categories" className="nav-link">Product Features</a>
              <a href="#preview" className="nav-link">Live Preview</a>
              <a href="#workflow" className="nav-link">How It Works</a>
              <a href="#pricing" className="nav-link">Pricing & Plans</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </div>
            <div className="nav-actions">
              <Link to="/login" className="nav-link" style={{ padding: '8px 12px' }}>Sign In</Link>
              <Link to="/register" id="nav-get-started-btn" className="button-primary">Get Started Free</Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Main Content Landmark ── */}
      <main>
        {/* ── Hero Band ── */}
        <section className="hero-band" style={{ position: 'relative', overflow: 'hidden' }} aria-labelledby="hero-heading">
          {/* Interactive DotField Background (Home Page Only) */}
          <div style={{ width: '100%', height: '600px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 0, pointerEvents: 'auto', opacity: 0.85 }}>
            <DotField
              dotRadius={1.5}
              dotSpacing={14}
              bulgeStrength={67}
              glowRadius={160}
              sparkle={false}
              waveAmplitude={0}
              cursorRadius={500}
              cursorForce={0.1}
              bulgeOnly
              gradientFrom="#000000"
              gradientTo="#000000"
              glowColor="rgba(0, 0, 0, 0.12)"
            />
          </div>

          <div className="hero-inner" style={{ position: 'relative', zIndex: 2 }}>
            <div className="hero-eyebrow">
              <span className="eyebrow-uppercase">THE AI PLATFORM FOR DEVELOPERS</span>
            </div>

            <h1 id="hero-heading" className="display-xxl hero-title">
              From raw resume to live recruiter-ready portfolio in seconds
            </h1>

            <p className="body-lg hero-sub">
              Upload your resume in PDF, DOCX, or TXT. Our neural parser extracts your roles, tech stack, and achievements into structured data and publishes a shareable portfolio instantly.
            </p>

            <div className="hero-cta-group">
              <Link to="/register" id="hero-cta-primary" className="button-primary" aria-label="Build My Portfolio">
                Build My Portfolio <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
              <a href="#preview" id="hero-cta-secondary" className="button-secondary" aria-label="Explore Live Demo">
                Explore Live Demo
              </a>
            </div>

            {/* Centerpiece Upload Card */}
            <div className="upload-card-wrapper">
              <UploadCard />
            </div>
          </div>
        </section>

        {/* ── The 5-Stop Chromatic Category Palette Showcase ── */}
        <section className="category-section" id="categories" aria-labelledby="categories-heading">
          <div className="category-container">
            <div className="category-header">
              <div className="eyebrow-uppercase" style={{ marginBottom: 12 }}>PRODUCT CAPABILITIES</div>
              <h2 id="categories-heading" className="display-lg">
                Engineered for maximum recruiter conversion
              </h2>
            </div>

            <div className="category-grid">
              {/* Card 1: Purple (AI Deep Extraction) - Spans 7 cols */}
              <div className="category-card-purple cat-col-7">
                <span className="cat-card-tag">AI Extraction</span>
                <h3 className="cat-card-title">Multi-Format Neural OCR & Semantic Parser</h3>
                <p className="cat-card-desc">
                  Accepts PDF, DOCX, and TXT resumes. Automatically isolates skills, certifications, work experiences, and links into structured JSON-LD entities with zero manual effort.
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge-info" style={{ background: 'rgba(255,255,255,0.2)' }}>OCR Engine</span>
                  <span className="badge-info" style={{ background: 'rgba(255,255,255,0.2)' }}>Skill Normalization</span>
                  <span className="badge-info" style={{ background: 'rgba(255,255,255,0.2)' }}>Schema Extraction</span>
                </div>
              </div>

              {/* Card 2: Pink (Multi-Theme Studio) - Spans 5 cols */}
              <div className="category-card-pink cat-col-5">
                <span className="cat-card-tag">Design Studio</span>
                <h3 className="cat-card-title">Dynamic Multi-Theme System</h3>
                <p className="cat-card-desc">
                  Toggle seamlessly between high-contrast dark terminal mode and crisp editorial light canvas. Both themes are calibrated to 4px/8px radii and WCAG AAA compliance.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span className="badge-info" style={{ background: 'rgba(255,255,255,0.2)' }}>Dark Mode</span>
                  <span className="badge-info" style={{ background: 'rgba(255,255,255,0.2)' }}>Light Canvas</span>
                </div>
              </div>

              {/* Card 3: Blue (Zero-Config Edge Hosting) - Spans 4 cols */}
              <div className="category-card-blue cat-col-4">
                <span className="cat-card-tag">Edge Hosting</span>
                <h3 className="cat-card-title" style={{ fontSize: 22 }}>Instant Shareable Permalinks</h3>
                <p className="cat-card-desc">
                  Every portfolio receives a clean public URL at <code>/p/username/id</code> hosted on global edge CDN with sub-50ms latency.
                </p>
              </div>

              {/* Card 4: Orange (Recruiter Analytics & SEO) - Spans 4 cols */}
              <div className="category-card-orange cat-col-4">
                <span className="cat-card-tag">SEO & OpenGraph</span>
                <h3 className="cat-card-title" style={{ fontSize: 22 }}>Automated Schema & Rich Cards</h3>
                <p className="cat-card-desc">
                  Embedded JSON-LD <code>Person</code> and <code>ProfilePage</code> schemas ensure prominent indexing on Google and beautiful social link previews.
                </p>
              </div>

              {/* Card 5: Green (Verified Credentials & WhatsApp) - Spans 4 cols */}
              <div className="category-card-green cat-col-4">
                <span className="cat-card-tag">Recruiter Action</span>
                <h3 className="cat-card-title" style={{ fontSize: 22 }}>1-Click WhatsApp Direct</h3>
                <p className="cat-card-desc" style={{ color: '#080808' }}>
                  Enable direct, frictionless communication with hiring managers and tech recruiters directly through instant messaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Interactive Live Preview Bento ── */}
        <section className="preview-section" id="preview" aria-labelledby="preview-heading">
          <div className="preview-container">
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="eyebrow-uppercase" style={{ marginBottom: 10 }}>INTERACTIVE PREVIEW</div>
              <h2 id="preview-heading" className="display-lg">
                Your portfolio, beautifully engineered
              </h2>
              <p className="body-md" style={{ maxWidth: 640, margin: '12px auto 0' }}>
                Preview the crisp, responsive layout generated automatically from candidate resumes.
              </p>
            </div>

            <BrowserMockup />
          </div>
        </section>

        {/* ── How It Works (3-Step Workflow) ── */}
        <section className="workflow-section" id="workflow" aria-labelledby="workflow-heading">
          <div className="category-container">
            <div className="category-header">
              <div className="eyebrow-uppercase" style={{ marginBottom: 12 }}>3-STEP WORKFLOW</div>
              <h2 id="workflow-heading" className="display-lg">
                From document to live site in 30 seconds
              </h2>
            </div>

            <div className="workflow-grid">
              <div className="workflow-card">
                <span className="workflow-num">01 / UPLOAD</span>
                <h3 className="workflow-title">Drop Your Resume</h3>
                <p className="body-md">
                  Upload your existing PDF, DOCX, or TXT file. No manual form filling or copy-pasting required.
                </p>
              </div>

              <div className="workflow-card">
                <span className="workflow-num">02 / EXTRACT</span>
                <h3 className="workflow-title">Neural Semantic Scan</h3>
                <p className="body-md">
                  Our AI identifies work history, tech skills, education, and credentials, organizing them into a structured portfolio graph.
                </p>
              </div>

              <div className="workflow-card">
                <span className="workflow-num">03 / PUBLISH</span>
                <h3 className="workflow-title">Instant Live URL</h3>
                <p className="body-md">
                  Share your personalized link on LinkedIn, resumes, and email signatures with built-in recruiter contact buttons.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing & Tier Plans Section ── */}
        <section className="pricing-section" id="pricing" aria-labelledby="pricing-heading">
          <div className="category-container">
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div className="eyebrow-uppercase" style={{ marginBottom: 12 }}>TRANSPARENT TIER ACCESS</div>
              <h2 id="pricing-heading" className="display-lg">
                Choose the perfect portfolio plan
              </h2>
              <p className="body-md" style={{ maxWidth: 640, margin: '12px auto 0', color: 'var(--color-body)' }}>
                One-time simple pricing with instant activation. Unlock modular templates and AI-powered custom styling.
              </p>
            </div>

            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1060, margin: '0 auto' }}>
              
              {/* Card 1: Free Starter */}
              <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="pricing-card-header">
                  <span className="pricing-tag">FREE FOREVER</span>
                  <h3 className="pricing-title">Free Starter</h3>
                  <p className="pricing-desc">Essential resume parsing and clean classic layout.</p>
                  <div className="pricing-price-wrap">
                    <span className="pricing-price">₹0</span>
                    <span className="pricing-period">/ forever</span>
                  </div>
                </div>
                <ul className="pricing-features" style={{ margin: '20px 0' }}>
                  <li><Check size={16} className="feature-check" /> 2 Classic Templates (Minimal & Terminal)</li>
                  <li><Check size={16} className="feature-check" /> Instant AI Resume OCR & Extraction</li>
                  <li><Check size={16} className="feature-check" /> Standard Dark & Light Canvas Modes</li>
                  <li><Check size={16} className="feature-check" /> Shareable Public URL (<code>/p/user/id</code>)</li>
                  <li><Check size={16} className="feature-check" /> Unlimited Profile Visits</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('free')}
                  className="button-secondary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'auto', padding: '12px' }}
                >
                  Get Started Free
                </button>
              </div>

              {/* Card 2: Lite Creator */}
              <div className="pricing-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div className="pricing-card-header">
                  <span className="pricing-tag" style={{ background: '#e0f2fe', color: '#0284c7' }}>LITE CREATOR</span>
                  <h3 className="pricing-title">Lite Creator</h3>
                  <p className="pricing-desc">Dynamic modern layouts to captivate recruiters.</p>
                  <div className="pricing-price-wrap">
                    <span className="pricing-price">₹19</span>
                    <span className="pricing-period">/ month</span>
                  </div>
                </div>
                <ul className="pricing-features" style={{ margin: '20px 0' }}>
                  <li><Check size={16} className="feature-check" /> 6 Dynamic Templates (Bento, Executive, Creative, Split)</li>
                  <li><Check size={16} className="feature-check" /> Modern Bento Grid & Sidebar Hierarchy</li>
                  <li><Check size={16} className="feature-check" /> Priority Global Edge CDN Hosting</li>
                  <li><Check size={16} className="feature-check" /> WhatsApp Direct Contact Button</li>
                  <li><Check size={16} className="feature-check" /> Google SEO Schema & Indexing</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('lite')}
                  className="button-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#0284c7', borderColor: '#0284c7' }}
                >
                  Get Lite Plan (₹19/mo)
                </button>
              </div>

              {/* Card 3: Pro Visionary */}
              <div className="pricing-card featured" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #a855f7' }}>
                <div className="pricing-popular-badge" style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
                  <Sparkles size={12} /> BEST VALUE • ALL 10 TEMPLATES + AI
                </div>
                <div className="pricing-card-header">
                  <span className="pricing-tag pro" style={{ background: '#f3e8ff', color: '#7e22ce' }}>PRO VISIONARY</span>
                  <h3 className="pricing-title">Pro Visionary</h3>
                  <p className="pricing-desc">Full suite of 10 templates with AI Customizer Chatbox.</p>
                  <div className="pricing-price-wrap">
                    <span className="pricing-price">₹29</span>
                    <span className="pricing-period">/ month</span>
                  </div>
                </div>
                <ul className="pricing-features" style={{ margin: '20px 0' }}>
                  <li><Check size={16} className="feature-check" /> All 10 Templates (Glass, Timeline, Notion, Neumorphic)</li>
                  <li><Check size={16} className="feature-check" /> <strong>AI Customizer Chatbox</strong> (Natural Language Styling)</li>
                  <li><Check size={16} className="feature-check" /> Custom Color & Typography Palette Tuning</li>
                  <li><Check size={16} className="feature-check" /> AI Resume Content Refinements</li>
                  <li><Check size={16} className="feature-check" /> Verified Pro Badge on Live Link</li>
                </ul>
                <button
                  type="button"
                  onClick={() => handlePlanSelect('pro')}
                  className="button-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none' }}
                >
                  <Sparkles size={16} /> Unlock All 10 + AI (₹29/mo)
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="faq-section" id="faq" aria-labelledby="faq-heading">
          <div className="faq-container">
            <div style={{ textAlign: 'center' }}>
              <div className="eyebrow-uppercase" style={{ marginBottom: 12 }}>QUESTIONS & ANSWERS</div>
              <h2 id="faq-heading" className="display-lg">Frequently Asked Questions</h2>
            </div>

            <div className="faq-list">
              {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ── Polarity-Flipped Dark CTA Band (hero-band-dark) ── */}
        <section className="hero-band-dark" aria-labelledby="cta-heading">
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            <div className="eyebrow-uppercase" style={{ color: '#ababab', marginBottom: 14 }}>READY TO STAND OUT?</div>
            <h2 id="cta-heading" className="display-xl" style={{ color: '#ffffff' }}>
              Generate your recruiter-ready portfolio now
            </h2>
            <p className="body-lg" style={{ color: '#ababab', margin: '16px auto 32px' }}>
              Join thousands of developers and tech professionals who turn their resumes into live interactive websites in seconds.
            </p>
            <Link to="/register" id="cta-bottom-register" className="button-secondary" style={{ padding: '14px 28px', fontSize: 16 }}>
              Get Started Free <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer with Complete Legal & Consent Links ── */}
      <footer className="footer-band">
        <div className="footer-container">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <img src={logoImg} alt="auoraa Logo" style={{ height: 38, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-ink)' }}>auoraa</span>
            </div>
            <p className="body-sm">The visual web development platform for developer portfolios.</p>
          </div>
          <div className="footer-links">
            <a href="#pricing">Pricing & Free Trial</a>
            <Link to="/privacy">Privacy Policy & Disclosures</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            >
              Cookie Settings
            </button>
            <Link to="/login">Sign In</Link>
            <span style={{ color: 'var(--color-mute)' }}>•</span>
            <span style={{ color: 'var(--color-mute)' }}>© 2026 auoraa. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ── Global Pricing & Upgrade Modal with Razorpay ── */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        initialTier={pricingTier}
      />
    </div>
  );
}

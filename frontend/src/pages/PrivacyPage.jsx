import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, FileText, Bell, CheckCircle2,
  Trash2, RefreshCw, Eye, Globe, Mail, ArrowLeft,
  Sparkles, CreditCard, HardDrive, Database, Cpu,
  Layers, ExternalLink, Settings, Check
} from 'lucide-react';
import SEO from '../components/SEO';
import logoImg from '../assets/Logo.png';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const privacyPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy & Data Disclosure | auoraa',
    url: 'https://portfolio-builder-six-jet.vercel.app/privacy',
    description: 'Learn how auoraa collects, processes, and protects your resume data, Google Gemini AI parsing, Razorpay billing terms, Supabase security, and zero data selling commitment.',
    publisher: {
      '@type': 'Organization',
      name: 'auoraa',
      url: 'https://portfolio-builder-six-jet.vercel.app/'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'auoraa',
        item: 'https://portfolio-builder-six-jet.vercel.app/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Privacy Policy',
        item: 'https://portfolio-builder-six-jet.vercel.app/privacy'
      }
    ]
  };

  return (
    <div className="site-wrapper" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <SEO
        title="Privacy Policy & Data Disclosure | auoraa"
        description="Comprehensive Privacy Policy & Data Disclosure for auoraa. Learn about our Google Gemini AI resume extraction, Supabase data isolation, Razorpay payment processing, cookie controls, and instant 1-click erasure."
        url="https://portfolio-builder-six-jet.vercel.app/privacy"
        type="website"
        schema={[privacyPageSchema, breadcrumbSchema]}
      />

      {/* ── Top Header Bar ── */}
      <header>
        <nav className="nav-bar">
          <div className="nav-container">
            <Link to="/" className="nav-brand">
              <img src={logoImg} alt="auoraa Logo" className="brand-logo" />
              <span>auoraa</span>
            </Link>
            <div className="nav-links">
              <Link to="/" className="button-secondary" style={{ padding: '7px 14px', fontSize: 13, gap: 6 }}>
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <Link to="/register" className="button-primary" style={{ padding: '7px 14px', fontSize: 13 }}>
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Privacy Policy Content Container ── */}
      <main className="privacy-page-container">
        {/* Header Hero */}
        <div className="privacy-hero">
          <div className="eyebrow-uppercase" style={{ marginBottom: 12 }}>LEGAL & DATA GOVERNANCE</div>
          <h1 className="display-lg" style={{ marginBottom: 16 }}>
            Privacy Policy & Data Disclosure
          </h1>
          <p className="body-lg" style={{ maxWidth: 780, margin: '0 auto 24px', color: 'var(--color-body)' }}>
            Effective Date: <strong>September 6, 2026</strong> • Last Updated: <strong>September 6, 2026</strong>
          </p>

          <div className="privacy-highlights-grid">
            <div className="privacy-highlight-card">
              <Shield size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">Zero Data Selling</div>
              <div className="privacy-highlight-desc">We never sell, rent, trade, or monetize your resume, contact details, or generated portfolio data.</div>
            </div>
            <div className="privacy-highlight-card">
              <Cpu size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">No Model Training on Data</div>
              <div className="privacy-highlight-desc">Your resumes and customization prompts sent to Google Gemini AI are never used to train public foundation models.</div>
            </div>
            <div className="privacy-highlight-card">
              <Trash2 size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">1-Click Instant Erasure</div>
              <div className="privacy-highlight-desc">Deleting any portfolio immediately removes all database records and terminates the live public permalink.</div>
            </div>
            <div className="privacy-highlight-card">
              <CreditCard size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">Transparent Direct Pricing</div>
              <div className="privacy-highlight-desc">Permanent ₹0 Free tier, direct upfront paid upgrades with instant activation, and zero surprise fees.</div>
            </div>
          </div>
        </div>

        {/* Quick Table of Contents Bar */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 36,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Navigation
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13 }}>
            <a href="#overview" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>1. Overview</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#data-collection" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>2. Information Collected</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#ai-processing" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>3. AI & Google Gemini Disclosure</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#cloud-imports" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>4. Google Drive Imports</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#billing-terms" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>5. Pricing & Razorpay Billing</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#subscription-terms" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>6. Subscriptions & Cancellation</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#tracking-cookies" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>7. Tracking & Cookies</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#subprocessors" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>8. Subprocessors</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#user-rights" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>9. Your Rights & Erasure</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#security" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>10. Security Safeguards</a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a href="#contact" style={{ color: 'var(--color-brand)', textDecoration: 'none' }}>11. Contact Us</a>
          </div>
        </div>

        {/* Article Body */}
        <article className="privacy-article">
          {/* Section 1 */}
          <section className="privacy-section" id="overview">
            <h2>1. Overview & Commitment to Transparency</h2>
            <p>
              At <strong>auoraa</strong> ("we", "our", or "us"), we are dedicated to providing engineers, designers, and creators with an intelligent, visual portfolio platform while treating candidate personal data with the highest degree of security, transparency, and privacy governance.
            </p>
            <p>
              This Privacy Policy & Data Disclosure governs your access to and use of auoraa (hosted at <code>portfolio-builder-six-jet.vercel.app</code> and associated subdomains), including our AI resume parsing engine, 10 modular portfolio templates, natural language design customizer, Google Drive imports, account dashboard, and subscription payment checkout services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="privacy-section" id="data-collection">
            <h2>2. Information We Collect & Data Disclosure</h2>
            <p>We collect and process the following categories of information solely to provide, operate, and refine our services:</p>

            <div className="privacy-sub-box">
              <h3>A. Account & Profile Information</h3>
              <p>When you register for an account, we store:</p>
              <ul>
                <li>Your chosen display username and registered email address.</li>
                <li>Cryptographically salted and hashed authentication credentials (managed via Supabase Auth). We never have access to or store plaintext passwords.</li>
                <li>Your subscription plan status (Free Starter, Lite Creator, or Pro Visionary).</li>
              </ul>
            </div>

            <div className="privacy-sub-box">
              <h3>B. Uploaded Resume & Extracted Career Data</h3>
              <p>
                When you upload a resume document (PDF, DOCX, TXT, or image scans including PNG, JPG, JPEG, WEBP), our processing engine extracts structured career information:
              </p>
              <ul>
                <li>Full name, professional title, headline, and bio summary.</li>
                <li>Work history, employer names, role titles, tenure dates, and achievement bullets.</li>
                <li>Technical skill sets, tools, certifications, and educational credentials.</li>
                <li>Public contact and portfolio links (GitHub, LinkedIn, personal website, WhatsApp number, and email).</li>
              </ul>
              <p>
                This information is compiled into a structured JSON portfolio graph to render and publish your chosen modular template at your designated public permalink (<code>/p/:username/:portfolioId</code>).
              </p>
            </div>

            <div className="privacy-sub-box">
              <h3>C. Payment & Billing Transactions</h3>
              <p>
                When you upgrade to a paid plan (Lite Creator at ₹19/mo or Pro Visionary at ₹29/mo), payments are processed directly through certified, PCI-DSS Level 1 compliant payment gateways (including <strong>Razorpay</strong> and <strong>Stripe</strong>). auoraa never collects, transmits, or stores complete credit card numbers, debit card details, CVVs, UPI PINs, or net banking credentials on our infrastructure. We retain only non-sensitive order metadata (transaction ID, currency, plan tier, and payment status) for audit, invoicing, and account provisioning.
              </p>
            </div>

            <div className="privacy-sub-box">
              <h3>D. Local Storage, Cookies & Telemetry</h3>
              <p>
                We use standard browser local storage (<code>localStorage</code>) to persist your authentication session and your explicit cookie consent preferences (<code>auoraa_cookie_consent</code>). With your affirmative opt-in consent, we collect privacy-respecting telemetry via Google Analytics (with IP anonymization) and Meta Pixel conversion metrics.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="privacy-section" id="ai-processing">
            <h2>3. AI Processing & Google Gemini Disclosure</h2>
            <p>
              auoraa utilizes state-of-the-art Artificial Intelligence to automate resume extraction and interactive portfolio customization. We maintain strict boundaries regarding how AI subprocessors interact with your data:
            </p>
            <div className="privacy-sub-box">
              <h3>Google Gemini 2.5 Flash / Google Generative AI API</h3>
              <ul>
                <li>
                  <strong>Resume Parsing:</strong> Document text and image scans are parsed transiently via the Google Gemini API to produce structured JSON data matching our schema.
                </li>
                <li>
                  <strong>AI Customizer Drawer (Pro Visionary):</strong> When you provide natural language prompts (such as requesting emerald theme styling, executive tone revisions, or custom skill highlights), your current portfolio JSON and prompt are sent to Gemini to generate style tokens and copy refinements.
                </li>
                <li>
                  <strong>Zero Training Guarantee:</strong> Data transmitted to the Google Gemini API for auoraa is processed under enterprise terms: your resume text, images, and creative prompts are <strong>never used to train or fine-tune public foundation AI models</strong>.
                </li>
                <li>
                  <strong>Transient In-Memory Processing:</strong> Uploaded resume files are processed in-memory during extraction and are not stored in persistent third-party AI repositories.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="privacy-section" id="cloud-imports">
            <h2>4. Google Drive & Cloud Document Imports</h2>
            <p>
              auoraa provides a Google Drive Import feature allowing you to paste a shareable Google Drive or Google Docs link.
            </p>
            <ul>
              <li><strong>Shareable Link Access:</strong> The tool only processes links that you have configured as publicly accessible ("Anyone with the link can view").</li>
              <li><strong>Ephemeral Extraction:</strong> The document contents are retrieved solely to perform the initial AI resume parse, after which the temporary link reference is discarded. We do not access, scan, or index other files in your Google Drive.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="privacy-section" id="billing-terms">
            <h2>5. Pricing Tiers & Razorpay Billing Disclosures</h2>
            <p>
              auoraa offers clear, transparent pricing designed to eliminate unexpected recurring surprises:
            </p>
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Plan Tier</th>
                    <th>Price</th>
                    <th>Included Features</th>
                    <th>Billing Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Free Starter</strong></td>
                    <td>₹0 (Forever Free)</td>
                    <td>2 Classic Templates (Minimal & Terminal), AI Resume Parsing, Instant Public URL, Unlimited Views</td>
                    <td>Free / No card required</td>
                  </tr>
                  <tr>
                    <td><strong>Lite Creator</strong></td>
                    <td>₹19 / month</td>
                    <td>6 Dynamic Templates (Bento, Executive, Creative Bold, Split Screen + Free), Priority CDN Hosting, WhatsApp & Social Links</td>
                    <td>Monthly Recurring / Cancel anytime</td>
                  </tr>
                  <tr>
                    <td><strong>Pro Visionary</strong></td>
                    <td>₹29 / month</td>
                    <td>All 10 Modular Templates, AI Customizer Drawer, Natural Language Theme Engine, Verified Pro Badge, SEO JSON-LD Schemas</td>
                    <td>Monthly Recurring / Cancel anytime</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              All transactions are encrypted and processed through <strong>Razorpay</strong> (supporting UPI, Credit Cards, Debit Cards, NetBanking, and Mobile Wallets) and <strong>Stripe</strong>. Invoices and receipts are automatically dispatched to your registered email address upon every successful transaction.
            </p>
          </section>

          {/* Section 6 */}
          <section className="privacy-section" id="subscription-terms">
            <h2>6. Subscription Terms, Immediate Activation & Cancellation Policy</h2>
            <p>
              We maintain direct, straightforward billing policies with no hidden commitments:
            </p>
            <ul>
              <li><strong>No Free Trials on Paid Tiers:</strong> auoraa provides a permanent Free Starter tier (₹0 forever) allowing anyone to build and host portfolios with classic templates at zero cost. Paid plans (Lite Creator ₹19/mo and Pro Visionary ₹29/mo) are charged upfront upon checkout with immediate feature activation and do not include trial periods.</li>
              <li><strong>Recurring Billing & Invoicing:</strong> Subscriptions are billed automatically on a monthly recurring cycle from your initial upgrade date. Itemized receipts and invoices are sent directly to your registered email address upon each successful transaction.</li>
              <li><strong>1-Click Cancellation Anytime:</strong> You may cancel auto-renewal at any time with a single click directly from your Dashboard settings with zero cancellation fees. Upon cancellation, you retain full Pro or Lite access until the conclusion of your current prepaid billing period.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="privacy-section" id="tracking-cookies">
            <h2>7. Tracking Choices, Google Analytics & Meta Pixel</h2>
            <p>
              We believe users should have absolute control over third-party tracking. We divide our browser storage into three clear categories:
            </p>
            <ul>
              <li><strong>Strictly Necessary:</strong> Essential for Supabase JWT authentication, state preservation, and security validation. These cannot be deactivated.</li>
              <li><strong>Analytics (Google Analytics GA4):</strong> Measures anonymous platform engagement, resume extraction success rates, and performance telemetry with IP anonymization enabled. Activated only after affirmative opt-in.</li>
              <li><strong>Marketing (Meta Pixel):</strong> Measures conversion metrics from advertising campaigns across Meta (Facebook & Instagram). Activated only after affirmative opt-in.</li>
            </ul>
            <p>
              You can adjust or revoke your tracking choices at any moment by clicking the button below:
            </p>
            <div style={{ marginTop: 12, marginBottom: 16 }}>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
                className="button-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '8px 16px' }}
              >
                <Settings size={14} /> Open Cookie & Tracking Settings
              </button>
            </div>
          </section>

          {/* Section 8 */}
          <section className="privacy-section" id="subprocessors">
            <h2>8. Third-Party Service Providers (Subprocessors)</h2>
            <p>
              We collaborate with reputable infrastructure and security partners to host, secure, and deliver the platform:
            </p>
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Subprocessor</th>
                    <th>Purpose</th>
                    <th>Location / Certifications</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Supabase (PostgreSQL & Edge Functions)</strong></td>
                    <td>Database storage, Row Level Security (RLS), authentication, and Deno edge serverless functions</td>
                    <td>Global (SOC2 Type II, ISO 27001, HIPAA Compliant)</td>
                  </tr>
                  <tr>
                    <td><strong>Google Gemini AI (Google Cloud)</strong></td>
                    <td>AI Resume text/image parsing and Pro natural language style engine</td>
                    <td>USA / Global (ISO 27001, SOC2, Enterprise AI Privacy)</td>
                  </tr>
                  <tr>
                    <td><strong>Vercel & AWS Edge CDN</strong></td>
                    <td>Application deployment, global edge delivery, and fast portfolio hosting</td>
                    <td>Global (SOC2 Type II, ISO 27001, DDoS Shield)</td>
                  </tr>
                  <tr>
                    <td><strong>Razorpay Software Pvt. Ltd.</strong></td>
                    <td>Payment gateway (UPI, NetBanking, Cards, Wallets), billing verification</td>
                    <td>India / Global (PCI-DSS Level 1, ISO 27001)</td>
                  </tr>
                  <tr>
                    <td><strong>Stripe Inc.</strong></td>
                    <td>Global card billing and recurring subscription invoicing</td>
                    <td>USA / Global (PCI-DSS Level 1)</td>
                  </tr>
                  <tr>
                    <td><strong>Google Analytics (GA4)</strong></td>
                    <td>Anonymized platform usage telemetry (Opt-in only)</td>
                    <td>USA (Standard Contractual Clauses, IP Masking)</td>
                  </tr>
                  <tr>
                    <td><strong>Meta Platforms (Facebook)</strong></td>
                    <td>Ad conversion measurement (Opt-in only)</td>
                    <td>USA (Standard Contractual Clauses)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 9 */}
          <section className="privacy-section" id="user-rights">
            <h2>9. Your Rights & 1-Click Instant Data Deletion</h2>
            <p>
              In full alignment with GDPR, CCPA/CPRA, and India's Digital Personal Data Protection Act (DPDP Act 2023), you hold complete rights over your personal data:
            </p>
            <ul>
              <li><strong>Right to Erasure (1-Click Deletion):</strong> You can delete any portfolio at any time from your dashboard. Deleting a portfolio immediately destroys the database record, removes custom styling overrides, and instantly disables the public live URL.</li>
              <li><strong>Right to Rectification:</strong> You can edit portfolio contents, re-upload an updated resume, or refine your information at any time.</li>
              <li><strong>Right of Access & Portability:</strong> You can inspect and export your structured JSON portfolio graph directly from your workspace.</li>
              <li><strong>Right to Account Closure:</strong> You may request full account and profile termination, purging all associated email, profile, and portfolio records.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="privacy-section" id="security">
            <h2>10. Data Security & Cryptographic Safeguards</h2>
            <p>
              We implement comprehensive technical and administrative defenses to safeguard candidate records:
            </p>
            <ul>
              <li>All client-to-server traffic is encrypted in transit using TLS 1.3 over HTTPS.</li>
              <li>Row Level Security (RLS) is enforced across Supabase tables so users can only view and modify their own portfolios.</li>
              <li>User sessions use cryptographically signed JSON Web Tokens (JWT) with automatic expiration and refresh cycles.</li>
              <li>Payment gateways operate independently in sandboxed, PCI-compliant iframes, ensuring zero card numbers touch our application servers.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="privacy-section" id="contact">
            <h2>11. Contact & Data Protection Inquiries</h2>
            <p>
              If you have any questions, wish to exercise your statutory privacy rights, or need assistance with billing, please reach out to our dedicated compliance team:
            </p>
            <div className="privacy-contact-box">
              <Mail size={18} style={{ color: 'var(--color-ink)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>auoraa Privacy & Data Compliance Office</strong><br />
                Email: <a href="mailto:privacy@portfolio-builder.app" style={{ color: 'var(--color-brand)' }}>privacy@portfolio-builder.app</a><br />
                Support & Billing: <a href="mailto:support@portfolio-builder.app" style={{ color: 'var(--color-brand)' }}>support@portfolio-builder.app</a><br />
                Location: Bangalore, India / Global Cloud Infrastructure
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* ── Footer ── */}
      <footer className="footer-band">
        <div className="footer-container">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <img src={logoImg} alt="auoraa Logo" style={{ height: 26, width: 'auto', objectFit: 'contain' }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-ink)' }}>auoraa</span>
            </div>
            <p className="body-sm">The visual web development platform for developer portfolios.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))}
              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer' }}
            >
              Cookie Settings
            </button>
            <span style={{ color: 'var(--color-mute)' }}>•</span>
            <span style={{ color: 'var(--color-mute)' }}>© 2026 auoraa. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


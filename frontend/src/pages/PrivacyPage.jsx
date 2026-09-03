import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Lock, FileText, Bell, CheckCircle2,
  Trash2, RefreshCw, Eye, Globe, Mail, ArrowLeft
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
    description: 'Learn how auoraa collects, processes, and protects your resume data, auto-renewal billing terms, and zero data selling commitment.',
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
        description="Learn how auoraa collects, processes, and protects your resume data, our auto-renewal billing terms, free trial notification commitments, and tracking policies."
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
          <p className="body-lg" style={{ maxWidth: 780, margin: '0 auto', color: 'var(--color-body)' }}>
            Effective Date: <strong>August 24, 2026</strong> • Last Updated: <strong>August 24, 2026</strong>
          </p>
          <div className="privacy-highlights-grid">
            <div className="privacy-highlight-card">
              <Shield size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">Zero Data Selling</div>
              <div className="privacy-highlight-desc">We never sell, rent, or monetize your resume or personal details to third parties.</div>
            </div>
            <div className="privacy-highlight-card">
              <Trash2 size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">1-Click Erasure</div>
              <div className="privacy-highlight-desc">Deleting a portfolio immediately deletes its public permalink and database records.</div>
            </div>
            <div className="privacy-highlight-card">
              <Bell size={20} className="privacy-highlight-icon" />
              <div className="privacy-highlight-title">Trial Reminder Guarantee</div>
              <div className="privacy-highlight-desc">We always send advance email alerts before your free trial expires and billing starts.</div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <article className="privacy-article">
          {/* Section 1 */}
          <section className="privacy-section">
            <h2>1. Overview & Commitment to Transparency</h2>
            <p>
              At <strong>auoraa</strong> ("we", "our", or "us"), we believe developer portfolios should be effortless to build while keeping candidate data safe, transparent, and strictly under your control. This Privacy Policy & Data Disclosure explains what information we collect when you visit our website, upload your resume, generate a portfolio, or subscribe to our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="privacy-section">
            <h2>2. Information We Collect & Data Disclosure</h2>
            <p>We collect and process the following categories of data solely to provide and improve our services:</p>
            
            <div className="privacy-sub-box">
              <h3>A. Account & Profile Information</h3>
              <p>When you register for an account, we collect your chosen username, email address, and securely salted/hashed password. Passwords are never stored in plaintext.</p>
            </div>

            <div className="privacy-sub-box">
              <h3>B. Uploaded Resume & Portfolio Content</h3>
              <p>
                When you upload a document (PDF, DOCX, TXT, or image), our automated AI processing extracts structured career data, including:
              </p>
              <ul>
                <li>Full name, professional headline, and summary statement.</li>
                <li>Work experience, employer history, job titles, and achievements.</li>
                <li>Technical skills, certifications, and educational degrees.</li>
                <li>Public contact handles (GitHub, LinkedIn, email, WhatsApp, or personal website).</li>
              </ul>
              <p>
                This data is used exclusively to generate, style, and host your personalized public web portfolio at <code>/p/username/portfolioId</code>.
              </p>
            </div>

            <div className="privacy-sub-box">
              <h3>C. Payment & Billing Data</h3>
              <p>
                All payment transactions are processed securely through certified, PCI-DSS Level 1 compliant payment gateways (e.g., Stripe / Razorpay). auoraa never stores complete credit card numbers or CVV codes on our servers.
              </p>
            </div>

            <div className="privacy-sub-box">
              <h3>D. Telemetry, Analytics & Cookies</h3>
              <p>
                We use browser storage (cookies and localStorage) to preserve your session state and authentication tokens. With your affirmative consent, we also collect anonymized usage telemetry via Google Analytics and campaign attribution data via Meta Pixel.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="privacy-section">
            <h2>3. Auto-Renewal Terms & Billing Disclosures</h2>
            <p>
              To ensure uninterrupted hosting of your custom developer portfolios, paid subscription plans operate on a recurring billing cycle:
            </p>
            <ul>
              <li><strong>Billing Cycle:</strong> Subscriptions are billed automatically on a recurring monthly or annual basis depending on the plan selected at checkout.</li>
              <li><strong>Advance Notice & Invoicing:</strong> Invoices and payment receipts are automatically emailed to your registered email address upon each successful transaction.</li>
              <li><strong>Cancellation Anytime:</strong> You may cancel auto-renewal at any time with a single click directly from your Dashboard Billing Settings. Upon cancellation, you retain full Pro access until the conclusion of your current prepaid billing cycle, with no cancellation fees.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="privacy-section">
            <h2>4. Free Trial Disclosure & Email Notification Commitment</h2>
            <p>
              We maintain strict compliance with global subscription transparency standards and consumer protection guidelines:
            </p>
            <ul>
              <li><strong>Trial Duration:</strong> New Pro subscribers receive a 7-day free trial period. You will not be charged during the trial period.</li>
              <li><strong>Mandatory Email Notification:</strong> We guarantee that we will send you an email reminder <strong>3 days prior to your trial expiration</strong> and <strong>on the day of expiration</strong>, notifying you that your trial is ending and detailing the exact upcoming recurring charge.</li>
              <li><strong>Risk-Free Cancellation:</strong> If you cancel before the trial period concludes, your payment method will never be charged.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="privacy-section">
            <h2>5. Tracking Consent, Google Analytics & Meta Pixel</h2>
            <p>
              We respect your right to privacy and give you full granular control over third-party tracking:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Strictly necessary for authentication, security verification, and platform integrity. These cannot be disabled.</li>
              <li><strong>Google Analytics (GA4):</strong> Aggregates anonymized traffic metrics, feature engagement, and error logs with IP anonymization enabled. Activated only after user opt-in.</li>
              <li><strong>Meta Pixel:</strong> Measures conversion performance from advertising campaigns. Activated only after user opt-in.</li>
            </ul>
            <p>
              You can modify or revoke your tracking consent at any time by clicking the <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('openCookieSettings'))} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-brand)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Cookie Settings</button> link at the bottom of any page.
            </p>
          </section>

          {/* Section 6 */}
          <section className="privacy-section">
            <h2>6. Third-Party Service Providers (Subprocessors)</h2>
            <p>We work with trusted infrastructure providers that adhere to rigorous security standards:</p>
            <div className="privacy-table-wrap">
              <table className="privacy-table">
                <thead>
                  <tr>
                    <th>Partner / Subprocessor</th>
                    <th>Purpose</th>
                    <th>Location / Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Vercel & AWS Edge CDN</strong></td>
                    <td>Global application delivery and static portfolio hosting</td>
                    <td>USA / Global (SOC2, ISO 27001)</td>
                  </tr>
                  <tr>
                    <td><strong>Stripe / Payment Gateway</strong></td>
                    <td>Encrypted subscription billing & recurring invoicing</td>
                    <td>Global (PCI-DSS Level 1)</td>
                  </tr>
                  <tr>
                    <td><strong>Google Analytics</strong></td>
                    <td>Anonymized platform usage telemetry (Opt-in only)</td>
                    <td>USA (Privacy Shield / Standard Clauses)</td>
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

          {/* Section 7 */}
          <section className="privacy-section">
            <h2>7. Your Rights & Instant Data Deletion</h2>
            <p>
              Under GDPR, CCPA/CPRA, and global privacy standards, you hold comprehensive rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Right to Deletion (Right to be Forgotten):</strong> You can delete any portfolio instantly from your dashboard. Deletion permanently removes the data record and immediately disables the public shareable link.</li>
              <li><strong>Right to Rectification:</strong> You can edit or re-upload your resume at any time to regenerate your profile with updated details.</li>
              <li><strong>Right of Access & Portability:</strong> You can export your structured portfolio JSON graph from your dashboard.</li>
              <li><strong>Right to Opt-Out:</strong> You have the right to refuse non-essential telemetry and advertising cookies without any loss of platform functionality.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="privacy-section">
            <h2>8. Data Security & Encryption</h2>
            <p>
              We implement industry-grade technical and organizational safeguards:
            </p>
            <ul>
              <li>All web traffic is encrypted end-to-end using TLS 1.3 (HTTPS).</li>
              <li>User sessions are authenticated with cryptographically signed JSON Web Tokens (JWT).</li>
              <li>Database credentials and passwords use strong cryptographic salting and hashing.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="privacy-section">
            <h2>9. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding this Privacy Policy, your personal data, or our subscription billing terms, please contact our Data Protection team:
            </p>
            <div className="privacy-contact-box">
              <Mail size={18} style={{ color: 'var(--color-ink)' }} />
              <div>
                <strong>auoraa Privacy & Data Compliance Office</strong><br />
                Email: <a href="mailto:privacy@portfolio-builder.app" style={{ color: 'var(--color-brand)' }}>privacy@portfolio-builder.app</a><br />
                Support: <a href="mailto:support@portfolio-builder.app" style={{ color: 'var(--color-brand)' }}>support@portfolio-builder.app</a>
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

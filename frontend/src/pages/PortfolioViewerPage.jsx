import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import * as api from '../api/client';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { getTemplateComponent } from '../templates';
import AICustomizerDrawer from '../components/AICustomizerDrawer';
import PricingModal from '../components/PricingModal';
import logoImg from '../assets/Logo.png';

/* ── Floating "Built with" badge ── */
function BuiltWithBadge({ theme }) {
  return (
    <Link
      to="/"
      className={`built-with-badge${theme === 'dark' ? ' dark-theme' : ''}`}
      title="Built with auoraa"
      aria-label="Built with auoraa"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
    >
      <img src={logoImg} alt="auoraa Logo" style={{ height: 16, width: 'auto', objectFit: 'contain', borderRadius: 3 }} />
      <span>Built with auoraa</span>
    </Link>
  );
}

export default function PortfolioViewerPage() {
  const { username, portfolioId } = useParams();
  const { user } = useAuth();

  const [portfolio, setPortfolio] = useState(null);
  const [customStyles, setCustomStyles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingTier, setPricingTier] = useState('pro');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getPublicPortfolio(username, portfolioId);
        setPortfolio(res.data);
        setCustomStyles(res.data.custom_styles || {});
      } catch (err) {
        setError(err.message || 'Portfolio not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username, portfolioId]);

  if (loading) {
    return (
      <div className="pv-loading" role="status" aria-live="polite">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src={logoImg} alt="auoraa Logo" style={{ height: 32, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--fg)' }}>auoraa</span>
        </div>
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Loading portfolio…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pv-error" role="alert">
        <SEO
          title="Portfolio Not Found | auoraa"
          description="The requested portfolio could not be found or has been removed."
          noindex={true}
        />
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={28} strokeWidth={1.5} style={{ color: '#f87171' }} aria-hidden="true" />
        </div>
        <h1>Portfolio Not Found</h1>
        <p>{error}</p>
        <Link to="/" className="btn-grad" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8 }}>
          <ArrowLeft size={15} strokeWidth={1.5} aria-hidden="true" /> Go Home
        </Link>
      </div>
    );
  }

  if (!portfolio) return null;

  // Candidate dynamic information for SEO & Schema markup
  const candidateData = portfolio.data || {};
  const candidateName = customStyles.contentRefinements?.headline || candidateData.name || portfolio.owner || 'Candidate';
  const jobTitle = candidateData.title || 'Professional';
  const pageTitle = `${candidateName} - ${jobTitle} | Portfolio`;
  const canonicalUrl = `https://portfolio-builder-six-jet.vercel.app/p/${username}/${portfolioId}`;

  // Structured skills & description
  const skillsList = candidateData.skills || [];
  const topSkills = skillsList.slice(0, 6).join(', ');
  const pageDescription = customStyles.contentRefinements?.bio || candidateData.bio
    ? (candidateData.bio?.length > 160 ? `${candidateData.bio.substring(0, 157)}...` : candidateData.bio)
    : `Explore ${candidateName}'s interactive developer portfolio featuring verified experience, projects, and skills in ${topSkills || 'modern software engineering'}.`;

  const sameAsLinks = [
    candidateData.contact?.linkedin,
    candidateData.contact?.github,
    candidateData.contact?.website
  ].filter(Boolean);

  // JSON-LD Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: candidateName,
    jobTitle: jobTitle,
    description: candidateData.bio || pageDescription,
    url: canonicalUrl,
    ...(skillsList.length > 0 ? { knowsAbout: skillsList } : {}),
    ...(candidateData.contact?.email ? { email: candidateData.contact.email } : {}),
    ...(candidateData.contact?.phone ? { telephone: candidateData.contact.phone } : {}),
    ...(sameAsLinks.length > 0 ? { sameAs: sameAsLinks } : {})
  };

  // JSON-LD ProfilePage Schema
  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: pageTitle,
    url: canonicalUrl,
    mainEntity: personSchema
  };

  // Resolve template component with safe fallback to Minimal
  const TemplateComponent = getTemplateComponent(portfolio.template_id);

  // Check if current logged-in user is the owner of this portfolio
  const isOwner = user && (user.id === portfolio.user_id || user.username === portfolio.owner || user.username === username);

  const handleApplyStyles = (newStyles) => {
    setCustomStyles(newStyles);
    setPortfolio(prev => ({
      ...prev,
      custom_styles: newStyles
    }));
  };

  return (
    <>
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={[
          candidateName,
          jobTitle,
          ...skillsList,
          'Developer Portfolio',
          'Candidate Profile',
          'Professional Resume Website'
        ]}
        url={canonicalUrl}
        type="profile"
        author={candidateName}
        schema={[personSchema, profilePageSchema]}
      />

      {/* Render Selected Dynamic Template */}
      <TemplateComponent
        data={portfolio.data}
        theme={portfolio.theme}
        customStyles={customStyles}
        meta={{ title: portfolio.title, owner: portfolio.owner }}
      />

      {/* Floating AI Customizer Button (if owner is viewing) */}
      {isOwner && (
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 9990,
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 9999,
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.45)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          title="Open AI Customizer"
        >
          <Sparkles size={16} />
          <span>Customize with AI</span>
        </button>
      )}

      {/* AI Customizer Drawer */}
      <AICustomizerDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        portfolioId={portfolio.id}
        portfolioData={portfolio.data}
        currentCustomStyles={customStyles}
        onApplyStyles={handleApplyStyles}
        onOpenPricing={(tier) => {
          setPricingTier(tier || 'pro');
          setPricingOpen(true);
        }}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        initialTier={pricingTier}
      />

      <BuiltWithBadge theme={portfolio.theme} />
    </>
  );
}

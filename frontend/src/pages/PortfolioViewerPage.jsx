import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import * as api from '../api/client';
import SEO from '../components/SEO';
import DarkPortfolio from '../components/portfolio-themes/DarkPortfolio';
import LightPortfolio from '../components/portfolio-themes/LightPortfolio';

/* ── Floating "Built with" badge ── */
function BuiltWithBadge({ theme }) {
  return (
    <Link
      to="/"
      className={`built-with-badge${theme === 'dark' ? ' dark-theme' : ''}`}
      title="Built with PortfolioAI"
      aria-label="Built with PortfolioAI"
    >
      <span>Built with PortfolioAI</span>
    </Link>
  );
}

export default function PortfolioViewerPage() {
  const { username, portfolioId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getPublicPortfolio(username, portfolioId);
        setPortfolio(res.data);
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
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--fg)' }}>PortfolioAI</span>
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
          title="Portfolio Not Found | PortfolioAI"
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
  const candidateName = candidateData.name || portfolio.owner || 'Candidate';
  const jobTitle = candidateData.title || 'Professional';
  const pageTitle = `${candidateName} - ${jobTitle} | Portfolio`;
  const canonicalUrl = `https://portfolio-builder-six-jet.vercel.app/p/${username}/${portfolioId}`;

  // Structured skills & description
  const skillsList = candidateData.skills || [];
  const topSkills = skillsList.slice(0, 6).join(', ');
  const pageDescription = candidateData.bio
    ? (candidateData.bio.length > 160 ? `${candidateData.bio.substring(0, 157)}...` : candidateData.bio)
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

      {portfolio.theme === 'light'
        ? <LightPortfolio data={portfolio.data} meta={{ title: portfolio.title, owner: portfolio.owner }} />
        : <DarkPortfolio  data={portfolio.data} meta={{ title: portfolio.title, owner: portfolio.owner }} />
      }
      <BuiltWithBadge theme={portfolio.theme} />
    </>
  );
}

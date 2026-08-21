import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Zap, AlertCircle, Loader2 } from 'lucide-react';
import * as api from '../api/client';
import DarkPortfolio from '../components/portfolio-themes/DarkPortfolio';
import LightPortfolio from '../components/portfolio-themes/LightPortfolio';

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
      <div className="pv-loading">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#fff" />
          </div>
          <span className="grad" style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800 }}>PortfolioAI</span>
        </div>
        <div className="spinner" style={{ width: 40, height: 40 }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading portfolio…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pv-error">
        <div style={{ width: 64, height: 64, borderRadius: 18, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={32} color="#dc2626" />
        </div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Portfolio Not Found</h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>{error}</p>
        </div>
        <Link to="/" className="btn-grad" style={{ textDecoration: 'none' }}>
          Go Home
        </Link>
      </div>
    );
  }

  if (!portfolio) return null;

  return portfolio.theme === 'light'
    ? <LightPortfolio data={portfolio.data} meta={{ title: portfolio.title, owner: portfolio.owner }} />
    : <DarkPortfolio data={portfolio.data} meta={{ title: portfolio.title, owner: portfolio.owner }} />;
}

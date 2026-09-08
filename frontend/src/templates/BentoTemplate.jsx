import React, { useState } from 'react';
import {
  Briefcase, Code2, GraduationCap, Award, Mail, Phone,
  Globe, MessageCircle, ExternalLink, Sparkles, CheckCircle2,
  ArrowUpRight, LayoutGrid, Search, Copy, Check, Send,
  ArrowRight, ChevronRight, Cpu, CornerDownLeft
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function BentoTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'experience' | 'skills' | 'education' | 'contact'
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [projectSearch, setProjectSearch] = useState('');
  const [messageForm, setMessageForm] = useState({ name: '', email: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);

  const isDark = theme === 'dark';
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Candidate';
  const candidateTitle = data.title || 'Product Engineer & Creator';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I came across your portfolio and would like to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I came across your portfolio and would like to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  // Theme palettes
  const primaryColor = themeOverrides.primaryColor || (isDark ? '#6366f1' : '#4f46e5');
  const fontFamily = themeOverrides.fontFamily || "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  
  const colors = {
    pageBg: isDark ? (themeOverrides.backgroundColor || '#090d16') : '#f8fafc',
    cardBg: isDark ? (themeOverrides.cardBackground || 'rgba(19, 27, 46, 0.85)') : '#ffffff',
    cardBgSubtle: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f1f5f9',
    cardHeaderBg: isDark ? 'rgba(15, 22, 38, 0.95)' : '#ffffff',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
    borderLight: isDark ? 'rgba(255, 255, 255, 0.04)' : '#f1f5f9',
    textColor: isDark ? '#f8fafc' : '#0f172a',
    mutedColor: isDark ? '#94a3b8' : '#475569',
    dimColor: isDark ? '#64748b' : '#94a3b8',
    navActiveBg: isDark ? primaryColor : primaryColor,
    navActiveText: '#ffffff',
    navInactiveBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    navInactiveText: isDark ? '#94a3b8' : '#475569',
    badgeBg: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
    badgeText: isDark ? '#a5b4fc' : '#4f46e5',
    boxShadow: isDark
      ? '0 10px 30px -5px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.06)'
      : '0 10px 30px -5px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(226, 232, 240, 0.9)',
    heroGradient: isDark
      ? `linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(19, 27, 46, 0.9) 60%)`
      : `linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, #ffffff 60%)`
  };

  const navTabs = [
    { id: 'overview', name: 'Overview', icon: LayoutGrid },
    { id: 'projects', name: `Projects (${projects.length})`, icon: Code2 },
    { id: 'experience', name: `Experience (${experience.length})`, icon: Briefcase },
    { id: 'skills', name: `Stack (${skills.length})`, icon: Cpu },
    { id: 'education', name: 'Credentials', icon: GraduationCap },
    { id: 'contact', name: 'Contact', icon: Mail },
  ];

  // Extract unique tech tags for project filtering
  const allTechTags = ['ALL', ...Array.from(new Set(projects.flatMap(p => p.tech || [])))].slice(0, 10);

  const filteredProjects = projects.filter(proj => {
    const matchesFilter = projectFilter === 'ALL' || (proj.tech && proj.tech.includes(projectFilter));
    const matchesSearch = !projectSearch.trim() || 
      proj.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (proj.description && proj.description.toLowerCase().includes(projectSearch.toLowerCase())) ||
      (proj.tech && proj.tech.some(t => t.toLowerCase().includes(projectSearch.toLowerCase())));
    return matchesFilter && matchesSearch;
  });

  const copyEmail = () => {
    if (contact.email) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyPhoneNumber = () => {
    if (contact.phone || contact.whatsapp) {
      navigator.clipboard.writeText(contact.phone || contact.whatsapp);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageForm.email && !messageForm.message) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.pageBg,
      color: colors.textColor,
      fontFamily,
      padding: '36px 20px 80px',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>

        {/* ── Top Bento Navigation Header ── */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 28,
          background: colors.cardBg,
          padding: '12px 18px',
          borderRadius: 20,
          border: `1px solid ${colors.borderColor}`,
          boxShadow: colors.boxShadow
        }}>
          {/* Logo / Candidate Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${primaryColor}, #a855f7)`,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              boxShadow: `0 4px 12px ${primaryColor}44`
            }}>
              {candidateName.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>{candidateName}</div>
              <div style={{ fontSize: 11, color: colors.mutedColor }}>{candidateTitle}</div>
            </div>
          </div>

          {/* Multi-Page Bento Segmented Nav Tabs */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflowX: 'auto',
            padding: '4px',
            background: colors.cardBgSubtle,
            borderRadius: 14,
            border: `1px solid ${colors.borderColor}`,
            scrollbarWidth: 'none'
          }}>
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 14px',
                    borderRadius: 10,
                    border: 'none',
                    background: isActive ? colors.navActiveBg : 'transparent',
                    color: isActive ? colors.navActiveText : colors.navInactiveText,
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    fontFamily,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? `0 2px 8px ${primaryColor}44` : 'none'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* WhatsApp Direct Header Action */}
          <div>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                background: '#25D366',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 12.5,
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                transition: 'transform 0.15s ease'
              }}
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </header>

        {/* ════════════════════ PAGE 1: OVERVIEW ════════════════════ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            
            {/* Hero Card (Span 8) */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.heroGradient,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 24,
              padding: '36px 32px',
              boxShadow: colors.boxShadow,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: -50, right: -50, width: 220, height: 220,
                background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
                borderRadius: '50%', pointerEvents: 'none'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 9999,
                  background: colors.badgeBg,
                  color: colors.badgeText,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <Sparkles size={13} /> Open to New Roles & Projects
                </span>
                {contact.location && (
                  <span style={{ fontSize: 12, color: colors.mutedColor }}>
                    📍 {contact.location}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px', color: colors.textColor }}>
                {candidateName}
              </h1>
              <div style={{ fontSize: 18, color: primaryColor, fontWeight: 700, marginBottom: 16 }}>
                {candidateTitle}
              </div>
              {candidateBio && (
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: colors.mutedColor, maxWidth: 740 }}>
                  {candidateBio}
                </p>
              )}

              {/* Quick Stat Counter Pills */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${colors.borderColor}` }}>
                <div style={{ background: colors.cardBgSubtle, padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Briefcase size={16} style={{ color: primaryColor }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{experience.length} Career Roles</span>
                </div>
                <div style={{ background: colors.cardBgSubtle, padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 size={16} style={{ color: primaryColor }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{projects.length} Featured Works</span>
                </div>
                <div style={{ background: colors.cardBgSubtle, padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cpu size={16} style={{ color: primaryColor }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{skills.length} Technical Skills</span>
                </div>
              </div>
            </div>

            {/* AI Focus Strengths Bento Banner */}
            {highlightedSkills.length > 0 && (
              <div style={{
                gridColumn: 'span 12',
                background: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: 20,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                boxShadow: colors.boxShadow
              }}>
                <span style={{ fontWeight: 700, color: primaryColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <Sparkles size={16} /> Key Core Specializations:
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {highlightedSkills.map((sk, i) => (
                    <span key={i} style={{ padding: '4px 14px', background: primaryColor, color: '#ffffff', borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Section Hub Bento Cards (4 Quick Navigation Bento Tiles) */}
            <div style={{
              gridColumn: 'span 12',
              marginTop: 4
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.mutedColor, marginBottom: 12 }}>
                Explore Portfolio Modules
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                
                {/* Jump to Projects Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 18,
                    padding: 20,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: colors.textColor,
                    fontFamily,
                    boxShadow: colors.boxShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code2 size={18} />
                    </span>
                    <ArrowRight size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Projects & Works</div>
                    <div style={{ fontSize: 12, color: colors.mutedColor, marginTop: 3 }}>
                      Explore {projects.length} production applications & repositories
                    </div>
                  </div>
                </button>

                {/* Jump to Experience Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('experience')}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 18,
                    padding: 20,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: colors.textColor,
                    fontFamily,
                    boxShadow: colors.boxShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={18} />
                    </span>
                    <ArrowRight size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Career Experience</div>
                    <div style={{ fontSize: 12, color: colors.mutedColor, marginTop: 3 }}>
                      {experience.length} career milestones, teams & impact metrics
                    </div>
                  </div>
                </button>

                {/* Jump to Skills Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('skills')}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 18,
                    padding: 20,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: colors.textColor,
                    fontFamily,
                    boxShadow: colors.boxShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Cpu size={18} />
                    </span>
                    <ArrowRight size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Technical Stack</div>
                    <div style={{ fontSize: 12, color: colors.mutedColor, marginTop: 3 }}>
                      {skills.length} frameworks, languages & cloud services
                    </div>
                  </div>
                </button>

                {/* Jump to Contact Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('contact')}
                  style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 18,
                    padding: 20,
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: colors.textColor,
                    fontFamily,
                    boxShadow: colors.boxShadow,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 120
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} />
                    </span>
                    <ArrowRight size={16} style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 15 }}>Get In Touch</div>
                    <div style={{ fontSize: 12, color: colors.mutedColor, marginTop: 3 }}>
                      Direct WhatsApp, email & communication channels
                    </div>
                  </div>
                </button>

              </div>
            </div>

            {/* Quick Contact Bento Card */}
            <div style={{
              gridColumn: 'span 12',
              background: `linear-gradient(135deg, ${primaryColor}15, ${colors.cardBg})`,
              border: `1px solid ${primaryColor}33`,
              borderRadius: 24,
              padding: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              boxShadow: colors.boxShadow
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: primaryColor, marginBottom: 4 }}>
                  Connect Directly
                </div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Let's build something remarkable together</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 22px',
                    background: '#25D366',
                    color: '#ffffff',
                    borderRadius: 14,
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                  }}
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
                {contact.email && (
                  <button
                    type="button"
                    onClick={copyEmail}
                    style={{
                      padding: '12px 20px',
                      background: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.textColor,
                      borderRadius: 14,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontFamily
                    }}
                  >
                    {copied ? <Check size={16} style={{ color: primaryColor }} /> : <Copy size={16} />}
                    <span>{copied ? 'Email Copied!' : 'Copy Email'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════ PAGE 2: PROJECTS ════════════════════ */}
        {activeTab === 'projects' && (
          <div>
            {/* Header / Filter Toolbar Card */}
            <div style={{
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 20,
              padding: '20px 24px',
              marginBottom: 20,
              boxShadow: colors.boxShadow,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 14
            }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800 }}>Project Portfolio</h2>
                <div style={{ fontSize: 13, color: colors.mutedColor }}>
                  Showing {filteredProjects.length} of {projects.length} works
                </div>
              </div>

              {/* Search & Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: colors.cardBgSubtle, padding: '6px 12px', borderRadius: 10, border: `1px solid ${colors.borderColor}` }}>
                  <Search size={14} style={{ color: colors.mutedColor }} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: colors.textColor,
                      fontSize: 12.5,
                      fontFamily,
                      outline: 'none',
                      width: 140
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {allTechTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setProjectFilter(tag)}
                      style={{
                        background: projectFilter === tag ? primaryColor : colors.cardBgSubtle,
                        color: projectFilter === tag ? '#ffffff' : colors.mutedColor,
                        border: `1px solid ${projectFilter === tag ? primaryColor : colors.borderColor}`,
                        borderRadius: 8,
                        padding: '4px 10px',
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Bento Grid */}
            {filteredProjects.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: colors.mutedColor, background: colors.cardBg, borderRadius: 20, border: `1px solid ${colors.borderColor}` }}>
                No projects found matching your filter criteria.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
                {filteredProjects.map((proj, idx) => {
                  const isFeatured = idx === 0 && filteredProjects.length > 1;
                  return (
                    <div
                      key={idx}
                      style={{
                        gridColumn: isFeatured ? 'span 12' : 'span 6',
                        background: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                        borderRadius: 22,
                        padding: isFeatured ? '32px 28px' : '24px 22px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: colors.boxShadow,
                        position: 'relative',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                          <div>
                            {isFeatured && (
                              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: colors.badgeBg, color: colors.badgeText, marginBottom: 6, display: 'inline-block' }}>
                                Featured Architecture
                              </span>
                            )}
                            <h3 style={{ margin: 0, fontSize: isFeatured ? 20 : 17, fontWeight: 800 }}>{proj.name}</h3>
                          </div>
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                color: primaryColor,
                                background: colors.cardBgSubtle,
                                padding: '6px 12px',
                                borderRadius: 10,
                                border: `1px solid ${colors.borderColor}`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 12,
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <span>Live Work</span>
                              <ArrowUpRight size={15} />
                            </a>
                          )}
                        </div>

                        <p style={{ margin: '0 0 16px', fontSize: 13.5, lineHeight: 1.6, color: colors.mutedColor }}>
                          {proj.description}
                        </p>
                      </div>

                      {proj.tech && proj.tech.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 12, borderTop: `1px solid ${colors.borderLight}` }}>
                          {proj.tech.map((t, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                padding: '3px 9px',
                                borderRadius: 6,
                                background: colors.cardBgSubtle,
                                color: colors.textColor,
                                border: `1px solid ${colors.borderColor}`
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ PAGE 3: EXPERIENCE ════════════════════ */}
        {activeTab === 'experience' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            
            {/* Header Summary Bento */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: '28px',
              boxShadow: colors.boxShadow
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={18} />
                </span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Engineering & Career Roadmap</h2>
                  <div style={{ fontSize: 13, color: colors.mutedColor }}>Chronological progression across industry roles</div>
                </div>
              </div>
            </div>

            {/* Experience Cards */}
            {experience.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  gridColumn: 'span 12',
                  background: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                  borderRadius: 22,
                  padding: '28px 30px',
                  boxShadow: colors.boxShadow,
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{exp.role}</h3>
                    <div style={{ color: primaryColor, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: primaryColor,
                    background: colors.badgeBg,
                    padding: '4px 12px',
                    borderRadius: 9999
                  }}>
                    {exp.duration}
                  </span>
                </div>

                <p style={{ margin: '14px 0 0', fontSize: 13.5, lineHeight: 1.65, color: colors.mutedColor, whiteSpace: 'pre-line' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════ PAGE 4: TECH STACK ════════════════════ */}
        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            
            {/* Header Bento */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: '28px',
              boxShadow: colors.boxShadow
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: colors.badgeBg, color: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} />
                </span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Technical Stack & Tools</h2>
                  <div style={{ fontSize: 13, color: colors.mutedColor }}>{skills.length} verified technologies across development lifecycle</div>
                </div>
              </div>
            </div>

            {/* Main Skills Matrix Bento */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: '28px',
              boxShadow: colors.boxShadow
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: primaryColor, marginBottom: 14 }}>
                Core Technologies & Frameworks
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {skills.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 12,
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: colors.textColor,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: primaryColor }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Competency Bento Cards */}
            <div style={{
              gridColumn: 'span 6',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: 24,
              boxShadow: colors.boxShadow
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Frontend & UI Engineering</div>
              <div style={{ fontSize: 13, color: colors.mutedColor, lineHeight: 1.6 }}>
                Responsive interfaces, state architecture, accessible component systems, and real-time client hydration.
              </div>
            </div>

            <div style={{
              gridColumn: 'span 6',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: 24,
              boxShadow: colors.boxShadow
            }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Backend, Cloud & Microservices</div>
              <div style={{ fontSize: 13, color: colors.mutedColor, lineHeight: 1.6 }}>
                Distributed REST/GraphQL microservices, high-throughput database tuning, container orchestration, and CI/CD pipelines.
              </div>
            </div>

          </div>
        )}

        {/* ════════════════════ PAGE 5: EDUCATION & CREDENTIALS ════════════════════ */}
        {activeTab === 'education' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            
            {/* Education Bento (Span 6) */}
            {education.length > 0 && (
              <div style={{
                gridColumn: certifications.length > 0 ? 'span 6' : 'span 12',
                background: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: 22,
                padding: 28,
                boxShadow: colors.boxShadow
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <GraduationCap size={20} style={{ color: primaryColor }} />
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Academic Degrees</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ padding: '14px 16px', background: colors.cardBgSubtle, borderRadius: 14, border: `1px solid ${colors.borderColor}` }}>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>{edu.degree || edu.institution}</div>
                      <div style={{ color: primaryColor, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{edu.institution}</div>
                      {edu.year && <div style={{ color: colors.mutedColor, fontSize: 12, marginTop: 4 }}>{edu.year}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Bento (Span 6) */}
            {certifications.length > 0 && (
              <div style={{
                gridColumn: education.length > 0 ? 'span 6' : 'span 12',
                background: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: 22,
                padding: 28,
                boxShadow: colors.boxShadow
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <Award size={20} style={{ color: primaryColor }} />
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Certifications</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {certifications.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        background: colors.cardBgSubtle,
                        border: `1px solid ${colors.borderColor}`,
                        borderRadius: 14,
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: colors.textColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{c}</span>
                      <CheckCircle2 size={16} style={{ color: primaryColor }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════════════ PAGE 6: CONTACT & INQUIRIES ════════════════════ */}
        {activeTab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            
            {/* Primary WhatsApp Card (Span 6) */}
            <div style={{
              gridColumn: 'span 6',
              background: `linear-gradient(135deg, rgba(37, 211, 102, 0.12), ${colors.cardBg})`,
              border: '1px solid #25D366',
              borderRadius: 22,
              padding: 28,
              boxShadow: colors.boxShadow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#25D366', fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
                  <MessageCircle size={20} />
                  <span>INSTANT DIRECT CHAT</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>WhatsApp Connect</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: colors.mutedColor, lineHeight: 1.6 }}>
                  Direct chat for project proposals, hiring managers, and quick recruiter inquiries.
                </p>
              </div>

              <div style={{ marginTop: 24 }}>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 24px',
                    background: '#25D366',
                    color: '#ffffff',
                    borderRadius: 14,
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: 14,
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  <MessageCircle size={18} /> Start WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Direct Email Card (Span 6) */}
            <div style={{
              gridColumn: 'span 6',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: 28,
              boxShadow: colors.boxShadow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: primaryColor, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>
                  <Mail size={18} />
                  <span>OFFICIAL EMAIL</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800 }}>Direct Email Transmission</h3>
                <p style={{ margin: '0 0 16px', fontSize: 13.5, color: colors.mutedColor, wordBreak: 'break-all' }}>
                  {contact.email || 'Email available upon request'}
                </p>
              </div>

              {contact.email && (
                <div>
                  <button
                    type="button"
                    onClick={copyEmail}
                    style={{
                      padding: '12px 22px',
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.textColor,
                      borderRadius: 14,
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily
                    }}
                  >
                    {copied ? <Check size={16} style={{ color: primaryColor }} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Address'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Social & Web Channels Bento (Span 12) */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: 24,
              boxShadow: colors.boxShadow
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: colors.mutedColor, marginBottom: 14 }}>
                Online Presence & Professional Profiles
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {contact.linkedin && (
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 18px',
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: 14,
                      color: colors.textColor,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: 13
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LinkedinIcon size={16} /> LinkedIn
                    </span>
                    <ArrowUpRight size={15} style={{ color: primaryColor }} />
                  </a>
                )}
                {contact.github && (
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 18px',
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: 14,
                      color: colors.textColor,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: 13
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <GithubIcon size={16} /> GitHub
                    </span>
                    <ArrowUpRight size={15} style={{ color: primaryColor }} />
                  </a>
                )}
                {contact.website && (
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '12px 18px',
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: 14,
                      color: colors.textColor,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: 13
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Globe size={16} /> Portfolio Website
                    </span>
                    <ArrowUpRight size={15} style={{ color: primaryColor }} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Inquiry Form Bento (Span 12) */}
            <div style={{
              gridColumn: 'span 12',
              background: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              borderRadius: 22,
              padding: '28px 30px',
              boxShadow: colors.boxShadow
            }}>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} style={{ color: primaryColor }} />
                <span>Send a Direct Note / Message</span>
              </div>
              <div style={{ fontSize: 13, color: colors.mutedColor, marginBottom: 16 }}>
                Transmit an inquiry directly to {candidateName}
              </div>

              {messageSent ? (
                <div style={{ padding: '16px', background: colors.badgeBg, border: `1px solid ${primaryColor}`, borderRadius: 14, color: primaryColor, fontWeight: 700, fontSize: 13 }}>
                  ✓ Your message transmission has been recorded. Thank you for connecting!
                </div>
              ) : (
                <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={messageForm.name}
                      onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })}
                      style={{
                        padding: '10px 14px',
                        background: colors.cardBgSubtle,
                        border: `1px solid ${colors.borderColor}`,
                        borderRadius: 12,
                        color: colors.textColor,
                        fontFamily,
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={messageForm.email}
                      onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })}
                      style={{
                        padding: '10px 14px',
                        background: colors.cardBgSubtle,
                        border: `1px solid ${colors.borderColor}`,
                        borderRadius: 12,
                        color: colors.textColor,
                        fontFamily,
                        fontSize: 13,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write your note or project scope..."
                    value={messageForm.message}
                    onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      background: colors.cardBgSubtle,
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: 12,
                      color: colors.textColor,
                      fontFamily,
                      fontSize: 13,
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                  <div>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 22px',
                        background: primaryColor,
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily,
                        boxShadow: `0 4px 12px ${primaryColor}44`
                      }}
                    >
                      <span>Transmit Message</span>
                      <CornerDownLeft size={14} />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        )}

        {/* Custom AI Sections if provided */}
        {customSections.length > 0 && (
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>
            {customSections.map((sec, idx) => (
              <div key={idx} style={{
                gridColumn: 'span 12',
                background: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                borderRadius: 22,
                padding: '24px 28px',
                boxShadow: colors.boxShadow
              }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: primaryColor }}>{sec.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: colors.mutedColor }}>{sec.content}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

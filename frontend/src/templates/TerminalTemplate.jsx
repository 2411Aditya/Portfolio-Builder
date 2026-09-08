import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Copy, Check, ExternalLink, Mail, Phone, Globe,
  MessageCircle, Sparkles, GraduationCap, Award, Briefcase,
  Code2, Cpu, FileText, ChevronRight, ChevronLeft, Search,
  CornerDownLeft, Send, CheckCircle2, ArrowRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function TerminalTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'projects' | 'experience' | 'skills' | 'education' | 'contact'
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [projectSearch, setProjectSearch] = useState('');
  const [cliInput, setCliInput] = useState('');
  const [cliLogs, setCliLogs] = useState([]);
  const [pingMessage, setPingMessage] = useState('');
  const [pingSent, setPingSent] = useState(false);
  const cliInputRef = useRef(null);

  const isDark = theme === 'dark';
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'candidate';
  const slugName = candidateName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const candidateTitle = data.title || 'Full Stack Engineer';
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

  // Theme palettes (Dark Hacker vs Crisp Modern Light Terminal)
  const primaryColor = themeOverrides.primaryColor || (isDark ? '#10b981' : '#059669');
  const fontFamily = themeOverrides.fontFamily || "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace";
  
  const colors = {
    pageBg: isDark ? (themeOverrides.backgroundColor || '#070b09') : '#f1f5f9',
    windowBg: isDark ? (themeOverrides.cardBackground || '#0e1713') : '#ffffff',
    windowHeaderBg: isDark ? '#080e0b' : '#f8fafc',
    cardBg: isDark ? '#121d18' : '#f8fafc',
    cardBgSubtle: isDark ? '#0a120e' : '#f1f5f9',
    borderColor: isDark ? '#1b2d24' : '#cbd5e1',
    borderLight: isDark ? '#16231c' : '#e2e8f0',
    borderActive: primaryColor,
    textPrimary: isDark ? '#ffffff' : '#0f172a',
    textBody: isDark ? '#d1fae5' : '#1e293b',
    textMuted: isDark ? '#9ca3af' : '#475569',
    textDim: isDark ? '#6ee7b7' : '#059669',
    cmdPrompt: isDark ? '#34d399' : '#047857',
    tabActiveBg: isDark ? '#1a2b22' : '#e2e8f0',
    tabActiveText: isDark ? '#ffffff' : '#0f172a',
    tabInactiveBg: 'transparent',
    tabInactiveText: isDark ? '#9ca3af' : '#64748b',
    codePillBg: isDark ? '#09100c' : '#e2e8f0',
    codePillText: isDark ? '#a7f3d0' : '#0f172a',
    badgeBg: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(5, 150, 105, 0.12)',
    boxShadow: isDark 
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.15)' 
      : '0 20px 45px -10px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(203, 213, 225, 0.8)'
  };

  const tabs = [
    { id: 'overview', name: '1. overview.sh', label: 'Overview', icon: Terminal },
    { id: 'projects', name: '2. projects.py', label: `Projects (${projects.length})`, icon: Code2 },
    { id: 'experience', name: '3. experience.log', label: `Experience (${experience.length})`, icon: Briefcase },
    { id: 'skills', name: '4. skills.json', label: `Skills (${skills.length})`, icon: Cpu },
    { id: 'education', name: '5. credentials.md', label: 'Education & Certs', icon: GraduationCap },
    { id: 'contact', name: '6. contact.env', label: 'Contact', icon: Mail },
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

  // Interactive CLI command execution
  const handleCliSubmit = (e) => {
    e.preventDefault();
    const rawCmd = cliInput.trim();
    if (!rawCmd) return;

    const lower = rawCmd.toLowerCase();
    let response = '';

    if (lower === 'help') {
      response = 'Available commands: overview | projects | experience | skills | education | contact | whoami | whatsapp | cat resume | clear | sudo';
    } else if (lower === '1' || lower === 'overview' || lower === 'home' || lower === 'cd ~' || lower === 'cd home') {
      setActiveTab('overview');
      response = 'Navigated to ~/overview.sh';
    } else if (lower === '2' || lower === 'projects' || lower === 'cd projects' || lower === 'proj') {
      setActiveTab('projects');
      response = `Navigated to ~/projects.py (${projects.length} repositories loaded)`;
    } else if (lower === '3' || lower === 'experience' || lower === 'cd experience' || lower === 'exp') {
      setActiveTab('experience');
      response = `Navigated to ~/experience.log (${experience.length} career milestones)`;
    } else if (lower === '4' || lower === 'skills' || lower === 'cd skills' || lower === 'stack') {
      setActiveTab('skills');
      response = `Navigated to ~/skills.json (${skills.length} technical competencies)`;
    } else if (lower === '5' || lower === 'education' || lower === 'edu' || lower === 'certs' || lower === 'cd education') {
      setActiveTab('education');
      response = 'Navigated to ~/credentials.md (Academic degrees & certifications)';
    } else if (lower === '6' || lower === 'contact' || lower === 'cd contact' || lower === 'email') {
      setActiveTab('contact');
      response = 'Navigated to ~/contact.env (Direct contact channels)';
    } else if (lower === 'whoami') {
      response = `${candidateName} — ${candidateTitle} [${contact.location || 'Remote'}]`;
    } else if (lower === 'whatsapp' || lower === 'wa') {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      response = `Opening WhatsApp chat with ${candidateName}...`;
    } else if (lower === 'cat resume' || lower === 'resume') {
      response = `Resume parsed: ${candidateName} | ${experience.length} roles | ${projects.length} projects | ${skills.length} skills.`;
    } else if (lower === 'clear' || lower === 'cls') {
      setCliLogs([]);
      setCliInput('');
      return;
    } else if (lower.startsWith('sudo')) {
      response = `Permission denied: '${slugName}' is not in the sudoers file. This incident has been logged.`;
    } else {
      response = `Command not found: "${rawCmd}". Type 'help' for a list of terminal commands.`;
    }

    setCliLogs(prev => [...prev.slice(-6), { cmd: rawCmd, output: response }]);
    setCliInput('');
  };

  const handleSendPing = (e) => {
    e.preventDefault();
    if (!pingMessage.trim()) return;
    setPingSent(true);
    setTimeout(() => {
      setPingSent(false);
      setPingMessage('');
    }, 4000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.pageBg,
      color: colors.textBody,
      fontFamily,
      padding: '32px 16px 80px',
      transition: 'background-color 0.25s ease, color 0.25s ease'
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* ── Outer Terminal Window Frame ── */}
        <div style={{
          background: colors.windowBg,
          border: `1px solid ${colors.borderColor}`,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: colors.boxShadow,
          transition: 'all 0.25s ease'
        }}>

          {/* ── Terminal Window Titlebar ── */}
          <div style={{
            background: colors.windowHeaderBg,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${colors.borderColor}`,
            flexWrap: 'wrap',
            gap: 12
          }}>
            {/* macOS Window Controls + Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 4px rgba(239,68,68,0.4)' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 4px rgba(245,158,11,0.4)' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 4px rgba(16,185,129,0.4)' }} />
              </div>
              <span style={{
                marginLeft: 8,
                fontSize: 12,
                color: colors.textDim,
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                bash — {slugName}@portfolio:~/{activeTab} ({tabs.findIndex(t => t.id === activeTab) + 1}/{tabs.length})
              </span>
            </div>

            {/* Quick Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {/* WhatsApp Quick Connect */}
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: '#25D366',
                  color: '#000000',
                  textDecoration: 'none',
                  fontSize: 11,
                  fontWeight: 800,
                  boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </div>
          </div>

          {/* ── Terminal Multi-Page Tab Bar ── */}
          <nav style={{
            background: colors.cardBgSubtle,
            borderBottom: `1px solid ${colors.borderColor}`,
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            gap: 2,
            padding: '4px 6px 0'
          }}>
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive ? colors.windowBg : 'transparent',
                    color: isActive ? primaryColor : colors.tabInactiveText,
                    border: 'none',
                    borderTop: isActive ? `2px solid ${primaryColor}` : '2px solid transparent',
                    borderLeft: isActive ? `1px solid ${colors.borderColor}` : '1px solid transparent',
                    borderRight: isActive ? `1px solid ${colors.borderColor}` : '1px solid transparent',
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                    padding: '8px 14px',
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    fontFamily,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    marginBottom: isActive ? -1 : 0
                  }}
                >
                  <TabIcon size={13} style={{ color: isActive ? primaryColor : colors.textMuted }} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Terminal Main Body ── */}
          <div style={{ padding: '28px 24px 36px', fontSize: 13, lineHeight: 1.7 }}>

            {/* ════════════════════ PAGE 1: OVERVIEW ════════════════════ */}
            {activeTab === 'overview' && (
              <section>
                {/* Command Prompt */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>whoami --verbose --system-info</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {/* Hero Headline & Role */}
                  <div style={{
                    fontSize: 'clamp(22px, 4vw, 32px)',
                    fontWeight: 800,
                    color: colors.textPrimary,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}>
                    {candidateName}
                  </div>
                  
                  <div style={{
                    color: colors.textDim,
                    fontSize: 15,
                    fontWeight: 600,
                    margin: '6px 0 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap'
                  }}>
                    <span>role: "{candidateTitle}"</span>
                    {contact.location && (
                      <span style={{
                        fontSize: 11,
                        background: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                        padding: '2px 8px',
                        borderRadius: 4,
                        color: colors.textMuted
                      }}>
                        📍 {contact.location}
                      </span>
                    )}
                  </div>

                  {/* Bio statement */}
                  {candidateBio && (
                    <div style={{
                      color: colors.textMuted,
                      maxWidth: 780,
                      lineHeight: 1.65,
                      background: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`,
                      borderRadius: 8,
                      padding: '14px 18px',
                      margin: '14px 0 20px',
                      fontSize: 13
                    }}>
                      <div style={{ color: primaryColor, fontSize: 11, fontWeight: 700, marginBottom: 4 }}>// BIO STATEMENT:</div>
                      {candidateBio}
                    </div>
                  )}

                  {/* System Telemetry Dashboard Pill Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 10,
                    margin: '16px 0 24px'
                  }}>
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: primaryColor, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                        AVAILABLE / ACTIVE
                      </div>
                    </div>
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects In Repo</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginTop: 2 }}>
                        {projects.length} Total Deployed
                      </div>
                    </div>
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Timeline</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginTop: 2 }}>
                        {experience.length} Key Roles
                      </div>
                    </div>
                    <div style={{ background: colors.cardBg, border: `1px solid ${colors.borderColor}`, borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Modules</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, marginTop: 2 }}>
                        {skills.length} Technologies
                      </div>
                    </div>
                  </div>

                  {/* AI Focus Modules */}
                  {highlightedSkills.length > 0 && (
                    <div style={{
                      marginBottom: 20,
                      padding: '12px 16px',
                      background: colors.badgeBg,
                      border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
                      borderRadius: 8
                    }}>
                      <div style={{ color: primaryColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 12 }}>
                        <Sparkles size={14} /> AI Core Strengths:
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {highlightedSkills.map((sk, i) => (
                          <span key={i} style={{
                            background: primaryColor,
                            color: isDark ? '#022c22' : '#ffffff',
                            padding: '3px 10px',
                            borderRadius: 4,
                            fontWeight: 700,
                            fontSize: 11
                          }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Page Jump Shortcuts */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 8 }}>
                      // SELECT DIRECTORY MODULE TO INSPECT:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('projects')}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: colors.textPrimary,
                          fontFamily
                        }}
                      >
                        <div style={{ color: primaryColor, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>📁 ~/projects.py</span>
                          <ArrowRight size={13} />
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Explore {projects.length} featured works & repos</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('experience')}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: colors.textPrimary,
                          fontFamily
                        }}
                      >
                        <div style={{ color: primaryColor, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>📋 ~/experience.log</span>
                          <ArrowRight size={13} />
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>View full employment & engineering logs</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('skills')}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: colors.textPrimary,
                          fontFamily
                        }}
                      >
                        <div style={{ color: primaryColor, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>⚡ ~/skills.json</span>
                          <ArrowRight size={13} />
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Inspect tech stack & framework metrics</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('contact')}
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRadius: 8,
                          padding: '12px 14px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          color: colors.textPrimary,
                          fontFamily
                        }}
                      >
                        <div style={{ color: primaryColor, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>✉️ ~/contact.env</span>
                          <ArrowRight size={13} />
                        </div>
                        <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>WhatsApp, email, and social networks</div>
                      </button>
                    </div>
                  </div>

                  {/* Contact Row */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22, fontSize: 12, alignItems: 'center' }}>
                    <a href={waUrl} target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                      <MessageCircle size={14} /> ./connect-whatsapp
                    </a>
                    {contact.email && (
                      <button
                        type="button"
                        onClick={copyEmail}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: colors.textDim,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: 12,
                          fontFamily,
                          padding: 0
                        }}
                      >
                        {copied ? <Check size={13} style={{ color: primaryColor }} /> : <Copy size={13} />}
                        <span>{copied ? 'copied!' : contact.email}</span>
                      </button>
                    )}
                    {contact.github && (
                      <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <GithubIcon size={13} /> github
                      </a>
                    )}
                    {contact.linkedin && (
                      <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <LinkedinIcon size={13} /> linkedin
                      </a>
                    )}
                    {contact.website && (
                      <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Globe size={13} /> website
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ════════════════════ PAGE 2: PROJECTS ════════════════════ */}
            {activeTab === 'projects' && (
              <section>
                {/* Command Header */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>python3 -m repositories.indexer --status=production</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {/* Controls: Search & Filter Tag Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 16,
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    padding: '10px 14px',
                    borderRadius: 8
                  }}>
                    {/* Filter Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: colors.textMuted }}>Filter:</span>
                      {allTechTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setProjectFilter(tag)}
                          style={{
                            background: projectFilter === tag ? primaryColor : colors.cardBgSubtle,
                            color: projectFilter === tag ? (isDark ? '#022c22' : '#ffffff') : colors.textMuted,
                            border: `1px solid ${projectFilter === tag ? primaryColor : colors.borderColor}`,
                            borderRadius: 4,
                            padding: '2px 8px',
                            fontSize: 11,
                            fontWeight: projectFilter === tag ? 700 : 500,
                            fontFamily,
                            cursor: 'pointer'
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    {/* Grep search */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Search size={13} style={{ color: colors.textMuted }} />
                      <input
                        type="text"
                        placeholder="grep projects..."
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        style={{
                          background: colors.cardBgSubtle,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.textPrimary,
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontFamily,
                          outline: 'none',
                          width: 130
                        }}
                      />
                    </div>
                  </div>

                  {/* Projects Grid */}
                  {filteredProjects.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: colors.textMuted, background: colors.cardBg, borderRadius: 8, border: `1px solid ${colors.borderColor}` }}>
                      No matching projects found for query "{projectSearch || projectFilter}".
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                      {filteredProjects.map((proj, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: colors.cardBg,
                            border: `1px solid ${colors.borderColor}`,
                            borderRadius: 8,
                            padding: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'border-color 0.2s ease, transform 0.2s ease'
                          }}
                        >
                          <div>
                            {/* Project Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div>
                                <span style={{ color: primaryColor, fontSize: 11, fontWeight: 700 }}>[repo_{idx + 1}]</span>
                                <div style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 14, marginTop: 2 }}>{proj.name}</div>
                              </div>
                              {proj.url && (
                                <a
                                  href={proj.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    color: primaryColor,
                                    background: colors.cardBgSubtle,
                                    padding: '4px 8px',
                                    borderRadius: 4,
                                    border: `1px solid ${colors.borderColor}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    fontSize: 11,
                                    textDecoration: 'none',
                                    fontWeight: 600
                                  }}
                                  title="View Project Link"
                                >
                                  <span>link</span>
                                  <ExternalLink size={12} />
                                </a>
                              )}
                            </div>

                            <p style={{ color: colors.textMuted, fontSize: 12, margin: '0 0 12px', lineHeight: 1.6 }}>
                              {proj.description}
                            </p>
                          </div>

                          {/* Tech badges */}
                          {proj.tech && proj.tech.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${colors.borderLight}` }}>
                              {proj.tech.map((t, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: 10,
                                    background: colors.codePillBg,
                                    color: colors.codePillText,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    border: `1px solid ${colors.borderColor}`,
                                    fontWeight: 600
                                  }}
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ════════════════════ PAGE 3: EXPERIENCE ════════════════════ */}
            {activeTab === 'experience' && (
              <section>
                {/* Command Header */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>tail -f /var/log/engineering_career.log</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {experience.length === 0 ? (
                    <div style={{ padding: '20px', color: colors.textMuted }}>No work history records loaded in system.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {experience.map((exp, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: colors.cardBg,
                            border: `1px solid ${colors.borderColor}`,
                            borderRadius: 8,
                            padding: '16px 20px',
                            position: 'relative'
                          }}
                        >
                          {/* Role & Company Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: primaryColor, fontSize: 12, fontWeight: 700 }}>[milestone_{idx + 1}]</span>
                              <span style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 15 }}>
                                {exp.role} <span style={{ color: colors.textDim }}>@ {exp.company}</span>
                              </span>
                            </div>
                            <span style={{
                              color: colors.textDim,
                              fontSize: 11,
                              background: colors.badgeBg,
                              border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontWeight: 600
                            }}>
                              {exp.duration}
                            </span>
                          </div>

                          {/* Log description */}
                          <div style={{
                            margin: '12px 0 0',
                            color: colors.textMuted,
                            fontSize: 12.5,
                            lineHeight: 1.65,
                            whiteSpace: 'pre-line'
                          }}>
                            {exp.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ════════════════════ PAGE 4: SKILLS ════════════════════ */}
            {activeTab === 'skills' && (
              <section>
                {/* Command Header */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>jq '.technical_matrix' /etc/system/skills.json</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {/* Skill Badge Grid */}
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 8,
                    padding: '20px 22px',
                    marginBottom: 16
                  }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, marginBottom: 12 }}>
                      // RECOGNIZED PROGRAMMING LANGUAGES, FRAMEWORKS & RUNTIMES:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {skills.map((skill, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '6px 12px',
                            background: colors.cardBgSubtle,
                            border: `1px solid ${colors.borderColor}`,
                            borderRadius: 6,
                            color: colors.textBody,
                            fontSize: 12,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span style={{ color: primaryColor, fontSize: 10 }}>$</span>
                          <span>'{skill}'</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terminal ASCII Stack Meter Simulation */}
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 8,
                    padding: '16px 20px',
                    fontSize: 12
                  }}>
                    <div style={{ color: primaryColor, fontWeight: 700, marginBottom: 10, fontSize: 11 }}>
                      // SYSTEM CAPACITY & ARCHITECTURE MASTERY:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ color: colors.textPrimary }}>Full-Stack Engineering & API Architecture</span>
                        <span style={{ color: colors.textDim, fontWeight: 700 }}>[████████████████████] 98%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ color: colors.textPrimary }}>Cloud Infrastructure, CI/CD & Containers</span>
                        <span style={{ color: colors.textDim, fontWeight: 700 }}>[██████████████████░░] 90%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ color: colors.textPrimary }}>Distributed Systems & Database Tuning</span>
                        <span style={{ color: colors.textDim, fontWeight: 700 }}>[█████████████████░░░] 85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ════════════════════ PAGE 5: EDUCATION & CERTS ════════════════════ */}
            {activeTab === 'education' && (
              <section>
                {/* Command Header */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>cat /etc/security/verified_credentials.md</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {/* Education List */}
                  {education.length > 0 && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 700, marginBottom: 10 }}>
                        // ACADEMIC DEGREES:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {education.map((edu, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: colors.cardBg,
                              border: `1px solid ${colors.borderColor}`,
                              borderRadius: 8,
                              padding: '14px 18px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: 8
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <GraduationCap size={18} style={{ color: primaryColor }} />
                              <div>
                                <div style={{ color: colors.textPrimary, fontWeight: 700, fontSize: 14 }}>
                                  {edu.degree || edu.institution}
                                </div>
                                <div style={{ color: colors.textDim, fontSize: 12 }}>{edu.institution}</div>
                              </div>
                            </div>
                            {edu.year && (
                              <span style={{ color: colors.textMuted, fontSize: 11, background: colors.cardBgSubtle, padding: '2px 8px', borderRadius: 4, border: `1px solid ${colors.borderColor}` }}>
                                {edu.year}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications List */}
                  {certifications.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 700, marginBottom: 10 }}>
                        // INDUSTRY CERTIFICATIONS:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                        {certifications.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              background: colors.cardBg,
                              border: `1px solid ${colors.borderColor}`,
                              padding: '10px 14px',
                              borderRadius: 8,
                              color: colors.textBody,
                              fontSize: 12,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontWeight: 600
                            }}
                          >
                            <Award size={16} style={{ color: primaryColor }} />
                            <span>{c}</span>
                            <CheckCircle2 size={12} style={{ color: primaryColor }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ════════════════════ PAGE 6: CONTACT & CONNECT ════════════════════ */}
            {activeTab === 'contact' && (
              <section>
                {/* Command Header */}
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ color: colors.cmdPrompt, fontWeight: 800 }}>❯</span>
                  <span style={{ fontWeight: 700 }}>curl -X POST https://api.connect/{slugName}</span>
                </div>

                <div style={{ paddingLeft: 16, borderLeft: `2px solid ${colors.borderLight}`, marginLeft: 6 }}>
                  {/* Primary Direct Connect Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
                    
                    {/* WhatsApp Action Card */}
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: isDark ? 'rgba(37, 211, 102, 0.1)' : '#f0fdf4',
                        border: '1px solid #25D366',
                        borderRadius: 8,
                        padding: '16px 18px',
                        textDecoration: 'none',
                        color: isDark ? '#ffffff' : '#0f172a',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 10
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#25D366', fontWeight: 800, fontSize: 13 }}>
                        <MessageCircle size={18} />
                        <span>DIRECT WHATSAPP CHAT</span>
                      </div>
                      <div style={{ fontSize: 11, color: colors.textMuted }}>
                        Instant messaging for recruiters and project inquiries.
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#25D366' }}>
                        <span>Open WhatsApp Chat</span>
                        <ArrowRight size={13} />
                      </div>
                    </a>

                    {/* Email Action Card */}
                    {contact.email && (
                      <div
                        style={{
                          background: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRadius: 8,
                          padding: '16px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: 10
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: primaryColor, fontWeight: 800, fontSize: 13 }}>
                          <Mail size={16} />
                          <span>EMAIL TRANSMISSION</span>
                        </div>
                        <div style={{ fontSize: 12, color: colors.textPrimary, wordBreak: 'break-all', fontWeight: 600 }}>
                          {contact.email}
                        </div>
                        <button
                          type="button"
                          onClick={copyEmail}
                          style={{
                            background: colors.cardBgSubtle,
                            border: `1px solid ${colors.borderColor}`,
                            borderRadius: 4,
                            padding: '6px 10px',
                            color: colors.textBody,
                            fontFamily,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                          }}
                        >
                          {copied ? <Check size={12} style={{ color: primaryColor }} /> : <Copy size={12} />}
                          <span>{copied ? 'Copied to Clipboard!' : 'Copy Email Address'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Environment Variables Table */}
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 8,
                    padding: '16px 20px',
                    marginBottom: 20
                  }}>
                    <div style={{ fontSize: 11, color: colors.textMuted, fontWeight: 700, marginBottom: 10 }}>
                      // ENVIRONMENT CONTACT VARIABLES:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                      {contact.phone && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ color: primaryColor }}>PHONE_NUMBER</span>
                          <span style={{ color: colors.textPrimary, fontWeight: 600 }}>"{contact.phone}"</span>
                        </div>
                      )}
                      {contact.location && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ color: primaryColor }}>PHYSICAL_LOCATION</span>
                          <span style={{ color: colors.textPrimary, fontWeight: 600 }}>"{contact.location}"</span>
                        </div>
                      )}
                      {contact.github && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ color: primaryColor }}>GITHUB_PROFILE</span>
                          <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none' }}>
                            {contact.github}
                          </a>
                        </div>
                      )}
                      {contact.linkedin && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ color: primaryColor }}>LINKEDIN_URI</span>
                          <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none' }}>
                            {contact.linkedin}
                          </a>
                        </div>
                      )}
                      {contact.website && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ color: primaryColor }}>HOSTED_WEBSITE</span>
                          <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: colors.textDim, textDecoration: 'none' }}>
                            {contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactive Quick Terminal Ping Transmission Form */}
                  <div style={{
                    background: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                    borderRadius: 8,
                    padding: '16px 20px'
                  }}>
                    <div style={{ color: primaryColor, fontWeight: 700, fontSize: 12, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Send size={13} />
                      <span>// TRANSMIT TERMINAL PING TO {candidateName.toUpperCase()}:</span>
                    </div>
                    {pingSent ? (
                      <div style={{ padding: '12px 16px', background: colors.badgeBg, border: `1px solid ${primaryColor}`, borderRadius: 6, color: primaryColor, fontWeight: 700, fontSize: 12 }}>
                        ✓ Transmission received! Status 200 OK. Thank you for connecting.
                      </div>
                    ) : (
                      <form onSubmit={handleSendPing} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="Type your message or recruiter note here..."
                          value={pingMessage}
                          onChange={(e) => setPingMessage(e.target.value)}
                          style={{
                            flex: 1,
                            minWidth: 220,
                            background: colors.cardBgSubtle,
                            border: `1px solid ${colors.borderColor}`,
                            borderRadius: 6,
                            padding: '8px 12px',
                            color: colors.textPrimary,
                            fontFamily,
                            fontSize: 12,
                            outline: 'none'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            background: primaryColor,
                            color: isDark ? '#022c22' : '#ffffff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '8px 16px',
                            fontFamily,
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span>Transmit</span>
                          <CornerDownLeft size={13} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Custom AI Sections if provided */}
            {customSections.length > 0 && (
              <section style={{ marginTop: 28 }}>
                {customSections.map((sec, idx) => (
                  <div key={idx} style={{ marginBottom: 18 }}>
                    <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: colors.cmdPrompt }}>❯</span>
                      <span style={{ fontWeight: 700 }}>echo ${sec.title.toUpperCase().replace(/\s+/g, '_')}</span>
                    </div>
                    <div style={{ marginTop: 8, paddingLeft: 16, color: colors.textMuted, fontSize: 12.5 }}>
                      {sec.content}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* ── Terminal Interactive Command Line Prompt Bar ── */}
            <div style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: `1px solid ${colors.borderLight}`
            }}>
              {/* Output buffer from previous commands */}
              {cliLogs.length > 0 && (
                <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cliLogs.map((log, idx) => (
                    <div key={idx} style={{ fontSize: 12 }}>
                      <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: colors.cmdPrompt }}>❯</span>
                        <span>{log.cmd}</span>
                      </div>
                      <div style={{ paddingLeft: 16, color: colors.textMuted, fontSize: 11.5 }}>
                        {log.output}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Interactive CLI form */}
              <form onSubmit={handleCliSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: primaryColor, fontWeight: 700, fontSize: 12 }}>
                  <span style={{ color: colors.cmdPrompt }}>❯</span>
                  <span>{slugName}@cli:~$</span>
                </div>
                <input
                  ref={cliInputRef}
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="type 'help', 'projects', 'skills', 'contact', 'whatsapp'..."
                  style={{
                    flex: 1,
                    minWidth: 200,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `1px dashed ${colors.borderColor}`,
                    color: colors.textPrimary,
                    fontFamily,
                    fontSize: 12,
                    padding: '4px 6px',
                    outline: 'none'
                  }}
                />
                <span style={{ display: 'inline-block', width: 8, height: 16, background: primaryColor, animation: 'pulse 1s infinite' }} />
              </form>
              <div style={{ fontSize: 10.5, color: colors.textDim, marginTop: 6, opacity: 0.8 }}>
                💡 Tip: Click any page tab above or type command numbers <span style={{ color: primaryColor }}>1..6</span> / <span style={{ color: primaryColor }}>projects</span> / <span style={{ color: primaryColor }}>contact</span> to navigate.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

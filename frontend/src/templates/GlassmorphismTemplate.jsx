import React from 'react';
import {
  Sparkles, ExternalLink, Briefcase, Code2, Award,
  GraduationCap, Mail, Globe, Phone, CheckCircle2, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function GlassmorphismTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Visionary Creator';
  const candidateTitle = data.title || 'Principal Full-Stack Architect';
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

  const primaryColor = themeOverrides.primaryColor || '#a855f7'; // iridescent purple/violet
  const fontFamily = themeOverrides.fontFamily || "'Outfit', 'Inter', sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#070514' : '#f5f3ff');
  const glassBg = themeOverrides.cardBackground || (isDark ? 'rgba(30, 20, 60, 0.45)' : 'rgba(255, 255, 255, 0.65)');
  const textColor = isDark ? '#f8fafc' : '#1e1b4b';
  const mutedColor = isDark ? '#c084fc' : '#6b21a8';
  const glassBorder = isDark ? 'rgba(168, 85, 247, 0.25)' : 'rgba(168, 85, 247, 0.18)';

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: bgColor,
      backgroundImage: `radial-gradient(at 10% 20%, ${primaryColor}22 0px, transparent 50%), radial-gradient(at 90% 80%, #3b82f622 0px, transparent 50%)`,
      color: textColor,
      fontFamily,
      padding: '48px 20px 80px',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Header Glass Card */}
        <header style={{
          background: glassBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${glassBorder}`,
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          marginBottom: 32
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 76, height: 76, borderRadius: 20,
                background: `linear-gradient(135deg, ${primaryColor}, #3b82f6)`,
                color: '#fff', fontSize: 30, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 24px ${primaryColor}88`
              }}>
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px' }}>{candidateName}</h1>
                <div style={{ fontSize: 16, color: isDark ? '#e9d5ff' : '#7e22ce', fontWeight: 600 }}>{candidateTitle}</div>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '12px 22px',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)'
                }}
              >
                <MessageCircle size={17} /> WhatsApp
              </a>
            </div>
          </div>

          {candidateBio && (
            <p style={{ margin: '24px 0 0', fontSize: 15, lineHeight: 1.7, color: isDark ? '#e2e8f0' : '#334155' }}>
              {candidateBio}
            </p>
          )}

          {/* Social Glass Badges */}
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap', fontSize: 13 }}>
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', padding: '6px 14px', borderRadius: 9999, border: `1px solid ${glassBorder}`, color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', padding: '6px 14px', borderRadius: 9999, border: `1px solid ${glassBorder}`, color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', padding: '6px 14px', borderRadius: 9999, border: `1px solid ${glassBorder}`, color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={14} /> Website
              </a>
            )}
          </div>
        </header>

        {/* AI Highlight Banner */}
        {highlightedSkills.length > 0 && (
          <div style={{
            background: glassBg,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${primaryColor}`,
            borderRadius: 16,
            padding: '16px 24px',
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <span style={{ fontWeight: 700, color: isDark ? '#e9d5ff' : '#7e22ce', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} /> AI Luminous Highlights
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {highlightedSkills.map((sk, i) => (
                <span key={i} style={{ background: primaryColor, color: '#fff', padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Glass Grid */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 size={22} style={{ color: primaryColor }} /> Featured Creations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{
                  background: glassBg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 20,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{proj.name}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 13.5, lineHeight: 1.6, color: isDark ? '#cbd5e1' : '#475569' }}>{proj.description}</p>
                  </div>
                  {proj.tech && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', color: isDark ? '#e9d5ff' : '#6b21a8', fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Glass Timeline */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={22} style={{ color: primaryColor }} /> Professional Trajectory
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{
                  background: glassBg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 20,
                  padding: 24
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                    <span style={{ fontSize: 12, color: primaryColor, fontWeight: 600 }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: 14, color: isDark ? '#d8b4fe' : '#7e22ce', fontWeight: 600, margin: '4px 0 12px' }}>{exp.company}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: isDark ? '#cbd5e1' : '#334155', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Glass Pills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={22} style={{ color: primaryColor }} /> Core Masteries
            </h2>
            <div style={{
              background: glassBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${glassBorder}`,
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10
            }}>
              {skills.map((s, i) => (
                <span key={i} style={{ padding: '6px 14px', borderRadius: 9999, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', border: `1px solid ${glassBorder}`, fontSize: 13, fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications Glass Cards */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={22} style={{ color: primaryColor }} /> Academics & Accreditations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{
                  background: glassBg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 18,
                  padding: 20
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: primaryColor, marginBottom: 4 }}>Education</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{edu.degree || edu.institution}</h3>
                  <div style={{ fontSize: 13, color: isDark ? '#cbd5e1' : '#475569', marginTop: 4 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                </div>
              ))}
              {certifications.map((c, i) => (
                <div key={i} style={{
                  background: glassBg,
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${glassBorder}`,
                  borderRadius: 18,
                  padding: 20
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#10b981', marginBottom: 4 }}>Certification</div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{c}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <section key={idx} style={{ marginBottom: 36 }}>
            <div style={{
              background: glassBg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${glassBorder}`,
              borderRadius: 20,
              padding: 24
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: primaryColor }}>{sec.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: isDark ? '#cbd5e1' : '#475569' }}>{sec.content}</p>
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}

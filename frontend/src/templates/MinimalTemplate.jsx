import React, { useState } from 'react';
import {
  ExternalLink, Briefcase, Code2, GraduationCap, Award,
  CheckCircle2, MessageCircle, Mail, Globe, Phone, Sparkles
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function MinimalTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const [activeTab, setActiveTab] = useState('all');

  // Custom styles extraction
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Candidate Name';
  const candidateTitle = data.title || 'Software Engineer / Developer';
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

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#3b82f6' : '#2563eb');
  const fontFamily = themeOverrides.fontFamily || 'Inter, -apple-system, sans-serif';
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#090d16' : '#f8fafc');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#131b2e' : '#ffffff');
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '40px 20px 80px', transition: 'all 0.3s ease' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        
        {/* Profile Card Header */}
        <header style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px', marginBottom: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: `linear-gradient(135deg, ${primaryColor}, #8b5cf6)`,
                color: '#fff', fontSize: 28, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: themeOverrides.accentGlow ? `0 0 20px ${themeOverrides.accentGlow}` : 'none'
              }}>
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{candidateName}</h1>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 9999, background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', color: mutedColor, fontSize: 15 }}>{candidateTitle}</p>
              </div>
            </div>

            {/* Quick CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  background: '#25D366',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {candidateBio && (
            <p style={{ margin: '20px 0 0', fontSize: 14, lineHeight: 1.65, color: isDark ? '#cbd5e1' : '#334155' }}>
              {candidateBio}
            </p>
          )}

          {/* Social Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, flexWrap: 'wrap', fontSize: 13 }}>
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: mutedColor, display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: mutedColor, display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: mutedColor, display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                <Globe size={14} /> Website
              </a>
            )}
            {contact.phone && (
              <span style={{ color: mutedColor, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Phone size={14} /> {contact.phone}
              </span>
            )}
          </div>
        </header>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${borderColor}`, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
          {['all', 'experience', 'projects', 'skills', 'education'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === tab ? cardBg : 'transparent',
                color: activeTab === tab ? primaryColor : mutedColor,
                fontWeight: activeTab === tab ? 600 : 500,
                cursor: 'pointer',
                fontSize: 13,
                textTransform: 'capitalize',
                borderBottom: activeTab === tab ? `2px solid ${primaryColor}` : '2px solid transparent'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Highlighted Skills Bar (if AI customized) */}
        {highlightedSkills.length > 0 && (
          <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: `1px solid rgba(59, 130, 246, 0.2)`, borderRadius: 12, padding: '14px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: primaryColor, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={14} /> AI Highlighted:
            </span>
            {highlightedSkills.map((sk, i) => (
              <span key={i} style={{ fontSize: 12, padding: '3px 9px', borderRadius: 9999, background: primaryColor, color: '#fff', fontWeight: 500 }}>
                {sk}
              </span>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {(activeTab === 'all' || activeTab === 'experience') && experience.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={18} style={{ color: primaryColor }} /> Work Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{exp.role}</h3>
                    <span style={{ fontSize: 12, color: mutedColor }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: 14, color: primaryColor, fontWeight: 500, margin: '4px 0 10px' }}>{exp.company}</div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 size={18} style={{ color: primaryColor }} /> Key Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{proj.name}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.5, color: mutedColor }}>{proj.description}</p>
                  </div>
                  {proj.tech && proj.tech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: mutedColor }}>
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

        {/* Skills Section */}
        {(activeTab === 'all' || activeTab === 'skills') && skills.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} style={{ color: primaryColor }} /> Skills & Proficiencies
            </h2>
            <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((skill, idx) => (
                <span key={idx} style={{ fontSize: 13, padding: '6px 12px', borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: textColor, border: `1px solid ${borderColor}` }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs */}
        {(activeTab === 'all' || activeTab === 'education') && (education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={18} style={{ color: primaryColor }} /> Education & Credentials
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{edu.degree || edu.institution}</h3>
                  <div style={{ fontSize: 13, color: primaryColor, margin: '4px 0 2px' }}>{edu.institution}</div>
                  <div style={{ fontSize: 12, color: mutedColor }}>{edu.year}</div>
                </div>
              ))}
              {certifications.map((cert, idx) => (
                <div key={`cert-${idx}`} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981', textTransform: 'uppercase' }}>Certification</span>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{cert}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom AI Sections */}
        {customSections.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            {customSections.map((sec, idx) => (
              <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: primaryColor }}>{sec.title}</h3>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: mutedColor }}>{sec.content}</p>
              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
}

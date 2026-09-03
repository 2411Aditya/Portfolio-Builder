import React, { useState } from 'react';
import {
  FileText, Briefcase, Code2, Award, GraduationCap,
  ExternalLink, Mail, Globe, Sparkles, ChevronDown, ChevronRight, Hash, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function NotionDocTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const [openSections, setOpenSections] = useState({ exp: true, proj: true, skills: true, edu: true, certs: true });
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Engineering Doc';
  const candidateTitle = data.title || 'Staff Software Engineer';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I came across your Notion portfolio and want to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I came across your Notion portfolio and want to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#e2e8f0' : '#0f172a');
  const fontFamily = themeOverrides.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#191919' : '#ffffff');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#202020' : '#f7f6f3');
  const textColor = isDark ? '#d4d4d4' : '#37352f';
  const mutedColor = isDark ? '#94a3b8' : '#787774';
  const borderColor = isDark ? '#2e2e2e' : '#e9e9e7';

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '0 20px 80px' }}>
      
      {/* Notion Cover Banner */}
      <div style={{ height: 160, background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', margin: '0 -20px 0', opacity: 0.85 }} />

      <div style={{ maxWidth: 840, margin: '0 auto', position: 'relative' }}>
        
        {/* Page Icon Emoji/Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: 16,
          background: bgColor, border: `2px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, marginTop: -36, marginBottom: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          ⚡
        </div>

        {/* Page Title & Breadcrumbs */}
        <div style={{ fontSize: 13, color: mutedColor, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span>Workspace</span> / <span>Portfolios</span> / <span style={{ color: textColor, fontWeight: 600 }}>{candidateName}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: '-0.02em', color: isDark ? '#ffffff' : '#000000' }}>
            {candidateName}
          </h1>
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 6,
              background: '#25D366',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
            }}
          >
            <MessageCircle size={15} /> WhatsApp Contact
          </a>
        </div>

        {/* Subtitle / Role Callout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: mutedColor, fontSize: 14, marginBottom: 24, flexWrap: 'wrap' }}>
          <span>💼 {candidateTitle}</span>
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <GithubIcon size={14} /> GitHub
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              <LinkedinIcon size={14} /> LinkedIn
            </a>
          )}
        </div>

        {/* Notion Callout Box: Summary */}
        {candidateBio && (
          <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '16px 20px', marginBottom: 28, display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📌</span>
            <div style={{ fontSize: 14.5, lineHeight: 1.65 }}>
              {candidateBio}
            </div>
          </div>
        )}

        {/* AI Highlight Callout */}
        {highlightedSkills.length > 0 && (
          <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe'}`, borderRadius: 8, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#93c5fd' : '#1d4ed8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={15} /> AI Selected Focus:
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {highlightedSkills.map((h, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: 4, background: isDark ? '#1e3a8a' : '#dbeafe', color: isDark ? '#bfdbfe' : '#1e40af', fontSize: 12, fontWeight: 500 }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Section: Work Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              onClick={() => toggle('exp')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '6px 0', userSelect: 'none' }}
            >
              {openSections.exp ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>Experience ({experience.length})</span>
            </div>
            {openSections.exp && (
              <div style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 18 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{exp.role} <span style={{ color: mutedColor, fontWeight: 400 }}>at {exp.company}</span></div>
                      <span style={{ fontSize: 12, color: mutedColor }}>{exp.duration}</span>
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: 1.6, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Section: Key Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              onClick={() => toggle('proj')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '6px 0', userSelect: 'none' }}
            >
              {openSections.proj ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>Key Projects ({projects.length})</span>
            </div>
            {openSections.proj && (
              <div style={{ paddingLeft: 24, marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{proj.name}</div>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: isDark ? '#93c5fd' : '#2563eb' }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.5, color: mutedColor }}>{proj.description}</p>
                    {proj.tech && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {proj.tech.map((t, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '2px 6px', background: isDark ? '#2c2c2c' : '#eae9e6', borderRadius: 4, color: mutedColor }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Section: Skills & Tools */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              onClick={() => toggle('skills')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '6px 0', userSelect: 'none' }}
            >
              {openSections.skills ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>Skills & Competencies ({skills.length})</span>
            </div>
            {openSections.skills && (
              <div style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 4, fontSize: 13 }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Section: Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              onClick={() => toggle('edu')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '6px 0', userSelect: 'none' }}
            >
              {openSections.edu ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>Education ({education.length})</span>
            </div>
            {openSections.edu && (
              <div style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{edu.degree || edu.institution}</div>
                    <div style={{ fontSize: 12.5, color: mutedColor, marginTop: 2 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Toggle Section: Certifications */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div
              onClick={() => toggle('certs')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700, cursor: 'pointer', padding: '6px 0', userSelect: 'none' }}
            >
              {openSections.certs ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span>Certifications & Accreditations ({certifications.length})</span>
            </div>
            {openSections.certs && (
              <div style={{ paddingLeft: 24, marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {certifications.map((c, i) => (
                  <span key={i} style={{ padding: '6px 12px', background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 6, fontSize: 13, fontWeight: 500, color: isDark ? '#93c5fd' : '#2563eb' }}>
                    🏅 {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: 28, paddingLeft: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{sec.title}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: mutedColor }}>{sec.content}</p>
          </div>
        ))}

      </div>
    </div>
  );
}

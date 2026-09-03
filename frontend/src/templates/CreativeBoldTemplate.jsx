import React from 'react';
import {
  Sparkles, ExternalLink, ArrowRight, Mail,
  Globe, Award, Briefcase, Code2, GraduationCap, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function CreativeBoldTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'CREATIVE DEV';
  const candidateTitle = data.title || 'Creative Technologist & UI Engineer';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I saw your creative portfolio and want to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I saw your creative portfolio and want to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const primaryColor = themeOverrides.primaryColor || '#ff0055'; // vibrant neon magenta/coral
  const fontFamily = themeOverrides.fontFamily || "'Space Grotesk', 'Outfit', sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#050505' : '#ffffff');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#121212' : '#f4f4f5');
  const textColor = isDark ? '#ffffff' : '#000000';
  const mutedColor = isDark ? '#a1a1aa' : '#52525b';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Massive Bold Hero */}
        <div style={{ borderBottom: `3px solid ${primaryColor}`, paddingBottom: 32, marginBottom: 36 }}>
          <div style={{ display: 'inline-block', background: primaryColor, color: '#fff', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', marginBottom: 16 }}>
            PORTFOLIO • 2025
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 7vw, 68px)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            {candidateName}
          </h1>
          <div style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, color: primaryColor, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 20 }}>
            {candidateTitle}
          </div>
          {candidateBio && (
            <p style={{ fontSize: 16, lineHeight: 1.6, color: mutedColor, maxWidth: 780, margin: 0 }}>
              {candidateBio}
            </p>
          )}

          {/* Social & WhatsApp CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, alignItems: 'center' }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '12px 24px',
                fontWeight: 900,
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageCircle size={18} /> WhatsApp Me <ArrowRight size={16} />
            </a>
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ background: cardBg, border: `2px solid ${borderColor}`, color: textColor, padding: '10px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <GithubIcon size={15} /> GitHub
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ background: cardBg, border: `2px solid ${borderColor}`, color: textColor, padding: '10px 18px', fontWeight: 700, textDecoration: 'none', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <LinkedinIcon size={15} /> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* AI Highlight Banner if applicable */}
        {highlightedSkills.length > 0 && (
          <div style={{ background: primaryColor, color: '#fff', padding: '14px 20px', borderRadius: 4, marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} /> Highlighted Weaponry:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {highlightedSkills.map((sk, i) => (
                <span key={i} style={{ background: '#000', color: '#fff', padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Works / Projects Section */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: `6px solid ${primaryColor}`, paddingLeft: 14, margin: '0 0 24px' }}>
              Selected Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ background: cardBg, border: `2px solid ${borderColor}`, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{proj.name}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: 1.5, color: mutedColor }}>{proj.description}</p>
                  </div>
                  {proj.tech && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', background: isDark ? '#1f1f23' : '#e4e4e7', color: primaryColor }}>
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

        {/* Experience Section */}
        {experience.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: `6px solid ${primaryColor}`, paddingLeft: 14, margin: '0 0 24px' }}>
              Experience Log
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: cardBg, border: `2px solid ${borderColor}`, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{exp.role}</h3>
                    <span style={{ fontSize: 12, fontWeight: 700, color: primaryColor, textTransform: 'uppercase' }}>{exp.duration}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 12px', color: mutedColor }}>{exp.company}</div>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Marquee Grid */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: `6px solid ${primaryColor}`, paddingLeft: 14, margin: '0 0 24px' }}>
              Skill Arsenal
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ padding: '8px 16px', background: cardBg, border: `2px solid ${borderColor}`, fontWeight: 800, fontSize: 14, textTransform: 'uppercase' }}>
                  {s}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: `6px solid ${primaryColor}`, paddingLeft: 14, margin: '0 0 24px' }}>
              Credentials & Education
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: cardBg, border: `2px solid ${borderColor}`, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: primaryColor, marginBottom: 4 }}>Education</div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{edu.degree || edu.institution}</div>
                  <div style={{ fontSize: 13, color: mutedColor, marginTop: 2 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                </div>
              ))}
              {certifications.map((c, i) => (
                <div key={i} style={{ background: cardBg, border: `2px solid ${borderColor}`, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#10b981', marginBottom: 4 }}>Certification</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{c}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <section key={idx} style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', borderLeft: `6px solid ${primaryColor}`, paddingLeft: 14, margin: '0 0 24px' }}>
              {sec.title}
            </h2>
            <div style={{ background: cardBg, border: `2px solid ${borderColor}`, padding: 24, fontSize: 15, lineHeight: 1.7, color: mutedColor }}>
              {sec.content}
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}

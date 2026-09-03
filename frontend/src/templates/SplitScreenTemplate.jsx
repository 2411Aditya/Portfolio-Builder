import React from 'react';
import {
  Mail, Globe, Phone, ExternalLink,
  Briefcase, Code2, Award, GraduationCap, Sparkles, ArrowRight, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function SplitScreenTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Candidate Name';
  const candidateTitle = data.title || 'Senior Software Engineer';
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

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#38bdf8' : '#0284c7');
  const fontFamily = themeOverrides.fontFamily || "'Plus Jakarta Sans', Inter, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#0f172a' : '#f8fafc');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#1e293b' : '#ffffff');
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', minHeight: '100vh' }}>
        
        {/* Left Fixed/Sticky Pane */}
        <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: `1px solid ${borderColor}`, position: 'sticky', top: 0, height: 'fit-content' }}>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${primaryColor}, #6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 24 }}>
              {candidateName.charAt(0).toUpperCase()}
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
              {candidateName}
            </h1>
            <div style={{ fontSize: 18, color: primaryColor, fontWeight: 600, marginBottom: 20 }}>
              {candidateTitle}
            </div>
            {candidateBio && (
              <p style={{ fontSize: 15, lineHeight: 1.65, color: mutedColor, margin: '0 0 28px' }}>
                {candidateBio}
              </p>
            )}

            {/* AI Focus Pill */}
            {highlightedSkills.length > 0 && (
              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: `1px solid ${primaryColor}44`, borderRadius: 12, padding: '14px 18px', marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: primaryColor, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Sparkles size={14} /> Core Highlights
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {highlightedSkills.map((h, i) => (
                    <span key={i} style={{ fontSize: 11, background: primaryColor, color: '#0f172a', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Row with WhatsApp prominent button */}
          <div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                }}
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              {contact.email && (
                <a href={`mailto:${contact.email}`} style={{ background: primaryColor, color: '#fff', padding: '12px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={15} /> Email
                </a>
              )}
            </div>
            <div style={{ display: 'flex', gap: 16, color: mutedColor, fontSize: 13, flexWrap: 'wrap' }}>
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GithubIcon size={15} /> GitHub
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <LinkedinIcon size={15} /> LinkedIn
                </a>
              )}
              {contact.website && (
                <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Globe size={15} /> Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Scrolling Pane */}
        <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', gap: 48 }}>
          
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={20} style={{ color: primaryColor }} /> Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{exp.role}</h3>
                      <span style={{ fontSize: 12, color: primaryColor, fontWeight: 600 }}>{exp.duration}</span>
                    </div>
                    <div style={{ fontSize: 14, color: mutedColor, fontWeight: 500, margin: '4px 0 12px' }}>{exp.company}</div>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code2 size={20} style={{ color: primaryColor }} /> Projects
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{proj.name}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.5, color: mutedColor }}>{proj.description}</p>
                    {proj.tech && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {proj.tech.map((t, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: mutedColor }}>
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

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} style={{ color: primaryColor }} /> Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: cardBg, border: `1px solid ${borderColor}`, fontSize: 13 }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <GraduationCap size={20} style={{ color: primaryColor }} /> Education
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, padding: 18 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{edu.degree || edu.institution}</div>
                    <div style={{ color: mutedColor, fontSize: 13 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} style={{ color: primaryColor }} /> Certifications & Accreditations
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {certifications.map((c, i) => (
                  <div key={i} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: primaryColor }}>
                    {c}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((sec, idx) => (
            <section key={idx}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: primaryColor }}>
                {sec.title}
              </h2>
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24, fontSize: 14.5, lineHeight: 1.7, color: mutedColor }}>
                {sec.content}
              </div>
            </section>
          ))}

        </div>
      </div>
    </div>
  );
}

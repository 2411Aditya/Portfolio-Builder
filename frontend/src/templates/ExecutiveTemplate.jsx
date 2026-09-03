import React from 'react';
import {
  Briefcase, Award, GraduationCap, Mail, Phone, Globe,
  CheckCircle2, ChevronRight, Sparkles, Building, Calendar, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function ExecutiveTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Executive Leader';
  const candidateTitle = data.title || 'Senior Engineering Leader / Director';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I came across your executive portfolio and would like to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I came across your executive portfolio and would like to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#38bdf8' : '#0284c7'); // executive sky/navy
  const fontFamily = themeOverrides.fontFamily || "'Playfair Display', Georgia, serif";
  const bodyFont = "'Inter', -apple-system, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#0c1322' : '#f8fafc');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#111c34' : '#ffffff');
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        
        {/* Left Executive Profile Sidebar */}
        <aside style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '36px 28px', height: 'fit-content' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: `linear-gradient(135deg, #0284c7, #0f172a)`,
            color: '#fff', fontSize: 32, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, border: `2px solid ${primaryColor}`
          }}>
            {candidateName.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontFamily, fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            {candidateName}
          </h1>
          <div style={{ fontSize: 13, color: primaryColor, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20, fontFamily: bodyFont }}>
            {candidateTitle}
          </div>

          {/* Primary WhatsApp Action */}
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 18px',
              borderRadius: 10,
              background: '#25D366',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: bodyFont,
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              marginBottom: 20
            }}
          >
            <MessageCircle size={17} /> Connect on WhatsApp
          </a>

          <hr style={{ borderColor, margin: '16px 0' }} />

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13, fontFamily: bodyFont }}>
            {contact.phone && (
              <div style={{ color: mutedColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={15} style={{ color: primaryColor }} /> {contact.phone}
              </div>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <LinkedinIcon size={15} style={{ color: primaryColor }} /> LinkedIn Profile
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <GithubIcon size={15} style={{ color: primaryColor }} /> GitHub
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: textColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={15} style={{ color: primaryColor }} /> Website
              </a>
            )}
          </div>

          {/* Executive Skills */}
          {skills.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: mutedColor, marginBottom: 12, fontFamily: bodyFont }}>
                Core Competencies
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontFamily: bodyFont }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '4px 9px', borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}` }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main style={{ fontFamily: bodyFont, display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Executive Summary */}
          {candidateBio && (
            <section style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px' }}>
              <h2 style={{ fontFamily, fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Executive Summary</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: isDark ? '#cbd5e1' : '#334155' }}>
                {candidateBio}
              </p>
            </section>
          )}

          {/* AI Focus Highlight if set */}
          {highlightedSkills.length > 0 && (
            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: `1px solid ${primaryColor}44`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Sparkles size={16} style={{ color: primaryColor }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: primaryColor }}>Strategic AI Focus:</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {highlightedSkills.map((h, i) => (
                  <span key={i} style={{ background: primaryColor, color: '#0c1322', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Timeline */}
          {experience.length > 0 && (
            <section style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px' }}>
              <h2 style={{ fontFamily, fontSize: 20, fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Building size={20} style={{ color: primaryColor }} /> Leadership & Experience
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ paddingBottom: 20, borderBottom: idx < experience.length - 1 ? `1px solid ${borderColor}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{exp.role}</h3>
                      <span style={{ fontSize: 12, color: primaryColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={13} /> {exp.duration}
                      </span>
                    </div>
                    <div style={{ color: mutedColor, fontSize: 14, fontWeight: 500, margin: '4px 0 10px' }}>{exp.company}</div>
                    <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: isDark ? '#94a3b8' : '#475569', whiteSpace: 'pre-line' }}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Strategic Projects */}
          {projects.length > 0 && (
            <section style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px' }}>
              <h2 style={{ fontFamily, fontSize: 20, fontWeight: 700, margin: '0 0 20px' }}>Key Initiatives & Projects</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {projects.map((proj, idx) => (
                  <div key={idx} style={{ padding: 18, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${borderColor}` }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600 }}>{proj.name}</h3>
                    <p style={{ margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.5, color: mutedColor }}>{proj.description}</p>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor, fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        View Initiative <ChevronRight size={13} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Credentials */}
          {(education.length > 0 || certifications.length > 0) && (
            <section style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px' }}>
              <h2 style={{ fontFamily, fontSize: 20, fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <GraduationCap size={20} style={{ color: primaryColor }} /> Education & Accreditations
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{edu.degree || edu.institution}</div>
                    <div style={{ color: mutedColor, fontSize: 13 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                  </div>
                ))}
                {certifications.map((c, i) => (
                  <div key={i} style={{ color: primaryColor, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <Award size={15} /> {c}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {customSections.map((sec, idx) => (
            <section key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '32px 28px' }}>
              <h3 style={{ fontFamily, fontSize: 20, fontWeight: 700, margin: '0 0 12px', color: primaryColor }}>{sec.title}</h3>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: mutedColor }}>{sec.content}</p>
            </section>
          ))}

        </main>
      </div>
    </div>
  );
}

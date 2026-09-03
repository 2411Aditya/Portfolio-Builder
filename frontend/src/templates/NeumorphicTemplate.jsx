import React from 'react';
import {
  Briefcase, Code2, Award, GraduationCap, Mail,
  Globe, Phone, Sparkles, ExternalLink, ArrowRight, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function NeumorphicTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Designer & Engineer';
  const candidateTitle = data.title || 'Product Architect & Designer';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I came across your portfolio and want to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I came across your portfolio and want to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#818cf8' : '#4f46e5');
  const fontFamily = themeOverrides.fontFamily || "'Outfit', Inter, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#181b22' : '#e0e5ec');
  const textColor = isDark ? '#f1f5f9' : '#2d3748';
  const mutedColor = isDark ? '#94a3b8' : '#718096';

  // Neumorphic shadow presets
  const neuExtrude = isDark
    ? '10px 10px 20px #0f1116, -10px -10px 20px #21252e'
    : '10px 10px 20px #b8bec7, -10px -10px 20px #ffffff';

  const neuInset = isDark
    ? 'inset 4px 4px 8px #0f1116, inset -4px -4px 8px #21252e'
    : 'inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff';

  const neuSmall = isDark
    ? '5px 5px 10px #0f1116, -5px -5px 10px #21252e'
    : '5px 5px 10px #b8bec7, -5px -5px 10px #ffffff';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '48px 20px 80px' }}>
      <div style={{ maxWidth: 940, margin: '0 auto' }}>
        
        {/* Profile Card Extruded */}
        <header style={{
          background: bgColor,
          borderRadius: 28,
          padding: '40px 36px',
          boxShadow: neuExtrude,
          marginBottom: 36
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: bgColor,
                boxShadow: neuExtrude,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: primaryColor, fontSize: 32, fontWeight: 800
              }}>
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>{candidateName}</h1>
                <div style={{ fontSize: 16, color: primaryColor, fontWeight: 600 }}>{candidateTitle}</div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '12px 24px',
                  borderRadius: 14,
                  background: '#25D366',
                  boxShadow: neuSmall,
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: 14,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <MessageCircle size={18} /> WhatsApp Me
              </a>
            </div>
          </div>

          {candidateBio && (
            <div style={{
              margin: '28px 0 0', padding: 20, borderRadius: 16,
              background: bgColor, boxShadow: neuInset,
              fontSize: 14.5, lineHeight: 1.7, color: mutedColor
            }}>
              {candidateBio}
            </div>
          )}

          {/* Social Links */}
          <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: 12, background: bgColor, boxShadow: neuSmall, color: textColor, textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: 12, background: bgColor, boxShadow: neuSmall, color: textColor, textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: 12, background: bgColor, boxShadow: neuSmall, color: textColor, textDecoration: 'none', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Globe size={14} /> Website
              </a>
            )}
            {contact.phone && (
              <span style={{ padding: '8px 16px', borderRadius: 12, background: bgColor, boxShadow: neuSmall, color: mutedColor, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={14} /> {contact.phone}
              </span>
            )}
          </div>
        </header>

        {/* AI Highlight Banner if present */}
        {highlightedSkills.length > 0 && (
          <div style={{ background: bgColor, borderRadius: 20, boxShadow: neuSmall, padding: '18px 24px', marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontWeight: 700, color: primaryColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Sparkles size={16} /> AI Focus Modules
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {highlightedSkills.map((sk, i) => (
                <span key={i} style={{ padding: '4px 12px', borderRadius: 9999, background: bgColor, boxShadow: neuInset, fontSize: 12, fontWeight: 700, color: primaryColor }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 size={22} style={{ color: primaryColor }} /> Selected Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {projects.map((proj, idx) => (
                <div key={idx} style={{ background: bgColor, borderRadius: 20, padding: 24, boxShadow: neuExtrude, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{proj.name}</h3>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor, padding: 4, borderRadius: '50%', boxShadow: neuSmall, display: 'flex' }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p style={{ margin: '0 0 16px', fontSize: 13.5, lineHeight: 1.6, color: mutedColor }}>{proj.description}</p>
                  </div>
                  {proj.tech && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {proj.tech.map((t, i) => (
                        <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 8, background: bgColor, boxShadow: neuInset, color: mutedColor }}>
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
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={22} style={{ color: primaryColor }} /> Career History
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {experience.map((exp, idx) => (
                <div key={idx} style={{ background: bgColor, borderRadius: 20, padding: 26, boxShadow: neuExtrude }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, background: bgColor, boxShadow: neuInset, color: primaryColor, fontWeight: 700 }}>
                      {exp.duration}
                    </span>
                  </div>
                  <div style={{ color: primaryColor, fontSize: 14, fontWeight: 600, margin: '4px 0 12px' }}>{exp.company}</div>
                  <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={22} style={{ color: primaryColor }} /> Skill Matrix
            </h2>
            <div style={{ background: bgColor, borderRadius: 20, padding: 26, boxShadow: neuExtrude, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skills.map((s, i) => (
                <span key={i} style={{ padding: '8px 16px', borderRadius: 12, background: bgColor, boxShadow: neuSmall, fontSize: 13, fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certifications Section */}
        {(education.length > 0 || certifications.length > 0) && (
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={22} style={{ color: primaryColor }} /> Education & Certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ background: bgColor, borderRadius: 20, padding: 24, boxShadow: neuExtrude }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: primaryColor, marginBottom: 4 }}>Degree / School</div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{edu.degree || edu.institution}</h3>
                  <div style={{ fontSize: 13, color: mutedColor, marginTop: 4 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                </div>
              ))}
              {certifications.map((c, i) => (
                <div key={i} style={{ background: bgColor, borderRadius: 20, padding: 24, boxShadow: neuExtrude }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#10b981', marginBottom: 4 }}>Certification</div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{c}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <section key={idx} style={{ marginBottom: 40 }}>
            <div style={{ background: bgColor, borderRadius: 20, padding: 26, boxShadow: neuExtrude }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 800, color: primaryColor }}>{sec.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: mutedColor }}>{sec.content}</p>
            </div>
          </section>
        ))}

      </div>
    </div>
  );
}

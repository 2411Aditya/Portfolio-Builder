import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Mail, Phone, Globe, MessageCircle, Sparkles, GraduationCap, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function TerminalTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const [copied, setCopied] = useState(false);
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

  const primaryColor = themeOverrides.primaryColor || '#10b981'; // emerald terminal green default
  const fontFamily = themeOverrides.fontFamily || "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
  const bgColor = themeOverrides.backgroundColor || '#0a0f0d';
  const cardBg = themeOverrides.cardBackground || '#111916';
  const borderColor = '#1f2d27';

  const copyContact = () => {
    if (contact.email) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: '#d1fae5', fontFamily, padding: '40px 16px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        
        {/* Terminal Window Header */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
          <div style={{ background: '#070b09', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${borderColor}`, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ marginLeft: 12, fontSize: 12, color: '#6ee7b7', opacity: 0.8 }}>bash — {slugName}@portfolio:~</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: '#25D366',
                  color: '#000000',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 700
                }}
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
              {contact.email && (
                <button
                  type="button"
                  onClick={copyContact}
                  style={{ background: 'transparent', border: 'none', color: primaryColor, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                  title="Copy email command"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'copied!' : 'copy-email'}
                </button>
              )}
            </div>
          </div>

          {/* Terminal Body */}
          <div style={{ padding: '28px 24px', fontSize: 13, lineHeight: 1.7 }}>
            
            {/* Command 1: whoami */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#34d399' }}>❯</span>
                <span style={{ fontWeight: 600 }}>whoami --verbose</span>
              </div>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>{candidateName}</div>
                <div style={{ color: '#a7f3d0', fontSize: 15, margin: '4px 0 10px' }}>role: "{candidateTitle}"</div>
                {candidateBio && (
                  <div style={{ color: '#9ca3af', maxWidth: 740, lineHeight: 1.6, borderLeft: `2px solid ${primaryColor}`, paddingLeft: 12, margin: '12px 0' }}>
                    {candidateBio}
                  </div>
                )}
                
                {/* Contact row */}
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 14, fontSize: 12, alignItems: 'center' }}>
                  <a href={waUrl} target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700 }}>
                    <MessageCircle size={14} /> connect-whatsapp
                  </a>
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} style={{ color: primaryColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Mail size={13} /> {contact.email}
                    </a>
                  )}
                  {contact.github && (
                    <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: '#6ee7b7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <GithubIcon size={13} /> github
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: '#6ee7b7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <LinkedinIcon size={13} /> linkedin
                    </a>
                  )}
                  {contact.website && (
                    <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: '#6ee7b7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Globe size={13} /> web
                    </a>
                  )}
                  {contact.phone && (
                    <span style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Phone size={13} /> {contact.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Highlight Banner if any */}
            {highlightedSkills.length > 0 && (
              <div style={{ marginBottom: 24, padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 8 }}>
                <div style={{ color: primaryColor, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Sparkles size={14} /> AI Focus Modules:
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {highlightedSkills.map((sk, i) => (
                    <span key={i} style={{ background: primaryColor, color: '#042f2e', padding: '2px 8px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Command 2: cat skills.json */}
            {skills.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#34d399' }}>❯</span>
                  <span style={{ fontWeight: 600 }}>cat system/skills.json</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, paddingLeft: 16 }}>
                  {skills.map((skill, i) => (
                    <span key={i} style={{ padding: '4px 10px', background: '#070b09', border: `1px solid ${borderColor}`, borderRadius: 4, color: '#a7f3d0' }}>
                      '{skill}'
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Command 3: ./experience.sh */}
            {experience.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#34d399' }}>❯</span>
                  <span style={{ fontWeight: 600 }}>./bin/list-experience.sh</span>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {experience.map((exp, idx) => (
                    <div key={idx} style={{ background: '#070b09', border: `1px solid ${borderColor}`, borderRadius: 8, padding: '16px 18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ color: '#ffffff', fontWeight: 600, fontSize: 14 }}>{exp.role} @ {exp.company}</span>
                        <span style={{ color: '#6ee7b7', fontSize: 11, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4 }}>{exp.duration}</span>
                      </div>
                      <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Command 4: git log projects */}
            {projects.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#34d399' }}>❯</span>
                  <span style={{ fontWeight: 600 }}>git log --projects --oneline</span>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                  {projects.map((proj, idx) => (
                    <div key={idx} style={{ background: '#070b09', border: `1px solid ${borderColor}`, borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: '#ffffff', fontWeight: 600 }}>{proj.name}</span>
                        {proj.url && (
                          <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor }}>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5 }}>{proj.description}</p>
                      {proj.tech && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {proj.tech.map((t, i) => (
                            <span key={i} style={{ fontSize: 10, color: '#34d399', opacity: 0.8 }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Command 5: ./education.sh */}
            {education.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#34d399' }}>❯</span>
                  <span style={{ fontWeight: 600 }}>./bin/list-education.sh</span>
                </div>
                <div style={{ marginTop: 12, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ background: '#070b09', border: `1px solid ${borderColor}`, borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: 600 }}>{edu.degree || edu.institution}</div>
                        <div style={{ color: '#6ee7b7', fontSize: 12 }}>{edu.institution}</div>
                      </div>
                      {edu.year && <span style={{ color: '#9ca3af', fontSize: 11 }}>{edu.year}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Command 6: cat certifications.txt */}
            {certifications.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#34d399' }}>❯</span>
                  <span style={{ fontWeight: 600 }}>cat credentials/certifications.txt</span>
                </div>
                <div style={{ marginTop: 10, paddingLeft: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ background: '#070b09', border: `1px solid ${borderColor}`, padding: '6px 12px', borderRadius: 6, color: '#a7f3d0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={13} style={{ color: primaryColor }} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom AI Sections if any */}
            {customSections.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                {customSections.map((sec, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                    <div style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: '#34d399' }}>❯</span>
                      <span style={{ fontWeight: 600 }}>echo ${sec.title.toUpperCase().replace(/\s+/g, '_')}</span>
                    </div>
                    <div style={{ marginTop: 8, paddingLeft: 16, color: '#cbd5e1', fontSize: 12 }}>{sec.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Terminal prompt bottom cursor with direct WhatsApp callout */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: primaryColor }}>
                <span style={{ color: '#34d399' }}>❯</span>
                <span>exit 0</span>
                <span style={{ display: 'inline-block', width: 8, height: 16, background: primaryColor, animation: 'pulse 1s infinite' }} />
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: '#25D366',
                  color: '#000000',
                  textDecoration: 'none',
                  fontSize: 12,
                  fontWeight: 800
                }}
              >
                <MessageCircle size={14} /> Send WhatsApp Message
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

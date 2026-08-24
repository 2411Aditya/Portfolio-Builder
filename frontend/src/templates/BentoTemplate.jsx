import React from 'react';
import {
  Briefcase, Code2, GraduationCap, Award, Mail, Phone,
  Globe, MessageCircle, ExternalLink, Sparkles, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function BentoTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Candidate';
  const candidateTitle = data.title || 'Product Engineer & Creator';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#6366f1' : '#4f46e5');
  const fontFamily = themeOverrides.fontFamily || "'Plus Jakarta Sans', Inter, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#0b0f19' : '#f1f5f9');
  const cardBg = themeOverrides.cardBackground || (isDark ? 'rgba(23, 32, 54, 0.8)' : '#ffffff');
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '48px 20px 80px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        
        {/* Bento Grid Container */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 20 }}>
          
          {/* Main Hero Bento Card (8 Cols) */}
          <div style={{
            gridColumn: 'span 12',
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: 24,
            padding: '36px 32px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 220, height: 220,
              background: `radial-gradient(circle, ${primaryColor}22 0%, transparent 70%)`,
              borderRadius: '50%', pointerEvents: 'none'
            }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ padding: '4px 12px', borderRadius: 9999, background: 'rgba(99, 102, 241, 0.15)', color: primaryColor, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Sparkles size={13} /> Available for Opportunities
                </span>
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                {candidateName}
              </h1>
              <div style={{ fontSize: 18, color: primaryColor, fontWeight: 600, marginBottom: 16 }}>
                {candidateTitle}
              </div>
              {candidateBio && (
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: mutedColor, maxWidth: 680 }}>
                  {candidateBio}
                </p>
              )}
            </div>

            {/* Quick Stat Counter Pills */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 24, paddingTop: 20, borderTop: `1px solid ${borderColor}` }}>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Briefcase size={16} style={{ color: primaryColor }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{experience.length} Roles</span>
              </div>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Code2 size={16} style={{ color: primaryColor }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{projects.length} Projects</span>
              </div>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', padding: '8px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={16} style={{ color: primaryColor }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{skills.length} Skills</span>
              </div>
            </div>
          </div>

          {/* Quick Connect Bento Card */}
          <div style={{
            gridColumn: 'span 12',
            background: `linear-gradient(135deg, ${primaryColor}15, ${cardBg})`,
            border: `1px solid ${primaryColor}33`,
            borderRadius: 24,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: primaryColor, marginBottom: 8 }}>
                Get In Touch
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Let's Build Something Together</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              {contact.email && (
                <a href={`mailto:${contact.email}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: primaryColor, color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={16} /> Send Email</span>
                  <ArrowUpRight size={16} />
                </a>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px 14px', background: cardBg, border: `1px solid ${borderColor}`, color: textColor, borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13 }}>
                    <LinkedinIcon size={15} /> LinkedIn
                  </a>
                )}
                {contact.github && (
                  <a href={contact.github} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px 14px', background: cardBg, border: `1px solid ${borderColor}`, color: textColor, borderRadius: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13 }}>
                    <GithubIcon size={15} /> GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* AI Highlight Banner if applicable */}
          {highlightedSkills.length > 0 && (
            <div style={{
              gridColumn: 'span 12',
              background: 'rgba(99, 102, 241, 0.08)',
              border: `1px solid ${primaryColor}44`,
              borderRadius: 20,
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <span style={{ fontWeight: 600, color: primaryColor, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> AI Focus Expertise:
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {highlightedSkills.map((sk, i) => (
                  <span key={i} style={{ padding: '4px 12px', background: primaryColor, color: '#fff', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects Bento Grid (6 Cols each) */}
          {projects.map((proj, idx) => (
            <div key={idx} style={{
              gridColumn: 'span 6',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{proj.name}</h3>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor, padding: 4 }}>
                      <ArrowUpRight size={18} />
                    </a>
                  )}
                </div>
                <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.6, color: mutedColor }}>
                  {proj.description}
                </p>
              </div>
              {proj.tech && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {proj.tech.map((t, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: mutedColor }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Experience Timeline Bento (12 Cols) */}
          {experience.length > 0 && (
            <div style={{
              gridColumn: 'span 12',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 24,
              padding: '32px 28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Briefcase size={20} style={{ color: primaryColor }} />
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Career Journey</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {experience.map((exp, idx) => (
                  <div key={idx} style={{ borderLeft: `2px solid ${primaryColor}`, paddingLeft: 20, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -5, top: 4, width: 8, height: 8, borderRadius: '50%', background: primaryColor }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{exp.role}</h3>
                      <span style={{ fontSize: 12, color: mutedColor }}>{exp.duration}</span>
                    </div>
                    <div style={{ color: primaryColor, fontWeight: 600, fontSize: 14, margin: '2px 0 8px' }}>{exp.company}</div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Bento (12 Cols) */}
          {skills.length > 0 && (
            <div style={{
              gridColumn: 'span 12',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 24,
              padding: '28px 24px'
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} style={{ color: primaryColor }} /> Tech Stack & Tools
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ padding: '6px 14px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${borderColor}`, fontSize: 13, fontWeight: 500 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections.map((sec, idx) => (
            <div key={idx} style={{
              gridColumn: 'span 12',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: 24,
              padding: '28px 24px'
            }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: primaryColor }}>{sec.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: mutedColor }}>{sec.content}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Calendar, Briefcase, Award, GraduationCap, Code2,
  Mail, Globe, Sparkles, ChevronRight, Check, MessageCircle
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/Icons';

export default function TimelineDocTemplate({ data = {}, theme = 'dark', customStyles = {}, meta = {} }) {
  const { themeOverrides = {}, contentRefinements = {}, customSections = [] } = customStyles;
  const isDark = theme === 'dark';

  const candidateName = contentRefinements.headline || data.name || meta.owner || 'Career Story';
  const candidateTitle = data.title || 'Engineering Lead & Architect';
  const candidateBio = contentRefinements.bio || data.bio || '';
  const highlightedSkills = contentRefinements.highlightedSkills || [];

  const contact = data.contact || {};
  const cleanPhone = (contact.phone || contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${candidateName}, I came across your roadmap portfolio and want to connect!`)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(`Hi ${candidateName}, I came across your roadmap portfolio and want to connect!`)}`;

  const projects = data.projects || [];
  const experience = data.experience || [];
  const skills = data.skills || [];
  const education = data.education || [];
  const certifications = data.certifications || [];

  const primaryColor = themeOverrides.primaryColor || (isDark ? '#f59e0b' : '#d97706'); // warm amber roadmap
  const fontFamily = themeOverrides.fontFamily || "'Plus Jakarta Sans', Inter, sans-serif";
  const bgColor = themeOverrides.backgroundColor || (isDark ? '#0c0a09' : '#fffbeb');
  const cardBg = themeOverrides.cardBackground || (isDark ? '#1c1917' : '#ffffff');
  const textColor = isDark ? '#fafaf9' : '#1c1917';
  const mutedColor = isDark ? '#a8a29e' : '#78716c';
  const borderColor = isDark ? '#292524' : '#fde68a';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, color: textColor, fontFamily, padding: '48px 20px 80px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        
        {/* Story Intro Header */}
        <header style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 9999, background: 'rgba(245, 158, 11, 0.15)', color: primaryColor, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 16 }}>
            <Sparkles size={14} /> Career Roadmap & Timeline
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            {candidateName}
          </h1>
          <div style={{ fontSize: 18, color: primaryColor, fontWeight: 600, marginBottom: 16 }}>
            {candidateTitle}
          </div>
          {candidateBio && (
            <p style={{ maxWidth: 680, margin: '0 auto 24px', fontSize: 15, lineHeight: 1.7, color: mutedColor }}>
              {candidateBio}
            </p>
          )}

          {/* WhatsApp & Social CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: '#ffffff',
                padding: '12px 24px',
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
              <MessageCircle size={16} /> Connect on WhatsApp
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" style={{ color: mutedColor, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Globe size={14} /> Website
              </a>
            )}
          </div>
        </header>

        {/* AI Highlight Banner */}
        {highlightedSkills.length > 0 && (
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: `1px solid ${primaryColor}44`, borderRadius: 16, padding: '16px 20px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontWeight: 700, color: primaryColor, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Sparkles size={16} /> Key Career Strengths:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {highlightedSkills.map((h, i) => (
                <span key={i} style={{ background: primaryColor, color: '#000', padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Vertical Timeline Track */}
        <div style={{ position: 'relative', paddingLeft: 32, borderLeft: `3px solid ${primaryColor}` }}>
          
          {/* Milestone Items: Experience */}
          {experience.map((exp, idx) => (
            <div key={`exp-${idx}`} style={{ marginBottom: 40, position: 'relative' }}>
              {/* Timeline Node Icon */}
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }} />

              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{exp.role}</h3>
                  <span style={{ fontSize: 12, color: primaryColor, fontWeight: 700, background: 'rgba(245,158,11,0.1)', padding: '3px 8px', borderRadius: 6 }}>
                    {exp.duration}
                  </span>
                </div>
                <div style={{ color: mutedColor, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{exp.company}</div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: mutedColor, whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            </div>
          ))}

          {/* Projects as Milestones */}
          {projects.length > 0 && (
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`
              }} />

              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Code2 size={18} style={{ color: primaryColor }} /> Shipped Projects
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  {projects.map((proj, idx) => (
                    <div key={idx} style={{ padding: 16, borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.03)' : '#fef3c7', border: `1px solid ${borderColor}` }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{proj.name}</div>
                      <p style={{ fontSize: 12.5, lineHeight: 1.5, color: mutedColor, margin: '0 0 8px' }}>{proj.description}</p>
                      {proj.url && (
                        <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: primaryColor, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                          Explore project →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skills Milestone */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`
              }} />

              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} style={{ color: primaryColor }} /> Skills & Core Arsenal
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.04)' : '#fef3c7', border: `1px solid ${borderColor}`, fontSize: 13, fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Education Milestone */}
          {education.length > 0 && (
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`
              }} />

              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GraduationCap size={18} style={{ color: primaryColor }} /> Education Foundation
                </h3>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: idx < education.length - 1 ? 12 : 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{edu.degree || edu.institution}</div>
                    <div style={{ color: mutedColor, fontSize: 13 }}>{edu.institution} {edu.year ? `• ${edu.year}` : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Milestone */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`
              }} />

              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} style={{ color: primaryColor }} /> Verified Certifications
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ padding: '8px 14px', borderRadius: 8, background: isDark ? 'rgba(255,255,255,0.04)' : '#fef3c7', border: `1px solid ${borderColor}`, fontSize: 13, fontWeight: 600, color: primaryColor }}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: 40, position: 'relative' }}>
              <div style={{
                position: 'absolute', left: -44, top: 4, width: 22, height: 22,
                borderRadius: '50%', background: primaryColor,
                border: `4px solid ${bgColor}`
              }} />
              <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: primaryColor }}>{sec.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: mutedColor }}>{sec.content}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

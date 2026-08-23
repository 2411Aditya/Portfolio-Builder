import React, { useState } from 'react';
import {
  Mail, Phone, Link2, GitBranch, Globe, ExternalLink,
  Briefcase, Code2, GraduationCap, Award, User,
  CheckCircle2, MessageCircle, FileText, ChevronRight
} from 'lucide-react';

export default function DarkPortfolio({ data, meta }) {
  const [activeTab, setActiveTab] = useState('all');
  const contact = data?.contact || {};

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  const candidateName = data?.name || meta?.owner || 'Candidate Name';
  const candidateTitle = data?.title || 'Software Engineer / Developer';

  const projects = data?.projects || [];
  const experience = data?.experience || [];
  const skills = data?.skills || [];
  const education = data?.education || [];
  const certifications = data?.certifications || [];

  return (
    <div className="dp-shell">
      <div className="profile-container">

        {/* ── Breadcrumb / Profile Label ── */}
        <div className="profile-breadcrumb">
          <span style={{ color: '#94a3b8' }}>Portfolios</span>
          <ChevronRight size={14} style={{ color: '#64748b' }} />
          <span style={{ color: '#f8fafc', fontWeight: 600 }}>{candidateName}</span>
        </div>

        {/* ── Profile Header Card (Dribbble Dark Mode) ── */}
        <header className="profile-header-card">
          <div className="profile-header-main">
            <div className="profile-header-left">
              <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="profile-title-area">
                <h1>{candidateName}</h1>
                <p>{candidateTitle}</p>
                <div className="profile-meta-pills">
                  <span className="profile-meta-pill" style={{ background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.25)', color: '#4ade80' }}>
                    <CheckCircle2 size={13} style={{ color: '#4ade80' }} />
                    Verified Profile
                  </span>
                  {experience.length > 0 && (
                    <span className="profile-meta-pill">
                      <Briefcase size={13} style={{ color: '#94a3b8' }} />
                      {experience.length} Experience {experience.length === 1 ? 'Role' : 'Roles'}
                    </span>
                  )}
                  {projects.length > 0 && (
                    <span className="profile-meta-pill">
                      <Code2 size={13} style={{ color: '#94a3b8' }} />
                      {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                  )}
                  {skills.length > 0 && (
                    <span className="profile-meta-pill">
                      <Award size={13} style={{ color: '#94a3b8' }} />
                      {skills.length} Skills
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="profile-header-actions">
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <MessageCircle size={15} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        </header>

        {/* ── Underline Tab Navigation Bar ── */}
        <nav className="profile-tab-bar" aria-label="Portfolio sections">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Overview & All Details
          </button>
          {experience.length > 0 && (
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience ({experience.length})
            </button>
          )}
          {projects.length > 0 && (
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              Projects ({projects.length})
            </button>
          )}
          {skills.length > 0 && (
            <button
              type="button"
              className={`profile-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills & Education
            </button>
          )}
        </nav>

        {/* ── 2-Column Split Workspace ── */}
        <div className="profile-grid-layout">
          
          {/* ── LEFT MAIN COLUMN ── */}
          <main className="profile-main-col">
            
            {/* Bio / Summary Card */}
            {(activeTab === 'all' || activeTab === 'overview') && data?.bio && (
              <section className="dribbble-card" aria-labelledby="about-card-title">
                <div className="dribbble-card-header">
                  <div id="about-card-title" className="dribbble-card-title">
                    <User size={16} style={{ color: '#60a5fa' }} />
                    About & Summary
                  </div>
                  <span className="dribbble-card-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                    Profile Overview
                  </span>
                </div>
                <p style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {data.bio}
                </p>
              </section>
            )}

            {/* Work Experience Section */}
            {(activeTab === 'all' || activeTab === 'experience') && experience.length > 0 && (
              <section className="dribbble-card" aria-labelledby="exp-card-title">
                <div className="dribbble-card-header">
                  <div id="exp-card-title" className="dribbble-card-title">
                    <Briefcase size={16} style={{ color: '#60a5fa' }} />
                    Work Experience
                  </div>
                  <span className="dribbble-card-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                    {experience.length} Roles Listed
                  </span>
                </div>

                <div>
                  {experience.map((exp, idx) => (
                    <div key={idx} className="timeline-row">
                      <div className="timeline-dot" style={{ background: '#3b82f6', borderColor: '#18181b', boxShadow: '0 0 0 1px #60a5fa' }} />
                      <div className="timeline-header">
                        <div>
                          <div className="timeline-role">{exp.role}</div>
                          <div className="timeline-company" style={{ color: '#60a5fa' }}>{exp.company}</div>
                        </div>
                        {exp.duration && <span className="timeline-duration">{exp.duration}</span>}
                      </div>
                      {exp.description && (
                        <div className="timeline-desc">
                          {exp.description.split('\n').filter(Boolean).map((line, lIdx) => (
                            <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 3 }}>
                              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>•</span>
                              <span>{line.replace(/^[-•▸]\s*/, '')}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Showcase */}
            {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
              <section className="dribbble-card" aria-labelledby="proj-card-title">
                <div className="dribbble-card-header">
                  <div id="proj-card-title" className="dribbble-card-title">
                    <Code2 size={16} style={{ color: '#60a5fa' }} />
                    Key Projects & Deliverables
                  </div>
                  <span className="dribbble-card-badge" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                    {projects.length} Completed
                  </span>
                </div>

                <div>
                  {projects.map((proj, idx) => (
                    <article key={idx} className="project-list-item">
                      <div className="project-list-header">
                        <div className="project-list-title">{proj.name}</div>
                        {proj.url && (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: 12, background: '#27272a', borderColor: 'rgba(255,255,255,0.1)', color: '#f8fafc' }}
                            aria-label={`View live project ${proj.name}`}
                          >
                            <ExternalLink size={12} /> Visit Project
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, marginTop: 4 }}>
                          {proj.description}
                        </p>
                      )}
                      {proj.tech?.length > 0 && (
                        <div className="project-list-tags">
                          {proj.tech.map((t, tIdx) => (
                            <span key={tIdx} className="project-tag" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', color: '#93c5fd' }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {(activeTab === 'all' || activeTab === 'skills') && education.length > 0 && (
              <section className="dribbble-card" aria-labelledby="edu-card-title">
                <div className="dribbble-card-header">
                  <div id="edu-card-title" className="dribbble-card-title">
                    <GraduationCap size={16} style={{ color: '#60a5fa' }} />
                    Education & Credentials
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                  {education.map((edu, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: 8, background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{edu.degree}</div>
                      <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 600, marginTop: 2 }}>{edu.institution}</div>
                      {edu.year && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{edu.year}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}

          </main>

          {/* ── RIGHT DETAILS SIDEBAR ── */}
          <aside className="profile-sidebar-col">
            
            {/* General Info Card */}
            <div className="dribbble-card">
              <div className="dribbble-card-header">
                <div className="dribbble-card-title">
                  <FileText size={15} style={{ color: '#60a5fa' }} />
                  General Details
                </div>
              </div>
              <div className="kv-list">
                <div className="kv-row" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="kv-label">Full Name</span>
                  <span className="kv-value">{candidateName}</span>
                </div>
                <div className="kv-row" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                  <span className="kv-label">Primary Role</span>
                  <span className="kv-value">{candidateTitle}</span>
                </div>
                {contact.email && (
                  <div className="kv-row" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="kv-label">Email</span>
                    <span className="kv-value" style={{ fontSize: 12 }}>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="kv-row" style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="kv-label">Phone</span>
                    <span className="kv-value">{contact.phone}</span>
                  </div>
                )}
                <div className="kv-row">
                  <span className="kv-label">Availability</span>
                  <span className="kv-value" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                    Available for Hire
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications (Matching Dribbble "Certificates" block) */}
            {certifications.length > 0 && (
              <div className="dribbble-card">
                <div className="dribbble-card-header">
                  <div className="dribbble-card-title">
                    <Award size={15} style={{ color: '#4ade80' }} />
                    Certifications & Marks
                  </div>
                  <span className="dribbble-card-badge" style={{ background: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.3)', color: '#4ade80' }}>
                    {certifications.length} Verified
                  </span>
                </div>
                <div>
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="cert-item-v3">
                      <CheckCircle2 size={15} style={{ color: '#4ade80', flexShrink: 0 }} />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Competencies */}
            {skills.length > 0 && (
              <div className="dribbble-card">
                <div className="dribbble-card-header">
                  <div className="dribbble-card-title">
                    <Code2 size={15} style={{ color: '#60a5fa' }} />
                    Skills & Tech Stack
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((s, idx) => (
                    <span key={idx} className="skill-pill-v3">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Connect Card (WhatsApp Only) */}
            {waUrl && (
              <div className="dribbble-card" style={{ background: 'rgba(22, 163, 74, 0.1)', borderColor: 'rgba(22, 163, 74, 0.25)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80', marginBottom: 4 }}>
                  Ready to collaborate?
                </div>
                <p style={{ fontSize: 13, color: '#86efac', marginBottom: 12, lineHeight: 1.5 }}>
                  Chat directly with {candidateName} on WhatsApp for inquiries and project discussions.
                </p>
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
              </div>
            )}

          </aside>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Mail, Phone, Link2, GitBranch, Globe, ExternalLink, Briefcase, Code2, GraduationCap, Award, User, ChevronDown, MessageCircle } from 'lucide-react';

function SectionHeader({ icon, title }) {
  return (
    <div className="lp-section-header">
      <div className="lp-section-icon">{icon}</div>
      <h2>{title}</h2>
      <div className="lp-section-line" />
    </div>
  );
}

function ExpItem({ exp }) {
  return (
    <div className="lp-exp-item" style={{ marginBottom: 24 }}>
      <div className="lp-exp-dot" />
      <div style={{ marginLeft: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
          <div>
            <div className="lp-exp-role">{exp.role}</div>
            <div className="lp-exp-company">{exp.company}</div>
          </div>
          {exp.duration && <span className="lp-exp-duration">{exp.duration}</span>}
        </div>
        {exp.description && (
          <div className="lp-exp-desc">
            {exp.description.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                <span className="lp-exp-bullet">▸</span>
                <span>{line.replace(/^[-•▸]\s*/, '')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjCard({ project }) {
  return (
    <div className="lp-proj-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <div className="lp-proj-name">{project.name}</div>
        {project.url && <a href={project.url} target="_blank" rel="noreferrer" className="lp-proj-link"><ExternalLink size={15} /></a>}
      </div>
      {project.description && <p className="lp-proj-desc">{project.description}</p>}
      {project.tech?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {project.tech.map((t, i) => <span key={i} className="lp-tech-tag">{t}</span>)}
        </div>
      )}
    </div>
  );
}

export default function LightPortfolio({ data, meta }) {
  const [activeSection, setActiveSection] = useState('hero');
  const contact = data?.contact || {};

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  const navItems = [
    { id: 'about', label: 'About', show: !!data?.bio },
    { id: 'skills', label: 'Skills', show: data?.skills?.length > 0 },
    { id: 'experience', label: 'Experience', show: data?.experience?.length > 0 },
    { id: 'projects', label: 'Projects', show: data?.projects?.length > 0 },
    { id: 'education', label: 'Education', show: data?.education?.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ].filter(n => n.show);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setActiveSection(id); };

  return (
    <div className="lp-root">
      {/* Nav */}
      <nav className="lp-nav">
        <div className="lp-nav-brand">{data?.name || meta?.owner}</div>
        <div className="lp-nav-links">
          {navItems.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className={`lp-nav-btn ${activeSection === n.id ? 'active' : ''}`}>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="lp-hero">
        <div className="lp-orb-1" />
        <div className="lp-orb-2" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div className="lp-avatar">{data?.name?.[0]?.toUpperCase() || '?'}</div>
          <h1>{data?.name || 'Your Name'}</h1>
          <div className="lp-hero-title">{data?.title || 'Professional Title'}</div>
          {data?.bio && <p className="lp-hero-bio">{data.bio}</p>}

          <div className="lp-socials">
            {/* Display email and phone as clean non-button display badges */}
            {contact.email && (
              <div className="lp-contact-display">
                <Mail size={15} style={{ color: '#7c3aed' }} />
                <span>{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="lp-contact-display">
                <Phone size={15} style={{ color: '#059669' }} />
                <span>{contact.phone}</span>
              </div>
            )}

            {/* Social Profile Links */}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="lp-social-link"><Link2 size={15} style={{ color: '#3b82f6' }} />LinkedIn</a>}
            {contact.github   && <a href={contact.github}   target="_blank" rel="noreferrer" className="lp-social-link"><GitBranch size={15} />GitHub</a>}
            {contact.website  && <a href={contact.website}  target="_blank" rel="noreferrer" className="lp-social-link"><Globe size={15} style={{ color: '#0891b2' }} />Website</a>}
          </div>
        </div>

        <div className="anim-bounce" style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', color: '#d1d5db' }}>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Content */}
      <div className="lp-content">
        {data?.bio && (
          <section id="about" className="lp-section" style={{ paddingTop: 24 }}>
            <SectionHeader icon={<User size={20} color="#fff" />} title="About Me" />
            <div className="lp-card"><p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.8 }}>{data.bio}</p></div>
          </section>
        )}

        {data?.skills?.length > 0 && (
          <section id="skills" className="lp-section">
            <SectionHeader icon={<Code2 size={20} color="#fff" />} title="Skills" />
            <div className="skills-grid">
              {data.skills.map((s, i) => <span key={i} className="lp-skill-badge">{s}</span>)}
            </div>
          </section>
        )}

        {data?.experience?.length > 0 && (
          <section id="experience" className="lp-section">
            <SectionHeader icon={<Briefcase size={20} color="#fff" />} title="Work Experience" />
            <div>
              {data.experience.map((e, i) => <ExpItem key={i} exp={e} />)}
            </div>
          </section>
        )}

        {data?.projects?.length > 0 && (
          <section id="projects" className="lp-section">
            <SectionHeader icon={<Code2 size={20} color="#fff" />} title="Projects" />
            <div className="proj-grid">
              {data.projects.map((p, i) => <ProjCard key={i} project={p} />)}
            </div>
          </section>
        )}

        {data?.education?.length > 0 && (
          <section id="education" className="lp-section">
            <SectionHeader icon={<GraduationCap size={20} color="#fff" />} title="Education" />
            <div className="edu-grid">
              {data.education.map((e, i) => (
                <div key={i} className="lp-edu-card">
                  <div className="lp-edu-degree">{e.degree}</div>
                  <div className="lp-edu-inst">{e.institution}</div>
                  {e.year && <div className="lp-edu-year">{e.year}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.certifications?.length > 0 && (
          <section id="certifications" className="lp-section">
            <SectionHeader icon={<Award size={20} color="#fff" />} title="Certifications" />
            <div className="cert-grid">
              {data.certifications.map((c, i) => (
                <span key={i} className="lp-cert-tag"><Award size={14} />{c}</span>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="lp-section">
          <SectionHeader icon={<Mail size={20} color="#fff" />} title="Get In Touch" />
          <div className="lp-contact-box">
            <p>Interested in working together? Let's connect!</p>
            <div className="lp-contact-links">
              {/* WhatsApp Button */}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="lp-contact-secondary">
                  <Link2 size={15} /> LinkedIn
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noreferrer" className="lp-contact-secondary">
                  <GitBranch size={15} /> GitHub
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="lp-footer">Built with <span style={{ fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PortfolioAI</span> ✨</footer>
    </div>
  );
}

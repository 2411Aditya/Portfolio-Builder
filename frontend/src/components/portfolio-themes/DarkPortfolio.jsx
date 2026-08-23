import React, { useState } from 'react';
import {
  Mail, Phone, Link2, GitBranch, Globe, ExternalLink,
  Briefcase, Code2, GraduationCap, Award, User, Zap,
  ChevronDown, MessageCircle, Check
} from 'lucide-react';

function SectionHeader({ icon, title }) {
  return (
    <div className="dp-section-header">
      <div className="dp-section-icon">{icon}</div>
      <h2>{title}</h2>
      <div className="dp-section-line" />
    </div>
  );
}

function ExpItem({ exp }) {
  return (
    <div className="exp-item">
      <div className="exp-dot" />
      <div style={{ marginLeft: 20 }}>
        <div className="exp-header">
          <div>
            <div className="exp-role">{exp.role}</div>
            <div className="exp-company">{exp.company}</div>
          </div>
          {exp.duration && <span className="exp-duration">{exp.duration}</span>}
        </div>
        {exp.description && (
          <div className="exp-desc">
            {exp.description.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className="exp-desc-item">
                <span className="exp-bullet">▸</span>
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
    <div className="proj-card">
      <div className="proj-card-header">
        <div className="proj-card-name">{project.name}</div>
        {project.url && (
          <a href={project.url} target="_blank" rel="noreferrer" className="proj-card-link">
            <ExternalLink size={14} strokeWidth={1.5} />
          </a>
        )}
      </div>
      {project.description && <p className="proj-desc">{project.description}</p>}
      {project.tech?.length > 0 && (
        <div className="proj-tech">
          {project.tech.map((t, i) => <span key={i} className="proj-tech-tag">{t}</span>)}
        </div>
      )}
    </div>
  );
}

export default function DarkPortfolio({ data, meta }) {
  const [activeSection, setActiveSection] = useState('hero');
  const contact = data?.contact || {};

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9]/g, '') : '';
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  const navItems = [
    { id: 'about',          label: 'About',      show: !!data?.bio },
    { id: 'skills',         label: 'Skills',     show: data?.skills?.length > 0 },
    { id: 'experience',     label: 'Experience', show: data?.experience?.length > 0 },
    { id: 'projects',       label: 'Projects',   show: data?.projects?.length > 0 },
    { id: 'education',      label: 'Education',  show: data?.education?.length > 0 },
    { id: 'contact',        label: 'Contact',    show: true },
  ].filter(n => n.show);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  return (
    <div className="dp-root">
      {/* Nav */}
      <nav className="dp-nav">
        <div className="dp-nav-brand">
          <Zap size={16} strokeWidth={1.5} style={{ color: '#818cf8' }} />
          <span className="grad">{data?.name || meta?.owner}</span>
        </div>
        <div className="dp-nav-links">
          {navItems.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className={`dp-nav-btn ${activeSection === n.id ? 'active' : ''}`}>
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="dp-hero">
        <div className="orb float"  style={{ top: '20%', left: '15%', width: 460, height: 460, background: 'rgba(99,102,241,0.1)' }} />
        <div className="orb float-2" style={{ bottom: '15%', right: '15%', width: 360, height: 360, background: 'rgba(139,92,246,0.09)' }} />
        <div className="hero-grid" />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div className="dp-avatar">{data?.name?.[0]?.toUpperCase() || '?'}</div>
          <h1>{data?.name || 'Your Name'}</h1>
          <div className="dp-hero-title">{data?.title || 'Professional Title'}</div>
          {data?.bio && <p className="dp-hero-bio">{data.bio}</p>}

          <div className="dp-socials">
            {contact.email && (
              <div className="dp-contact-display">
                <Mail size={14} strokeWidth={1.5} style={{ color: '#818cf8', flexShrink: 0 }} />
                <span>{contact.email}</span>
              </div>
            )}
            {contact.phone && (
              <div className="dp-contact-display">
                <Phone size={14} strokeWidth={1.5} style={{ color: '#4ade80', flexShrink: 0 }} />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="dp-social-link">
                <Link2 size={14} strokeWidth={1.5} style={{ color: '#60a5fa' }} /> LinkedIn
              </a>
            )}
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noreferrer" className="dp-social-link">
                <GitBranch size={14} strokeWidth={1.5} /> GitHub
              </a>
            )}
            {contact.website && (
              <a href={contact.website} target="_blank" rel="noreferrer" className="dp-social-link">
                <Globe size={14} strokeWidth={1.5} style={{ color: '#22d3ee' }} /> Website
              </a>
            )}
          </div>
        </div>

        <div className="anim-bounce" style={{ position: 'absolute', bottom: 24, left: '50%', color: 'rgba(255,255,255,0.18)' }}>
          <ChevronDown size={20} strokeWidth={1.5} />
        </div>
      </section>

      {/* Content */}
      <div className="dp-content">

        {data?.bio && (
          <section id="about" className="dp-section">
            <SectionHeader icon={<User size={18} strokeWidth={1.5} color="#fff" />} title="About Me" />
            <div className="dp-card">
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{data.bio}</p>
            </div>
          </section>
        )}

        {data?.skills?.length > 0 && (
          <section id="skills" className="dp-section">
            <SectionHeader icon={<Code2 size={18} strokeWidth={1.5} color="#fff" />} title="Skills" />
            <div className="skills-grid">
              {data.skills.map((s, i) => <span key={i} className="skill-badge">{s}</span>)}
            </div>
          </section>
        )}

        {data?.experience?.length > 0 && (
          <section id="experience" className="dp-section">
            <SectionHeader icon={<Briefcase size={18} strokeWidth={1.5} color="#fff" />} title="Work Experience" />
            <div className="exp-timeline">
              {data.experience.map((e, i) => <ExpItem key={i} exp={e} />)}
            </div>
          </section>
        )}

        {data?.projects?.length > 0 && (
          <section id="projects" className="dp-section">
            <SectionHeader icon={<Code2 size={18} strokeWidth={1.5} color="#fff" />} title="Projects" />
            <div className="proj-grid">
              {data.projects.map((p, i) => <ProjCard key={i} project={p} />)}
            </div>
          </section>
        )}

        {data?.education?.length > 0 && (
          <section id="education" className="dp-section">
            <SectionHeader icon={<GraduationCap size={18} strokeWidth={1.5} color="#fff" />} title="Education" />
            <div className="edu-grid">
              {data.education.map((e, i) => (
                <div key={i} className="edu-card">
                  <div className="edu-degree">{e.degree}</div>
                  <div className="edu-inst">{e.institution}</div>
                  {e.year && <div className="edu-year">{e.year}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.certifications?.length > 0 && (
          <section id="certifications" className="dp-section">
            <SectionHeader icon={<Award size={18} strokeWidth={1.5} color="#fff" />} title="Certifications" />
            <div className="cert-grid">
              {data.certifications.map((c, i) => (
                <span key={i} className="cert-tag">
                  <Award size={13} strokeWidth={1.5} /> {c}
                </span>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="dp-section">
          <SectionHeader icon={<Mail size={18} strokeWidth={1.5} color="#fff" />} title="Get In Touch" />
          <div className="dp-contact-box">
            <p>Interested in working together? Let's connect!</p>
            <div className="dp-contact-links">
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <MessageCircle size={16} strokeWidth={1.5} /> Chat on WhatsApp
                </a>
              )}
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noreferrer" className="dp-contact-secondary">
                  <Link2 size={14} strokeWidth={1.5} /> LinkedIn
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noreferrer" className="dp-contact-secondary">
                  <GitBranch size={14} strokeWidth={1.5} /> GitHub
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="dp-contact-secondary">
                  <Mail size={14} strokeWidth={1.5} /> Email
                </a>
              )}
            </div>
          </div>
        </section>
      </div>

      <footer className="dp-footer">
        Built with <span className="grad" style={{ fontWeight: 700 }}>PortfolioAI</span> ✨
      </footer>
    </div>
  );
}

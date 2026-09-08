/**
 * Rich sample portfolio dataset used for live template previews across all tiers.
 */
export const SAMPLE_PORTFOLIO_DATA = {
  name: 'Alex Rivera',
  title: 'Lead Full-Stack Architect & Product Engineer',
  bio: 'Passionate software architect with 7+ years of experience engineering high-throughput distributed systems, modern web platforms, and intuitive developer tools. Specialized in cloud-native microservices and responsive UX.',
  contact: {
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-5678',
    whatsapp: '+15552345678',
    linkedin: 'https://linkedin.com/in/alexrivera-dev',
    github: 'https://github.com/alexrivera-tech',
    website: 'https://alexrivera.dev',
    location: 'San Francisco, CA',
  },
  skills: [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'FastAPI',
    'PostgreSQL', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Tailwind CSS',
    'Redis', 'Microservices', 'CI/CD Pipelines', 'System Design'
  ],
  experience: [
    {
      company: 'Apex Cloud Systems',
      role: 'Staff Platform Engineer',
      duration: '2022 – Present',
      description: 'Architected real-time event streaming pipeline processing 12M+ events/day with 99.99% uptime.\nLed transition to distributed micro-frontends, reducing load times by 42% across enterprise dashboards.\nMentored 8 senior engineers and standardized company-wide TypeScript & API architectural guidelines.'
    },
    {
      company: 'Vanguard Interactive',
      role: 'Senior Full-Stack Developer',
      duration: '2020 – 2022',
      description: 'Designed and shipped high-performance SaaS analytics suite with React, WebGL, and Node.js.\nEngineered multi-tenant database partitioning strategies in PostgreSQL saving $40k/yr in infrastructure.\nImplemented automated CI/CD deployment pipelines reducing release cycle time from 3 days to 25 minutes.'
    },
    {
      company: 'Nexus Tech Labs',
      role: 'Software Engineer',
      duration: '2018 – 2020',
      description: 'Built scalable RESTful & GraphQL microservices supporting 500k+ active mobile app users.\nCollaborated closely with UX designers to craft high-conversion onboarding workflows and responsive components.'
    }
  ],
  projects: [
    {
      name: 'HyperPulse Engine',
      description: 'Ultra-fast distributed cache & pub-sub engine designed for low-latency edge deployments with real-time websocket synchronization.',
      tech: ['Go', 'TypeScript', 'Redis', 'WebSockets', 'Docker'],
      url: 'https://github.com/alexrivera-tech/hyperpulse-engine'
    },
    {
      name: 'DevFlow UI Studio',
      description: 'Open-source design system and component generator for rapid product prototyping with automatic accessibility auditing.',
      tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Storybook'],
      url: 'https://github.com/alexrivera-tech/devflow-ui'
    },
    {
      name: 'OmniAI Document Intelligence',
      description: 'AI-assisted multimodal parsing and vector search platform for enterprise documentation with sub-50ms query response.',
      tech: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'Next.js'],
      url: 'https://github.com/alexrivera-tech/omniai-docs'
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Engineering',
      year: '2014 – 2018'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect – Professional',
    'Certified Kubernetes Administrator (CKA)',
    'HashiCorp Certified Terraform Associate'
  ]
};

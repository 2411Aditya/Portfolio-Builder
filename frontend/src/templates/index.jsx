import React from 'react';
import MinimalTemplate from './MinimalTemplate';
import TerminalTemplate from './TerminalTemplate';
import BentoTemplate from './BentoTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeBoldTemplate from './CreativeBoldTemplate';
import SplitScreenTemplate from './SplitScreenTemplate';
import GlassmorphismTemplate from './GlassmorphismTemplate';
import TimelineDocTemplate from './TimelineDocTemplate';
import NotionDocTemplate from './NotionDocTemplate';
import NeumorphicTemplate from './NeumorphicTemplate';

/**
 * Full Template Registry with Plan Tier Specifications
 */
export const TEMPLATE_REGISTRY = {
  // ─── Free Tier (2) ───
  minimal: {
    id: 'minimal',
    name: 'Minimal Classic',
    description: 'Clean single-column layout with classic typography & responsive structure.',
    tier: 'free',
    component: MinimalTemplate,
    thumbnailColor: '#3b82f6',
    previewGradient: 'linear-gradient(135deg, #1e293b, #0f172a)',
    tags: ['Clean', 'Minimal', 'Fast'],
  },
  terminal: {
    id: 'terminal',
    name: 'Developer Terminal',
    description: 'Monospace CLI shell with command syntax highlighting and hacker aesthetic.',
    tier: 'free',
    component: TerminalTemplate,
    thumbnailColor: '#10b981',
    previewGradient: 'linear-gradient(135deg, #064e3b, #022c22)',
    tags: ['Monospace', 'CLI', 'Code'],
  },

  // ─── Lite Tier (4) ───
  bento: {
    id: 'bento',
    name: 'Bento Grid',
    description: 'Modern rounded bento cards with dynamic grid hierarchy and stat pills.',
    tier: 'lite',
    component: BentoTemplate,
    thumbnailColor: '#6366f1',
    previewGradient: 'linear-gradient(135deg, #4338ca, #312e81)',
    tags: ['Bento Grid', 'Modern', 'Dynamic'],
  },
  executive: {
    id: 'executive',
    name: 'Executive Lead',
    description: 'Corporate leadership layout with sticky sidebar and refined editorial type.',
    tier: 'lite',
    component: ExecutiveTemplate,
    thumbnailColor: '#0284c7',
    previewGradient: 'linear-gradient(135deg, #0369a1, #0c4a6e)',
    tags: ['Leadership', 'Sidebar', 'Editorial'],
  },
  creative_bold: {
    id: 'creative_bold',
    name: 'Neo-Grotesque Bold',
    description: 'High-contrast striking typography with neon highlights and impactful headers.',
    tier: 'lite',
    component: CreativeBoldTemplate,
    thumbnailColor: '#ff0055',
    previewGradient: 'linear-gradient(135deg, #be123c, #881337)',
    tags: ['High Contrast', 'Bold', 'Creative'],
  },
  split_screen: {
    id: 'split_screen',
    name: 'Split Screen Pane',
    description: 'Sticky profile card on left with seamless scrolling project timeline on right.',
    tier: 'lite',
    component: SplitScreenTemplate,
    thumbnailColor: '#0ea5e9',
    previewGradient: 'linear-gradient(135deg, #0284c7, #075985)',
    tags: ['Dual Pane', 'Sticky', 'Interactive'],
  },

  // ─── Pro Tier (4) ───
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Luminous Glass',
    description: 'Frosted glassmorphism cards with backdrop blur and iridescent glowing borders.',
    tier: 'pro',
    component: GlassmorphismTemplate,
    thumbnailColor: '#a855f7',
    previewGradient: 'linear-gradient(135deg, #7e22ce, #581c87)',
    tags: ['Glassmorphism', 'Blur', 'Luminous'],
  },
  timeline_doc: {
    id: 'timeline_doc',
    name: 'Storytelling Roadmap',
    description: 'Connected chronological milestone timeline with journey storytelling nodes.',
    tier: 'pro',
    component: TimelineDocTemplate,
    thumbnailColor: '#f59e0b',
    previewGradient: 'linear-gradient(135deg, #b45309, #78350f)',
    tags: ['Storytelling', 'Milestones', 'Roadmap'],
  },
  notion_doc: {
    id: 'notion_doc',
    name: 'Notion Workspace',
    description: 'Minimalist Notion-like documentation workspace with callout boxes and toggles.',
    tier: 'pro',
    component: NotionDocTemplate,
    thumbnailColor: '#64748b',
    previewGradient: 'linear-gradient(135deg, #334155, #1e293b)',
    tags: ['Notion Style', 'Docs', 'Collapsible'],
  },
  neumorphic: {
    id: 'neumorphic',
    name: 'Soft Neumorphic',
    description: 'Tactile embossed shadows and soft convex/concave interactive surfaces.',
    tier: 'pro',
    component: NeumorphicTemplate,
    thumbnailColor: '#818cf8',
    previewGradient: 'linear-gradient(135deg, #374151, #1f2937)',
    tags: ['Neumorphism', 'Embossed', 'Tactile'],
  },
};

/**
 * Return matching template component with safe fallback to MinimalTemplate
 */
export function getTemplateComponent(templateId) {
  if (templateId && TEMPLATE_REGISTRY[templateId]) {
    return TEMPLATE_REGISTRY[templateId].component;
  }
  return MinimalTemplate;
}

export const TIER_ORDER = {
  free: 0,
  lite: 1,
  pro: 2,
};

/**
 * Check whether a user's plan tier satisfies the required template tier
 */
export function canAccessTemplate(userTier = 'free', templateTier = 'free') {
  const userLevel = TIER_ORDER[userTier] || 0;
  const reqLevel = TIER_ORDER[templateTier] || 0;
  return userLevel >= reqLevel;
}

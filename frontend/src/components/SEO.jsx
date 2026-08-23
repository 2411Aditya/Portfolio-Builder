import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const DEFAULT_SITE_URL = 'https://portfolio-builder-six-jet.vercel.app';
const DEFAULT_SITE_NAME = 'PortfolioAI';
const DEFAULT_TITLE = 'AI Portfolio Builder | Free Developer Portfolio Generator & Resume to Website';
const DEFAULT_DESCRIPTION = 'Turn your resume into a stunning, recruiter-ready developer portfolio in under 30 seconds. Powered by AI with custom themes, instant hosting, and rich SEO.';
const DEFAULT_KEYWORDS = 'AI Portfolio Builder, Resume to Website, Free Developer Portfolio Generator, AI Resume Parser, Developer Portfolio Maker, Online Portfolio Builder';
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/favicon.svg`;

/**
 * Reusable SEO component for dynamic head metadata and JSON-LD schema injection.
 *
 * @param {Object} props
 * @param {string} [props.title] - Page title.
 * @param {string} [props.description] - Page meta description.
 * @param {string|string[]} [props.keywords] - Target keywords.
 * @param {string} [props.image] - OpenGraph / Twitter preview image URL.
 * @param {string} [props.url] - Canonical page URL.
 * @param {string} [props.type='website'] - OpenGraph type ('website', 'profile', 'article').
 * @param {string} [props.author] - Author name.
 * @param {boolean} [props.noindex=false] - When true, sets robots to 'noindex, nofollow'.
 * @param {Object|Object[]} [props.schema] - Single JSON-LD schema object or array of schemas.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author = DEFAULT_SITE_NAME,
  noindex = false,
  schema = null,
}) {
  const location = useLocation();

  // Normalize full canonical URL
  const canonicalUrl = url
    ? (url.startsWith('http') ? url : `${DEFAULT_SITE_URL}${url.startsWith('/') ? url : `/${url}`}`)
    : `${DEFAULT_SITE_URL}${location?.pathname || '/'}`;

  // Normalize absolute image URL
  const imageUrl = image.startsWith('http')
    ? image
    : `${DEFAULT_SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  // Normalize keywords string
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords || DEFAULT_KEYWORDS;

  // Format page title
  const formattedTitle = title
    ? (title.includes(DEFAULT_SITE_NAME) ? title : `${title}`)
    : DEFAULT_TITLE;

  // Normalize schemas (can be single object or array)
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      {/* ── Standard Metadata ── */}
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph / Facebook / LinkedIn / WhatsApp ── */}
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={formattedTitle} />

      {/* ── Twitter Cards ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={formattedTitle} />

      {/* ── Dynamic JSON-LD Structured Data ── */}
      {schemas.map((s, idx) => (
        <script key={`json-ld-${idx}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}

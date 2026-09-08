# auoraa User Guide & Manual

Welcome to **auoraa** — the AI-powered portfolio builder that transforms your resume into an elegant, hosted, and shareable web portfolio in seconds.

This guide covers all existing features, workflows, and tools available on the platform.

---

## 📑 Table of Contents

1. [Getting Started & Account Setup](#1-getting-started--account-setup)
2. [Dashboard Navigation](#2-dashboard-navigation)
3. [Uploading & Importing Your Resume](#3-uploading--importing-your-resume)
4. [Choosing & Previewing Templates](#4-choosing--previewing-templates)
5. [Generating Your Portfolio](#5-generating-your-portfolio)
6. [Managing Active Portfolios](#6-managing-active-portfolios)
7. [AI Design Customizer (Pro Feature)](#7-ai-design-customizer-pro-feature)
8. [Subscription Plans & Upgrades](#8-subscription-plans--upgrades)
9. [Public Portfolio Sharing & SEO](#9-public-portfolio-sharing--seo)
10. [Troubleshooting & FAQs](#10-troubleshooting--faqs)

---

## 1. Getting Started & Account Setup

### Creating an Account
1. Visit the homepage (`/`) and click **Get Started** or navigate to `/register`.
2. Fill in:
   - **Username** (3–30 characters, letters, numbers, and underscores only).
   - **Email Address**.
   - **Password** (minimum 6 characters).
3. Select your desired plan tier (Free Starter, Lite Creator, or Pro Visionary). If you pick a paid tier during registration, you will be seamlessly guided to complete the upgrade upon signing up.
4. Click **Create Account**.

### Logging In
1. Navigate to `/login`.
2. Enter your registered email and password.
3. Click **Sign In** to access your dashboard.

---

## 2. Dashboard Navigation

Your dashboard (`/dashboard`) includes a top navigation bar with five dedicated views:

| Tab | Purpose |
|:---|:---|
| **⚡ Generator / Upload** | Upload your resume, select a template and theme, and generate a new portfolio. |
| **🔗 Active Links** | View, preview, share, switch templates, or delete your existing published portfolios. |
| **👤 Personal Info** | Review your profile details, current subscription tier, and account settings. |
| **✨ Features** | Explore an interactive overview of all platform capabilities and visual designs. |
| **🏢 About Us** | Read about the mission, engineering philosophy, and design vision behind auoraa. |

---

## 3. Uploading & Importing Your Resume

1. On the **Generator** tab, drag and drop your resume into the upload box or click **Browse File**.
2. **Supported file formats:**
   - Document: `PDF (.pdf)`, `Word (.docx)`, `Plain Text (.txt)`
   - Images: `PNG (.png)`, `JPEG (.jpg, .jpeg)`, `WebP (.webp)`
3. The platform automatically checks your file format and displays the selected file name and size.

---

## 4. Choosing & Previewing Templates

auoraa includes **10 curated templates** tailored to different career disciplines and aesthetic preferences.

### The 10 Built-In Templates

#### 1. Free Starter Tier
- **Minimal Classic (`minimal`):** A clean, single-column minimalist layout with high readability and fast loading.
- **Developer Terminal (`terminal`):** An interactive multi-page CLI terminal shell with tabbed navigation, command execution, and monospace typography.

#### 2. Lite Creator Tier
- **Bento Grid (`bento`):** Modern rounded bento cards with dynamic hierarchy, interactive stat pills, and dual-mode theme.
- **Executive Lead (`executive`):** Corporate leadership layout featuring a sticky sidebar and editorial typography.
- **Neo-Grotesque Bold (`creative_bold`):** Striking typography with vibrant neon accents and impactful headers.
- **Split Screen Pane (`split_screen`):** Sticky profile card on the left with a smooth scrolling project timeline on the right.

#### 3. Pro Visionary Tier
- **Luminous Glass (`glassmorphism`):** Frosted glassmorphism cards with backdrop blur and iridescent glowing borders.
- **Storytelling Roadmap (`timeline_doc`):** Chronological milestone roadmap designed for journey storytelling.
- **Notion Workspace (`notion_doc`):** Minimalist Notion-style documentation workspace with callouts and toggles.
- **Soft Neumorphic (`neumorphic`):** Tactile embossed shadows and soft convex/concave interactive surfaces.

### Previewing Templates
- Click the **Eye icon (Preview)** on any template card in the generator or template picker to open the **Template Preview Modal**.
- Inspect live sample data rendered in real-time before applying it to your resume.

---

## 5. Generating Your Portfolio

1. **Upload your file** in the Generator tab.
2. **Choose a theme:** Select between **Dark** or **Light** theme base.
3. **Select a template:** Click your preferred template card (locked templates will prompt an upgrade modal if on a lower tier).
4. Click **Generate Portfolio**.
5. Watch the real-time AI progress stages:
   - *Parsing document structure & typography…*
   - *Extracting skills, projects & experience…*
   - *Styling live responsive portfolio…*
6. Once complete, your portfolio URL is generated instantly (`/p/:username/:portfolioId`).
7. Click **View Portfolio** to open your live site, or **Copy Link** to share it immediately.

---

## 6. Managing Active Portfolios

Access the **Active Links** tab to manage all your generated portfolios:

- **📋 Copy Link:** Copy the public shareable link (`/p/<username>/<id>`) directly to your clipboard.
- **👁️ Preview:** Launch the portfolio in a new browser tab.
- **🎨 Change Template:** Use the built-in dropdown selector on any portfolio card to instantly change its template (e.g., switch from `Minimal` to `Bento Grid` or `Terminal`).
- **🗑️ Delete Portfolio:** Remove any outdated or unwanted portfolios with confirmation.

---

## 7. AI Design Customizer (Pro Feature)

If you are on the **Pro Visionary** plan, you have access to the conversational **AI Design Customizer**:

### How to Use the Customizer:
1. Open your live portfolio URL (`/p/:username/:portfolioId`).
2. Click the floating **AI Customizer** button (or Sparkles icon).
3. The right-hand AI Customizer Drawer opens.
4. Type natural language instructions or select from pre-made prompt suggestions, such as:
   - *"Make the theme emerald green and tone my bio for a Senior Cloud Architect."*
   - *"Highlight React, Python, and System Design with a modern cyber aesthetic."*
   - *"Corporate slate palette with an executive leadership summary."*
   - *"Neon violet cyberpunk theme with high-contrast accent glow."*
5. Click **Send** / press Enter.
6. The AI will compute new color palettes, headline refinements, typography adjustments, and content enhancements.
7. Changes update **instantly in real time** on your screen and are synchronized with your Supabase database and local storage.

---

## 8. Subscription Plans & Upgrades

auoraa offers three subscription tiers:

| Tier | Price | Included Features |
|:---|:---|:---|
| **Free Starter** | ₹0 / forever | 2 Classic Templates (`minimal`, `terminal`), AI Resume Parsing, Instant Public URL, Unlimited Profile Views. |
| **Lite Creator** | ₹19 / month | 6 Dynamic Templates (Bento, Executive, Creative Bold, Split Screen + Free), Direct Social Links, Priority CDN. |
| **Pro Visionary** | ₹29 / month | All 10 Premium Templates (Glassmorphism, Timeline, Notion, Neumorphic), **AI Design Customizer**, 3D Tactile Effects, Custom SEO Meta tags. |

### How to Upgrade via Razorpay:
1. Click **Upgrade Plan** in the top navigation or click any locked template/feature.
2. Select **Lite Creator** or **Pro Visionary**.
3. The **Razorpay Checkout Modal** will open.
4. Complete payment using UPI, Credit/Debit Card, NetBanking, or Wallet.
5. Your account tier upgrades automatically upon payment confirmation.

> **Note on Subscription Validity:** Paid subscriptions are valid for 1 month from activation. The platform automatically monitors subscription status and maintains access for the full billing cycle.

---

## 9. Public Portfolio Sharing & SEO

Every portfolio created with auoraa is publicly accessible and search-engine optimized:

- **Custom URL:** `https://your-domain.com/p/<username>/<portfolio-id>`
- **Automatic SEO Metadata:** Includes dynamic title tags, meta descriptions, candidate keywords, and social OpenGraph tags.
- **Schema.org Structured Data:** Automatically generates `Person` and `ProfilePage` JSON-LD data so search engines and recruiters can discover candidate information.
- **Responsive Layout:** Works smoothly on mobile devices, tablets, and wide desktop screens.
- **Built-with Badge:** Each portfolio includes an unobtrusive "Built with auoraa" footer badge linking back to the platform.

---

## 10. Troubleshooting & FAQs

### Q: Why did AI parsing fail on my resume?
- Ensure your file is not password-protected or corrupted.
- For image uploads (PNG/JPG), ensure the text is clear, high-resolution, and legible.
- Confirm your document is in one of the supported formats: `.pdf`, `.docx`, `.txt`, `.png`, `.jpg`, `.jpeg`, `.webp`.

### Q: How do I change the template on a portfolio I already generated?
- Go to **Dashboard** > **Active Links**.
- Find the portfolio card and use the template dropdown menu to switch to any template available on your tier.

### Q: What happens when my 1-month paid subscription expires?
- Your existing portfolios will remain safely accessible online. If downgraded to the Free tier, template editing and new generations will revert to Free tier options until renewed.

### Q: Can I customize individual colors and bio text?
- Yes! If you are on the **Pro Visionary** tier, open your portfolio and launch the **AI Customizer** drawer to adjust colors, fonts, layout accents, and text copy.

---

*Need help or want to report an issue? Check the **About Us** or **Features** tabs on your dashboard.*

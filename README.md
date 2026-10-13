# Mohit Rajput — Personal Portfolio

A modern, responsive portfolio showcasing my work as a front-end developer with Salesforce expertise. Built with React, TypeScript, Tailwind CSS, and Vite, the portfolio highlights enterprise Salesforce projects, certifications, technical articles, and interactive UI experiences.

## 🌐 Live Website

**https://mohitveer.netlify.app**

---

## 🚀 Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion


### Design

- Figma
- Adobe XD
- Design-to-Code

### Tools

- Git
- GitHub
- VS Code
- npm

---

## ✨ Features

- Multi-page experience: Home, Projects, Experience, Skills, Achievements, Articles, Contact and Résumé
- A dedicated page for every client project (`/projects/:slug`) and article summary (`/blog/:slug`), with hover effects, back-navigation scroll restoration and cross-links between roles, projects and articles
- Contact page with a draggable, physics-driven Wipro ID card on a lanyard (black ribbon in the dark theme, blue in the light theme)
- Fully responsive layouts with graceful fallbacks for small and short screens
- Dark & Light theme
- Scroll-driven animations (Framer Motion + Lenis)
- Enterprise experience timeline
- Original Salesforce certificates, superbadges, Trailhead status and awards, plus course, training and internship certificates from Udemy, freeCodeCamp, Internshala and Forelsket
- Employer logos next to every role and downloadable role documents (experience letter, relieving letter, …) managed from the admin
- Client projects drawn from professional experience (Wipro, Mphasis Silverline, DJT), overridable from the admin CMS
- Live GitHub integration — contribution heatmap, languages and recent activity refresh automatically
- Contact form that delivers by email to the owner, with a hire-me call to action
- Keyboard accessibility
- SEO optimized: every route, project and article page is pre-rendered at build time with its own title, description, canonical, Open Graph / Twitter tags and JSON-LD, and `sitemap.xml` is generated from the same data

---

## 📂 Project Structure

```
src/
│
├── pages/               # Route-level pages (Home, Projects, Experience, Skills, ...)
├── components/          # Sections and reusable UI, grouped by page
├── data/                # Centralized fallback content
├── hooks/               # Custom React hooks
├── lib/                 # API clients, analytics and helpers
├── App.tsx              # Routes
└── main.tsx
netlify/functions/
├── github.mts           # Live GitHub feed served at /api/github
└── track.mts            # First-party analytics endpoint
```

Most portfolio content—including projects, certifications, skills, experience, articles, and contact information—is managed from the data layer, making updates straightforward without modifying component logic.

---

## 🛠️ Admin CMS

`/admin` (Supabase sign-in) edits the content tables live, with no deploy needed: Experience (with role documents), Skills, Certifications, Superbadges, Projects, Engagement cards, Articles, FAQ and Numbers & tags (Trailhead figures, impact numbers, hero tags).

- The site is **database-first**: when a table has rows they replace the built-in content from `src/data`; when it is empty the built-in content is shown. Every editor can import the built-in entries, and Experience and Certifications offer **Add missing roles / certificates** for entries that exist in code but are not in the database yet.
- Role documents (experience, relieving or offer letters, certificates) are added under Experience → Documents. Uploads go to the public Supabase Storage bucket `documents` (PDF, PNG, JPG or WebP up to 10 MB) and appear as links under the role.
- Content edits are live immediately. New project or article pages get their own meta tags and sitemap entry on the next deploy, because the build reads the tables when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set (and falls back to the built-in pages if the database cannot be reached).
- The database setup lives in `supabase/migrations`.

---

## 🔎 SEO and Search Console

- `npm run build` pre-renders `projects/*.html`, `blog/*.html` and every top-level route (see `vite.seo.ts` and `src/lib/seo.ts`) and writes `sitemap.xml`; Netlify serves these files before the SPA fallback, so crawlers and link previews see the right tags without running JavaScript
- Page titles and descriptions have one source, `src/lib/siteRoutes.ts` (the home `<head>` is rewritten from it at build); the headline wording is `SITE_ROLE` in `src/lib/site.ts`
- Verify the site in Google Search Console with the **HTML tag** method on the URL-prefix property `https://mohitveer.netlify.app`, copy the token from the meta tag, set `GOOGLE_SITE_VERIFICATION` (and optionally `BING_SITE_VERIFICATION`) in the Netlify environment, redeploy, then press Verify
- Submit `https://mohitveer.netlify.app/sitemap.xml` under Sitemaps and request indexing for the home page and a few project pages

---

## ♿ Accessibility

Built with accessibility in mind following WCAG 2.1 AA guidelines.

Features include:

- Semantic HTML landmarks
- Keyboard navigation support
- Focus-visible states
- Skip-to-content navigation
- Accessible color contrast
- Screen reader friendly content
- Reduced motion support
- Dialogs with focus trapping, Escape to close and focus restoration

---

## 📱 Responsive Design

Optimized for:

- Mobile
- Tablet
- Laptop
- Desktop
- Ultra-wide displays

Designed using a mobile-first approach with Tailwind CSS breakpoints.

---

## ⚡ Performance

- Optimized images
- Lazy-loaded assets
- Component-based architecture
- Fast Vite builds
- Production-ready code structure
- Reusable React components

---

## 🏆 Highlights

- 9× Salesforce Certified
- Trailhead Triple Star Ranger
- Agentblazer Innovator 2026
- Multiple Salesforce Superbadges
- 5+ years of front-end development with Salesforce expertise
- Experience across LWC, OmniStudio, Experience Cloud, Marketing Cloud, and Agentforce

---

## 🚀 Getting Started

```bash
npm install

npm run dev

npm run build

npm run preview

npm run lint
```

Requires **Node.js 20+**

### GitHub feed

`/api/github` is a Netlify Function that returns the public profile, repositories, languages, recent activity and the contribution calendar for the configured GitHub user. During `npm run dev` the same function runs through a Vite middleware, so no extra tooling is needed. Responses are cached for ten minutes. Setting an optional `GITHUB_TOKEN` environment variable raises the GitHub API rate limit; the feed works without it.

### Contact form

The contact page posts to `/api/contact` (`netlify/functions/contact.mts`). The recipient is hard-coded to `rajput.mohit.veer@gmail.com`, the visitor's address is set as the reply-to, and nothing in the browser can change the destination. Delivery uses [Resend](https://resend.com): create a free account with that same email address, create an API key and add it as the `RESEND_API_KEY` environment variable in Netlify (Site configuration → Environment variables). With the default `onboarding@resend.dev` sender, Resend delivers to the account owner's own address, so no domain setup is needed.

If `RESEND_API_KEY` is not set, the form falls back to Netlify Forms (form name `contact`, declared in `index.html`). That requires enabling form detection (Site configuration → Forms) and adding an email notification for the `contact` form under Forms → Form notifications. If neither is configured, the page shows an error with the direct email address instead of reporting a false success. During `npm run dev` nothing is sent; the form shows a development notice.

---

## 🚀 Deployment

The application is a static React application and can be deployed on:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any static hosting provider

Default build command:

```bash
npm run build
```

Output directory:

```text
dist/
```

---

## 📫 Connect With Me

**Portfolio**
https://mohitveer.netlify.app

**LinkedIn**
https://linkedin.com/in/mohit-veer

**Trailblazer**
https://www.salesforce.com/trailblazer/mrajputsl

---

## 📄 License

This project is licensed under the MIT License.

---

# Mohit Rajput — Personal Portfolio

A modern, responsive portfolio showcasing my expertise as a Salesforce UI Engineer and Front-End Developer. Built with React, TypeScript, Tailwind CSS, and Vite, the portfolio highlights enterprise Salesforce projects, certifications, technical articles, and interactive UI experiences.

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
- Original Salesforce certificates, superbadges, Trailhead status and awards
- Client projects drawn from professional experience (Wipro, Mphasis Silverline, DJT), overridable from the admin CMS
- Live GitHub integration — contribution heatmap, languages and recent activity refresh automatically
- Contact form that delivers by email to the owner, with a hire-me call to action
- Keyboard accessibility
- SEO optimized

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
- 5+ years of Salesforce UI & Front-End Development
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

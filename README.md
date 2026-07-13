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

### Salesforce

- Lightning Web Components (LWC)
- OmniStudio
- Experience Cloud
- Marketing Cloud
- Agentforce
- Salesforce Lightning Design System (SLDS)

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

- Modern, responsive UI
- Dark & Light theme
- Interactive animations
- Enterprise experience timeline
- Salesforce certifications & superbadges
- Technical skills showcase
- Project portfolio
- Published technical articles
- Interactive "Lightning Rush" mini-game
- Contact section
- Keyboard accessibility
- SEO optimized

---

## 📂 Project Structure

```
src/
│
├── components/          # Reusable UI components
├── sections/            # Portfolio sections
├── data/                # Centralized content
├── hooks/               # Custom React hooks
├── assets/              # Images & icons
├── utils/               # Helper utilities
├── App.tsx
└── main.tsx
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
- Fully keyboard-playable Lightning Rush game

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

- 7× Salesforce Certified
- Trailhead Double Star Ranger
- Agentblazer Champion 2026
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

Requires **Node.js 18+**

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


## 🧭 Design system: "Cinematic Scroll"

The site is built as a sequence of full-viewport "scenes" instead of a stacked-card layout —
closer to an award-show/experimental portfolio than a SaaS landing page:

- **Palette** — warm-charcoal background (not pure black), warm off-white text, one cobalt-blue
  signal accent used deliberately sparingly (not the near-black + neon-green/vermilion combo that's
  becoming an AI-generated-site cliché). Contrast checked in the comment block at the top of
  `src/index.css`.
- **Type** — Bricolage Grotesque (display), Inter (body), JetBrains Mono (index labels, dates,
  stats — the "console" register).
- **Structure** — `src/components/cinematic/Scene.tsx` wraps every full-viewport section, tagging
  it `data-scene`/`data-index`/`data-label` so `useActiveScene` can drive the corner index
  (`MinimalBar.tsx`) and full-screen scene menu (`OverlayMenu.tsx`, with a real keyboard focus trap)
  without a traditional sticky navbar with pill links.
- **Reveal** — `src/components/cinematic/Reveal.tsx` is the shared scroll-triggered fade/rise used
  across every scene; it collapses to a plain instant render under `prefers-reduced-motion`.
- **Signature moment** — `src/components/Experience.tsx` (scene 05, "Route History") is a
  scroll-jacked horizontal gallery: the container is pinned via `position: sticky` while Framer
  Motion's `useScroll`/`useTransform` translate the job panels horizontally as you scroll down.
  Falls back to a plain vertical list under reduced motion — the effect is a nice-to-have, not a
  requirement for reading the content.
- **Preloader** (`Preloader.tsx`) and **custom cursor** (`CustomCursor.tsx`) round out the
  cinematic feel; both are purely decorative, never block content, and the cursor disables itself
  on touch devices and under reduced motion.

Retheme by editing the CSS variables in `src/index.css` (`:root`).

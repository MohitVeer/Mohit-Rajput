export const profile = {
  name: 'Mohit Rajput',
  role: 'Salesforce UI Developer',
  email: 'rajput.mohit.veer@gmail.com',
  phone: '+91-9997444338',
  phoneHref: 'tel:+919997444338',
  linkedinHandle: 'mohit-veer',
  linkedinUrl: 'https://www.linkedin.com/in/mohit-veer',
  trailblazerUrl: 'https://www.salesforce.com/trailblazer/mrajputsl',
  // Drop your actual PDF at public/resume.pdf — anything in public/ is
  // served from the site root, so this path will resolve correctly once
  // the file exists. Update the filename here if yours is named differently.
  resumeUrl: '/resume.pdf',
}

export const sceneList = [
  { href: '#top', index: '00', label: 'Home' },
  { href: '#metrics', index: '01', label: 'Impact' },
  { href: '#about', index: '02', label: 'About' },
  { href: '#trailblazer', index: '03', label: 'Trailblazer' },
  { href: '#skills', index: '04', label: 'Skills' },
  { href: '#experience', index: '05', label: 'Experience' },
  { href: '#certs', index: '06', label: 'Certifications' },
  { href: '#articles', index: '07', label: 'Articles' },
  { href: '#game', index: '08', label: 'Break' },
  { href: '#contact', index: '09', label: 'Contact' },
]

export const heroTags = [
  'Front-End',
  'Multi-cloud',
  'LWC + OmniStudio',
  'Marketing Cloud',
  'Certified UX Designer',
  'Agentforce Champion',
  'WCAG 2.1 AA',
]

export const trailhead = {
  rank: 'Triple Star Ranger',
  rankImage:
    'https://res.cloudinary.com/trailhead/image/upload/public-trailhead/assets/images/ranks/triple-star-ranger.png',
 agentblazerImage: 'https://trailhead.salesforce.com/assets/agentblazer/agentblazer-level-2-7dcee062f7cbc07086875c87de6163855f43972a4391d85336dd013338a7712e.png ',
  agentblazerChampionImage:
    'https://trailhead.salesforce.com/assets/agentblazer/agentblazer-level-1-a564a869686f7b888fabd8c82dafaf25928fa006be2388ab57e6f232876c2bf0.png',
  badges: 320,
  points: '150,100',
  trails: 52,
  status: 'Agentblazer Innovator 2026',
  // agentforceLevel: 'Champion',
  // agentforceNote:
  //   'Innovator level completing today — putting me among a small cohort of production-ready Agentforce builders worldwide.',
}

export const stats = [
  { value: '8', label: 'Salesforce Certifications' },
  { value: '5', label: 'Salesforce Superbadges' },
  { value: '320', label: 'Trailhead Badges' },
  { value: '150,100', label: 'Trailhead Points' },
  { value: '~50%', label: 'Faster LWC portal load time' },
  { value: '~35%', label: 'Shorter delivery cycles' },
  { value: '4.5+/5', label: 'Client CSAT sustained' },
]

export const aboutFacts = [
  '5+ yrs Salesforce UI · 8 certs',
  'WCAG 2.1 AA by default',
  'CI/CD with Gearset & SFDX',
  'Circle of Excellence · Wipro & Mphasis',
  'Measure of Excellence & You Rock · Mphasis',
]

export const skillGroups = [
  {
    title: 'Salesforce',
    skills: [
      'LWC',
      'Apex',
      'SOQL',
      'OmniStudio / Vlocity',
      'FlexCards',
      'OmniScripts',
      'DataRaptors',
      'Experience Cloud',
      'SLDS',
      'Aura',
      'Visualforce',
      'Agentforce',
      'Prompt Builder',
      'Flows'
    ],
  },
  {
    title: 'Frontend',
    skills: [
      'HTML5',
      'CSS3 / SCSS', 
      'JavaScript (ES6+)', 
      'Bootstrap', 
      'jQuery', 
      'Ajax', 
      'React JS',
      'Responsive Design', 
      'WCAG 2.1 AA',
      'Cross-Browser Testing',
      'Performance Optimization',
    ]
  },
  {
    title: 'UI / UX & Design-to-Code',
    skills: [
      'Figma',
      'Adobe XD',
      'Design-to-Code',
      'Pixel-Perfect UI',
      'Design Systems',
      'SLDS',
      'Responsive UI',
      'Accessibility',
      'Component Design'
    ],
  },
  {
    title: 'Marketing Cloud',
    skills: [
      'Email Studio',
      'AMPscript',
      'Journey Builder',
      'Cloud Pages',
      'Data Extensions',
      'Personalization'
    ],
  },
  {
    title: 'DevOps & Tools',
    skills: ['Git', 'GitHub', 'Gearset', 'SFDX CLI', 'VS Code', 'JIRA', 'Postman', 'NPM', 'Node.js', 'Litmus'],
  },
  {
    title: 'Delivery & Collaboration',
    skills: [
      'Agile (Scrum)',
      'Waterfall',
      'Sprint Planning',
      'Backlog Refinement',
      'Sprint Reviews',
      'Retrospectives',
      'Requirement Gathering',
      'Stakeholder Collaboration',
      'Cross-functional Teams'
    ],
  }
]

export const articles = [
  {
    title: '3.2 Seconds',
    summary: "That was our Experience Cloud portal load time when I stepped in — here's how we brought it down.",
    url: 'https://www.linkedin.com/pulse/32-seconds-mohit-rajput-d7prc',
    publishedOn: 'LinkedIn' as const,
    readTime: '4 min read',
  },
  {
    title: 'Welcome to SLDS 2: A New Era of Customization in Salesforce',
    summary: 'Salesforce has launched SLDS 2 (Beta), bringing enhanced flexibility to Lightning Design System.',
    url: 'https://www.linkedin.com/pulse/welcome-slds-2-new-era-customization-salesforce-ui-mohit-rajput-g463c',
    publishedOn: 'LinkedIn' as const,
    readTime: '2 min read',
  },
  {
    title: 'Understanding Email Client Rendering: Why It Matters for Marketing Cloud',
    summary: "In today's digital world, email marketing is essential — and rendering consistency across clients makes or breaks it.",
    url: 'https://www.linkedin.com/pulse/understanding-email-client-rendering-why-matters-your-mohit-rajput-q3t3c',
    publishedOn: 'LinkedIn' as const,
    readTime: '4 min read',
  },
  {
    title: 'Personalizing Financial Websites with MCP',
    summary: 'Personalization is a crucial aspect of engaging customers and building trust on financial services websites.',
    url: 'https://www.linkedin.com/pulse/personalizing-financial-websites-mcp-mohit-rajput-saozc',
    publishedOn: 'LinkedIn' as const,
    readTime: '2 min read',
  },
  {
    title: 'Elevating E-commerce with Salesforce Marketing Cloud Personalization',
    summary: "In today's hyper-connected world, personalization has become the key differentiator for e-commerce brands.",
    url: 'https://www.linkedin.com/pulse/elevating-e-commerce-salesforce-marketing-cloud-mohit-rajput-uchac',
    publishedOn: 'LinkedIn' as const,
    readTime: '5 min read',
  },
]

export const experience = [
  {
    role: 'Salesforce Consultant',
    company: 'Wipro',
    period: 'Sep 2024 — Present',
    location: 'Greater Noida, India',
    bullets: [
      'Translated high-fidelity Figma and Adobe XD prototypes into pixel-perfect, production-ready Lightning Web Components across 2 enterprise portals — the exact workflow this role requires.',
      'Applied SLDS design tokens and component patterns throughout to ensure a consistent, accessible, high-quality user experience.',
      'Reduced LWC portal load time from ~3.2s to 1.5s (~50%) via cached Apex, reactive-property tuning and fewer DOM re-renders.',
      'Accelerated delivery cycles from 10 → 6–7 days (~35%) with a reusable SLDS component library.',
      'Enforced WCAG 2.1 AA across LWC UI — keyboard nav, semantic HTML, screen-reader parity.',
      'Resolved 300+ production defects within SLA, sustaining 4.5+/5 CSAT.',
      'Awarded Circle of Excellence for independently resolving high-impact production defects.',
    ],
    clients: ['American Honda', "St. James's Place"],
  },
  {
    role: 'Developer',
    company: 'Mphasis Silverline',
    period: 'Aug 2022 — Sep 2024',
    location: 'Bengaluru, India',
    bullets: [
      'Shipped LWC, FlexCards and OmniScripts across Financial Services & Health Cloud.',
      'Built accelerator (Foundry) cutting implementation timelines ~35% and enabling pre-sales demos.',
      'Developed responsive AMPscript emails validated across Outlook / Gmail / Apple Mail with Litmus.',
      'Received Measure of Excellence, Circle of Excellence and You Rock awards.',
    ],
    clients: [
      'Republic Finance',
      'Arvest Bank',
      'Wealth Enhancement Group',
      'Teledoc',
      'Five Star Bank',
      'Beatport',
    ],
  },
  {
    role: 'UI Developer',
    company: 'DJT Corporation & Investments',
    period: 'Nov 2021 — May 2022',
    location: 'Noida, India',
    bullets: [
      'Designed and developed responsive web applications and e-commerce experiences using HTML, CSS, JavaScript, Bootstrap 4, and Shopify.',
      'Built pixel-perfect user interfaces by converting Figma and PSD designs into responsive, production-ready applications.',
      'Designed and developed the Smart Cart web application, enabling customers to scan products in-store and complete seamless digital payments.',
      'Collaborated with clients and stakeholders to gather requirements and deliver tailored digital solutions.',
      'Implemented SEO best practices and performance optimizations to improve page speed and user experience.',
      'Contributed to the development of brands including House of Believe, Deerika, Mall Fifty One, Pharma Aviorion, and Smart Cart.',
      'Built and enhanced the House of Believe e-commerce platform, helping generate over ₹5 lakh in monthly revenue.'
    ],
    clients: [
      'Deerika',
      'House of Believe',
      'DJT Corporation & Investments',
      'Mall Fifty One',
      'Pharma Aviorion',
      'Smart Cart',
    ],
  },
  {
    role: 'Front-End Developer',
    company: 'Escade Technologies',
    period: 'Jan 2021 — Oct 2021',
    location: 'Aligarh, India',
    bullets: [
      'Built responsive mobile-first interfaces in HTML5, CSS3 and JavaScript.',
      'Ran usability testing to harden UX flows.',
    ],
    clients: [],
  },
]

export const certGroups = [
  {
    title: 'Agentforce',
    logo: 'https://thc-public-files-nonproduction.s3.amazonaws.com/th-profile/prd-brands/agentforce-logo.png',
    certs: {
        name: 'Salesforce Certified AI Associate',
        image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000YMdGt&oid=00DF0000000gZsu&lastMod=1770009252000',
        alt: 'Salesforce Certified AI Associate',
      },
  },
  {
    title: 'Industry Solutions',
    logo: 'https://thc-public-files-nonproduction.s3.amazonaws.com/th-profile/prd-brands/industry-solutions-logo.png',
    certs: [{
      name: 'Salesforce Certified OmniStudio Consultant',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MABgg&oid=00DF0000000gZsu&lastMod=1746780478000',
      alt: 'Salesforce Certified OmniStudio Consultant',
    },
    {
      name: 'Salesforce Certified OmniStudio Developer',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MAGgL&oid=00DF0000000gZsu&lastMod=17467805850000',
      alt: 'Salesforce Certified OmniStudio Developer',
    }],
  },
  {
    title: 'Marketing Cloud',
    logo: 'https://thc-public-files-nonproduction.s3.amazonaws.com/th-profile/prd-brands/marketing-cloud-logo.png',
    certs: [{
      name: 'Salesforce Certified Marketing Cloud Email Specialist',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MAIgf&oid=00DF0000000gZsu&lastMod=1746787093000',
      alt: 'Salesforce Certified Marketing Cloud Email Specialist',
    },
    {
      name: 'Salesforce Certified Marketing Cloud Engagement Developer',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MA6nT&oid=00DF0000000gZsu&lastMod=1746778963000',
      alt: 'Salesforce Certified Marketing Cloud Engagement Developer',
    },
    {
      name: 'Marketing Cloud Personalization Accredited Professional',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MACck&oid=00DF0000000gZsu&lastMod=1746779293000',
      alt: 'Marketing Cloud Personalization Accredited Professional',
    }],

  },
  {
    title: 'Salesforce Platform',
    logo: 'https://thc-public-files-nonproduction.s3.amazonaws.com/th-profile/prd-brands/salesforce-platform-logo.png',
    certs: [{
      name: 'Salesforce Certified Platform Foundations',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MA6fO&oid=00DF0000000gZsu&lastMod=1746782543000',
      alt: 'Salesforce Certified Platform Foundations',
    },
    {
      name: 'Salesforce Certified Platform User Experience Designer',
      image: 'https://drm.my.salesforce.com/servlet/servlet.ImageServer?id=015Rf00000MA970&oid=00DF0000000gZsu&lastMod=1746781558000',
      alt: 'Salesforce Certified Platform User Experience Designer',
    }],
  },
]

export const superbadges = [
  {
    title: 'Superbadge: Agentforce Service',
    description: 'Customize an Agentforce Service Agent for customer inquiries and bookings.',
    image:
      'https://res.cloudinary.com/hy4kyit2a/f_auto/fl_lossy/q_70/learn/superbadges/superbadge-agentforce-service-sbu/8b15afebd3bc004b830549d6becc8e46_badge.png',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Prompt Builder Templates',
    description: 'Build Prompt Builder templates for AI-powered engagement.',
    image:
      'https://res.cloudinary.com/hy4kyit2a/f_auto/fl_lossy/q_70/learn/superbadges/superbadge_prompt_builder_templates_sbu/32581be298e7d845c165a8831e821afc_badge.png',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Record-Triggered Flow',
    description: 'Automate processes for efficient, insightful record management.',
    image:
      'https://res.cloudinary.com/hy4kyit2a/f_auto/fl_lossy/q_70/learn/superbadges/superbadge_record_triggered_flows_sbu/3a82d839acd6d2ddc08ac9420bc3d340_badge.png',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: User Experience Superbadge Unit',
    description: 'Design intuitive Salesforce user experiences with Lightning tools.',
    image:
      'https://res.cloudinary.com/hy4kyit2a/f_auto/fl_lossy/q_70/learn/superbadges/superbadge-user-experience-sbu/923740afc25850c35ffbd44a85079d53_badge.png',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Lightning Web Components Specialist',
    description: 'Build scalable Lightning Web Components for modern Salesforce apps.',
    image:
      'https://res.cloudinary.com/hy4kyit2a/f_auto/fl_lossy/q_70/learn/superbadges/superbadge_lwc_specialist/0b422a78e019b08aa699dc76b48cc7e8_badge.png',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
]

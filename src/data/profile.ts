export const profile = {
  name: 'Mohit Rajput',
  role: 'Salesforce Front-End Developer',
  email: 'rajput.mohit.veer@gmail.com',
  phone: '+91-9997444338',
  phoneHref: 'tel:+919997444338',
  linkedinHandle: 'mohit-veer',
  linkedinUrl: 'https://www.linkedin.com/in/mohit-veer',
  trailblazerUrl: 'https://www.salesforce.com/trailblazer/mrajputsl',
  githubHandle: 'mohit-veer',
  githubUrl: 'https://github.com/MohitVeer',
  resumeUrl: '/Mohit_Rajput_Frontend_Engineer.pdf',
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
  'Front-End Engineering',
  'React.js',
  'LWC + Experience Cloud',
  'OmniStudio',
  'Marketing Cloud',
  'WCAG 2.1/2.2 AA',
  'Multi-cloud',
  'Certified UX Designer',
  'Agentforce Champion',
]

export const trailhead = {
  rank: 'Triple Star Ranger',
  rankImage:
    '/Salesforce Product Icons/triple-star-ranger.png',
 agentblazerImage: '/Agentblazer/agentblazer-Innovator.png',
  agentblazerChampionImage:
    '/Agentblazer/agentblazer-champion.png',
  badges: 329,
  points: '154,250',
  trails: 52,
  status: 'Agentblazer Innovator 2026',
  // agentforceLevel: 'Legend',
  // agentforceNote:
  //   'On the journey of becoming a Salesforce Agentblazer Legend.',
}

export const stats = [
  { value: '9', label: 'Salesforce Certifications' },
  { value: '5', label: 'Salesforce Superbadges' },
  { value: '329', label: 'Trailhead Badges' },
  { value: '154,250', label: 'Trailhead Points' },
  { value: '~50%', label: 'Faster LWC portal load time' },
  { value: '~35%', label: 'Shorter delivery cycles' },
  { value: '4.5+/5', label: 'Client CSAT sustained' },
]

export const aboutFacts = [
  '5+ yrs Front-End & Salesforce Engineering',
  'Accessibility & Responsive Design',
  'LWC · React.js · Experience Cloud',
  '9x Salesforce Certified · Triple Star Ranger',
  'Agentforce · OmniStudio · Marketing Cloud',
  'Apex · SOQL · Modern Front-End Engineering',
  'WCAG 2.1/2.2 AA by default',
  'CI/CD with Gearset & SFDX'
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
      'React.js', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Node.js', 'HTML5', 'CSS3 / SCSS', 'Advanced CSS', 'Responsive Design', 'Complex Layouts', 'Animations', 'DOM Optimization', 'REST API Integration', 'Cross-Browser Compatibility'
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
    achievements: [
      'Circle of Excellence Award — resolving high-impact production defects and improving platform stability.'
    ],
    clients: ['American Honda', "St. James's Place"],
  },
  {
    role: 'Developer',
    company: 'Mphasis Silverline',
    period: 'Aug 2022 — Sep 2024',
    location: 'Bengaluru, India',
    bullets: [
      'Delivered Apex, LWC, FlexCard, and OmniScript solutions across 5+ Financial Services and Health Cloud implementations for 8+ enterprise clients (Republic Finance, Arvest Bank, Wealth Enhancement Group, Peoples Bank, Teledoc, Five Star Bank, Beatport), improving user journey completion rates 20%.',
      'Contributed to Foundry, a reusable component/OmniStudio accelerator, reducing implementation timelines 35% across 3 engagements and enabling pre-sales demos.',
      'Designed reusable LWC/OmniStudio frameworks for 4 client-facing Experience Cloud portals using SLDS patterns, reducing per-portal development time approximately 30%.',
      'Developed responsive AMPscript emails validated across Outlook, Gmail, and Apple Mail using Litmus, ensuring consistent rendering for Marketing Cloud campaigns.',
      'Collaborated with solution architects and domain consultants to translate design intent into precise, accessible component implementations aligned with Financial Services and Health Cloud data models.',
      'Maintained consistent SLDS styling and responsive design standards across 6+ concurrent client projects, ensuring cross-cloud UI consistency.',
      'Received Measure of Excellence, Circle of Excellence and You Rock awards.',
    ],
    achievements: [
      'Measure of Excellence', 'Circle of Excellence', 'You Rock Awards'
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
      'Developed production web applications and full-page user experiences using React.js and Vue.js, building reusable frontend components with JavaScript, HTML5, CSS3, and Bootstrap 4.',
      'Translated design concepts and UI requirements into responsive, interactive frontend interfaces, focusing on component reusability, cross-browser compatibility, usability, and consistent visual implementation.',
      'Built frontend features for multiple client-facing web and e-commerce projects, working across different business requirements and adapting reusable UI patterns to individual product experiences.',
      'Developed the Smart Cart web application using React.js, implementing frontend functionality supporting in-store product scanning and digital checkout workflows.',
      'Worked on the House of Believe e-commerce storefront using Shopify, implementing and customizing the frontend experience to match brand requirements and responsive design expectations.',
      'Integrated frontend applications with backend/API services where required, consuming application data and connecting UI components with business workflows.',
      'Debugged frontend issues, performed usability testing, and resolved UI defects across browsers and devices to improve stability and overall user experience.',
      'Collaborated with designers and other developers throughout the development lifecycle, translating requirements and visual designs into production-ready web interfaces.',
    ],
    achievements: [
      'Formal appreciation from MD and stakeholders for delivery on the House of Believe and DJT brand websites.'
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
      'Developed production frontend features and complete responsive pages using React.js, JavaScript, HTML5, and CSS3, translating design mockups into functional and reusable user interfaces.',
      'Built reusable React components and interactive UI elements while maintaining consistent layouts, responsive behavior, and cross-browser compatibility across multiple client projects.',
      'Worked closely with design and development teams to translate visual requirements into production-ready frontend implementations while maintaining usability and visual consistency.',
      'Implemented frontend interactions and application workflows using JavaScript and React.js, integrating UI components with application data and backend/API services where required.',
      'Performed usability testing and frontend debugging to identify layout, interaction, and functional issues across development cycles.',
      'Resolved UI defects and refined frontend implementations based on testing and stakeholder feedback, contributing to an approximately 30% reduction in reported UI issues.',

    ],
    clients: [],
  },
]

export const certGroups = [
  {
    title: 'Agentforce',
    logo: '/Salesforce Product Icons/agentforce-logo.png',
    certs: {
        name: 'Salesforce Certified AI Associate',
        image: '/Salesforce Icons/sf-cert-AI-Associate-rtd/High Res/2026-01_Badge_SF-Certified_AI-Associate_High-Res_RETIRED.png',
        alt: 'Salesforce Certified AI Associate',
      fileUrl: '/Certifications/AI_Associate.pdf',
      },
  },
  {
    title: 'Industry Solutions',
    logo: '/Salesforce Product Icons/industry-solutions-logo.png',
    certs: [{
      name: 'Salesforce Certified OmniStudio Consultant',
      image: '/Salesforce Icons/sf-cert-OmniStudio-Consultant/High Res/2025-04_Badge_SF-Certified_Omnistudio-Con_High-Res.png',
      alt: 'Salesforce Certified OmniStudio Consultant',
      fileUrl: '/Certifications/Omnistudio_Consultant.pdf',
    },
    {
      name: 'Salesforce Certified OmniStudio Developer',
      image: '/Salesforce Icons/sf-cert-OmniStudio-Developer/High Res/2025-04_Badge_SF-Certified_Omnistudio-Dev_High-Res.png',
      alt: 'Salesforce Certified OmniStudio Developer',
      fileUrl: '/Certifications/Omnistudio_Developer.pdf',
    }],
  },
  {
    title: 'Marketing Cloud',
    logo: '/Salesforce Product Icons/marketing-cloud-logo.png',
    certs: [{
      name: 'Salesforce Certified Marketing Cloud Email Specialist',
      image: '/Salesforce Icons/sf-cert-Marketing-Cloud-Email-Specialist/High Res/2021-03_Badge_SF-Certified_Marketing-Cloud-Email-Specialist_High-Res.png',
      alt: 'Salesforce Certified Marketing Cloud Email Specialist',
      fileUrl: '/Certifications/Marketing_Cloud_Email_Specialist.pdf',
    },
    {
      name: 'Salesforce Certified Marketing Cloud Engagement Developer',
      image: '/Salesforce Icons/sf-cert-Marketing-Cloud-Engagement-Developer/High Res/2025-04_Badge_SF-Certified_MC-Eng-Dev_High-Res.png',
      alt: 'Salesforce Certified Marketing Cloud Engagement Developer',
      fileUrl: '/Certifications/Marketing_Cloud_Engagement_Developer.pdf',
    },
    {
      name: 'Marketing Cloud Personalization Accredited Professional',
      image: '/Salesforce Icons/plc-marketing-cloud-personalization/High Res/2021-04_PLC-AP-Badge_MC-Personalization_High-Res.png',
      alt: 'Marketing Cloud Personalization Accredited Professional',
      fileUrl: '/Certifications/Marketing_Cloud_Personalization.pdf',
    }],

  },
  {
    title: 'Salesforce Platform',
    logo: '/Salesforce Product Icons/salesforce-platform-logo.png',
    certs: [
      {
      name: 'Salesforce Certified Platform Foundations',
      image: '/Salesforce Icons/sf-cert-associate-platform-foundations/High Res/2025-03_Badge_SF-Certified_Platform-Foundations_High-Res.png',
      alt: 'Salesforce Certified Platform Foundations',
      fileUrl: '/Certifications/Platform_Foundations.pdf',
    },
    {
      name: 'Salesforce Certified Platform Developer I',
      image: '/Salesforce Icons/sf-cert-platform-developer-I/High Res/2025-04_Badge_SF-Certified_Plat-Dev_High-Res.png',
      alt: 'Salesforce Certified Platform Developer I',
      fileUrl: '/Certifications/Platform_Developer.pdf',
    },
    {
      name: 'Salesforce Certified Platform User Experience Designer',
      image: '/Salesforce Icons/sf-cert-platform-ux-designer/High Res/2025-03_Badge_SF-Certified_Plat-UX-Dsgn_High-Res.png',
      alt: 'Salesforce Certified Platform User Experience Designer',
      fileUrl: '/Certifications/Platform_User_Experience_Designer.pdf',
    }],
  },
]

export const superbadges = [
  {
    title: 'Superbadge: Agentforce Service',
    description: 'Customize an Agentforce Service Agent for customer inquiries and bookings.',
    image: '/Superbadges/Agentforce Service.webp',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Prompt Builder Templates',
    description: 'Build Prompt Builder templates for AI-powered engagement.',
    image:
      '/Superbadges/Prompt Builder Templates.webp',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Record-Triggered Flow',
    description: 'Automate processes for efficient, insightful record management.',
    image:
      '/Superbadges/Record-Triggered Flow.webp',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: User Experience Superbadge Unit',
    description: 'Design intuitive Salesforce user experiences with Lightning tools.',
    image:
      '/Superbadges/User Experience Superbadge.webp',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
  {
    title: 'Superbadge: Lightning Web Components Specialist',
    description: 'Build scalable Lightning Web Components for modern Salesforce apps.',
    image:
      '/Superbadges/Lightning Web Components Specialist.webp',
    url: 'https://www.salesforce.com/trailblazer/mrajputsl',
  },
]

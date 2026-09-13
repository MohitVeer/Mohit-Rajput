// A small, hand-drawn set of technology/brand glyphs in their real brand
// colors — deliberately not a full icon-library dependency (simple-icons
// et al. ship 3000+ icons; pulling one in for ~20 marks would bloat the
// public bundle for no reason). Colors are the actual brand hex values
// where a brand has one; Next.js/GitHub are intentionally kept
// monochrome since that IS their brand (no color in their real marks).
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = (props: IconProps) => ({
  viewBox: '0 0 24 24',
  width: 15,
  height: 15,
  'aria-hidden': true as const,
  ...props,
})

export function Html5Icon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#E34F26" d="M3.5 2h17l-1.55 17.4L12 21.8l-6.95-2.4L3.5 2Z" />
      <path fill="#EF652A" d="M12 20.1 17.1 18.6 18.35 4.6H12v15.5Z" />
      <path
        fill="#fff"
        d="M12 11.1H9.05L8.85 8.9H12V6.8H6.5l.55 6.1H12v-1.8Zm0 5.75-2.5-.7-.15-1.85H7.2l.3 3.4L12 18.8v-1.95Z"
      />
      <path
        fill="#EBEBEB"
        d="M11.98 11.1v1.8h2.7l-.25 2.85-2.45.7v1.95l4.15-1.15.03-.35.48-5.35.05-.5h-4.71Zm0-4.3v2.1h5.3l.05-.5.1-1.6h-5.45Z"
      />
    </svg>
  )
}

export function Css3Icon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#1572B6" d="M3.5 2h17l-1.55 17.4L12 21.8l-6.95-2.4L3.5 2Z" />
      <path fill="#33A9DC" d="M12 20.1 17.1 18.6 18.35 4.6H12v15.5Z" />
      <path
        fill="#fff"
        d="M12 11.05h3l.2-2.25H12V6.7h5.6l-.05.6-.55 6.1H12v-2.35Zm0 5.8-2.5-.7-.15-1.75H7.2l.3 3.35L12 18.8v-1.95Z"
      />
      <path
        fill="#EBEBEB"
        d="M11.98 13.4v2.35l2.45-.65.25-2.85h-2.7v1.15Zm.02-6.7v2.1h-5.4l-.17-2.1h5.57Zm-.02 9.2v1.95l4.15-1.15.03-.35.35-3.9h-2.05l-.15 1.7-2.33.65v1.1Z"
      />
    </svg>
  )
}

export function JavaScriptIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="4" fill="#F7DF1E" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="10.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#111">
        JS
      </text>
    </svg>
  )
}

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="10.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        TS
      </text>
    </svg>
  )
}

export function ReactIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none">
      <g stroke="#61DAFB" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="9.5" ry="4" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="1.9" fill="#61DAFB" />
    </svg>
  )
}

export function VueIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#4FC08D" d="M1.5 3.5h4l6.5 11 6.5-11h4L12 20.5 1.5 3.5Z" />
      <path fill="#35495E" d="M6.4 3.5h3.4L12 7.3l2.2-3.8h3.4L12 13.5 6.4 3.5Z" />
    </svg>
  )
}

export function NextJsIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none">
      <circle cx="12" cy="12" r="9.5" fill="#000" stroke="#fff" strokeWidth="0.6" />
      <path d="M9 8.5v7L16 8.5v7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function NodeJsIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fill="#539E43"
        d="M12 2 3 6.8v10.4L12 22l9-4.8V6.8L12 2Z"
      />
      <path
        fill="#fff"
        d="M10.1 7.8v8.4h1.7v-3.3l3.4 3.3h2.3l-4.1-4 3.9-4.4h-2.1l-3.4 3.9V7.8h-1.7Z"
      />
    </svg>
  )
}

export function GitIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none" stroke="#F05033" strokeWidth="1.5">
      <circle cx="6" cy="6" r="2" fill="#F05033" stroke="none" />
      <circle cx="6" cy="18" r="2" fill="#F05033" stroke="none" />
      <circle cx="17" cy="12" r="2" fill="#F05033" stroke="none" />
      <path d="M6 8v8M6 8c0 3 2.5 4 6 4h3" strokeLinecap="round" />
    </svg>
  )
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fill="#fff"
        d="M12 2C6.48 2 2 6.58 2 12.19c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49v-1.92c-2.78.62-3.37-1.36-3.37-1.36-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.2 2.47.1 2.73.65.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.19C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  )
}

export function FigmaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#F24E1E" d="M9 2h4a3 3 0 0 1 0 6H9V2Z" />
      <path fill="#A259FF" d="M9 8h4a3 3 0 0 1 0 6H9V8Z" />
      <path fill="#1ABCFE" d="M13 8h-.5a3 3 0 1 0 0 6h.5a3 3 0 0 0 0-6Z" transform="translate(0 0)" />
      <path fill="#0ACF83" d="M5 17a3 3 0 0 1 3-3h1v3a3 3 0 1 1-4 0Z" />
      <path fill="#FF7262" d="M5 8a3 3 0 0 1 3-3h1v6H8a3 3 0 0 1-3-3Z" />
    </svg>
  )
}

export function AdobeXdIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="4" fill="#FF61F6" />
      <path
        fill="#1A0033"
        d="M6.5 8h2.4l3 4.1 3-4.1h2.4l-4.2 5.6L17.5 20h-2.5l-3.1-4.4L8.8 20H6.4l4.3-6.4L6.5 8Z"
      />
    </svg>
  )
}

export function VsCodeIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="none">
      <path
        d="m16 3 5 2.3v13.4L16 21 8 14.5 4.5 17 2 15.2l4-4.2-4-4.2L4.5 5 8 7.5 16 3Z"
        fill="#0065A9"
        stroke="#0065A9"
        strokeWidth="0.3"
        strokeLinejoin="round"
      />
      <path d="M16 3v18L8 14.5V9.5L16 3Z" fill="#007ACC" />
    </svg>
  )
}

export function JiraIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#2684FF" d="M12 2 3.5 10.3a1.6 1.6 0 0 0 0 2.3L12 21l8.5-8.4a1.6 1.6 0 0 0 0-2.3L12 2Z" />
      <path fill="#fff" d="M12 7.2 6.7 12.4 12 17.6l5.3-5.2L12 7.2Z" opacity=".92" />
      <path fill="#2684FF" d="M12 7.2 6.7 12.4 12 17.6V7.2Z" opacity=".18" />
    </svg>
  )
}

export function PostmanIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9.5" fill="#FF6C37" />
      <path
        d="M12 6.5v2M12 15.5v2M6.5 12h2M15.5 12h2m-8.5 3 6-6"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function NpmIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="3" fill="#CB3837" />
      <path fill="#fff" d="M4 7h16v10h-6v-7.5H12V17H8V9.5H4V7Z" />
    </svg>
  )
}

export function SalesforceCloudIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fill="#00A1E0"
        d="M10.4 5.2a3.6 3.6 0 0 1 3.1 1.8 2.7 2.7 0 0 1 4.2 2.2c0 .2 0 .4-.05.6A3.1 3.1 0 0 1 20 12.7a3.15 3.15 0 0 1-3.15 3.1H6.4a3.9 3.9 0 0 1-1-7.65 3.9 3.9 0 0 1 5-2.95Z"
      />
    </svg>
  )
}

export function TrailheadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#00A1E0" d="M12 2 4 21h4.2l1.3-3.2h4.9l1.3 3.2H20L12 2Zm0 5.6 1.9 4.7h-3.8L12 7.6Z" />
    </svg>
  )
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.48 5.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM5.98 10.5h3v8h-3v-8Zm5.02 0h2.88v1.09h.04c.4-.76 1.38-1.56 2.84-1.56 3.03 0 3.6 2 3.6 4.6v4.87h-3v-4.32c0-1.03-.02-2.36-1.43-2.36-1.43 0-1.65 1.12-1.65 2.28v4.4h-3v-8Z"
      />
    </svg>
  )
}

export function SfdxCliIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect width="24" height="24" rx="5" fill="#00A1E0" />
      <text x="12" y="16.3" textAnchor="middle" fontSize="9.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">
        {'>_'}
      </text>
    </svg>
  )
}

// Real Salesforce product marks (already shipped as static assets for the
// Certifications section) — reused here as <img>, not redrawn, since an
// official logo beats a hand-approximated one.
export function AgentforceIcon(props: IconProps) {
  return (
    <img
      src="/Salesforce%20Product%20Icons/agentforce-logo.png"
      alt=""
      width={15}
      height={15}
      className={`inline-block h-[15px] w-[15px] shrink-0 rounded-sm object-contain ${props.className ?? ''}`}
    />
  )
}

export function ScssIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path fill="#CD6799" d="M3.5 2h17l-1.55 17.4L12 21.8l-6.95-2.4L3.5 2Z" />
      <path fill="#fff" d="M15.2 8.4c-1.7-.7-3.6-.3-3.6.9 0 1.4 3.2 1.2 3.2 3.5 0 2.1-2.9 2.9-5.4 1.9l.3-1.6c1.6.7 3.5.5 3.5-.7 0-1.3-3.1-1.2-3.1-3.4 0-2 2.6-3 5-2.1l.1 1.5Z" />
    </svg>
  )
}

// Lookup by the exact skill label used in src/data/profile.ts — anything
// not in here just renders as plain text, no icon. Kept intentionally
// curated to widely-recognized marks; skill names with no standard
// logo (SOQL, DataRaptors, Agile ceremonies, ...) are left as text.
export const skillIcons: Record<string, (props: IconProps) => JSX.Element> = {
  'HTML5': Html5Icon,
  'CSS3 / SCSS': ScssIcon,
  'JavaScript (ES6+)': JavaScriptIcon,
  'TypeScript': TypeScriptIcon,
  'React.js': ReactIcon,
  'Vue.js': VueIcon,
  'Next.js': NextJsIcon,
  'Node.js': NodeJsIcon,
  'Git': GitIcon,
  'GitHub': GitHubIcon,
  'Figma': FigmaIcon,
  'Adobe XD': AdobeXdIcon,
  'VS Code': VsCodeIcon,
  'JIRA': JiraIcon,
  'Postman': PostmanIcon,
  'NPM': NpmIcon,
  'SFDX CLI': SfdxCliIcon,
  'Agentforce': AgentforceIcon,
}

// Group-level marks (shown next to the section heading, e.g. "SALESFORCE")
// for groups whose individual skills are Salesforce jargon with no
// standard logo of their own (SOQL, FlexCards, ...) — the real product
// mark on the group still gives that whole cluster a colorful, branded
// anchor instead of leaving it as plain text throughout.
export const groupIcons: Record<string, string> = {
  Salesforce: '/Salesforce%20Product%20Icons/salesforce-platform-logo.png',
  'Marketing Cloud': '/Salesforce%20Product%20Icons/marketing-cloud-logo.png',
}

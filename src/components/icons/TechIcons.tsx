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
        fill="currentColor"
        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
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
        d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8"
      />
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

export function AgentforceIcon(props: IconProps) {
  const size = typeof props.width === 'number' ? props.width : 15
  return (
    <img
      src="/Salesforce%20Product%20Icons/agentforce-logo.png"
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`inline-block shrink-0 rounded-sm object-contain ${props.className ?? ''}`}
    />
  )
}

export function LitmusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 12 L12 2 A10 10 0 0 1 21.51 8.91 Z" fill="#B4A83D" />
      <path d="M12 12 L21.51 8.91 A10 10 0 0 1 17.88 20.09 Z" fill="#C0703C" />
      <path d="M12 12 L17.88 20.09 A10 10 0 0 1 6.12 20.09 Z" fill="#B04A3F" />
      <path d="M12 12 L6.12 20.09 A10 10 0 0 1 2.49 8.91 Z" fill="#173A4D" />
      <path d="M12 12 L2.49 8.91 A10 10 0 0 1 12 2 Z" fill="#4C9A6A" />
    </svg>
  )
}

export function GearsetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <g fill="#F2A93B">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect key={angle} x="10.5" y="1.2" width="3" height="4.2" rx="1" transform={`rotate(${angle} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="7" />
      </g>
      <circle cx="12" cy="12" r="3.1" fill="#17284A" />
    </svg>
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

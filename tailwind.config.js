
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: 'hsl(var(--card) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
        secondary: 'hsl(var(--secondary) / <alpha-value>)',
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        'accent-2': 'hsl(var(--accent-2) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Inter Variable"', 'Inter', 'system-ui', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        glow: '0 0 40px hsl(var(--accent) / 0.25)',
        'glow-lg': '0 0 80px hsl(var(--accent) / 0.35)',
        'glow-2': '0 0 40px hsl(var(--accent-2) / 0.25)',
        card: '0 1px 0 0 rgba(255, 255, 255, 0.03) inset, 0 20px 40px -20px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -18px, 0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -4%, 0) scale(1.06)' },
        },
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'text-shiny': {
          from: { backgroundPosition: '200% center' },
          to: { backgroundPosition: '-200% center' },
        },
        'gradient-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'arc-spin': {
          from: { transform: 'translateZ(0) rotate(0deg)' },
          to: { transform: 'translateZ(0) rotate(360deg)' },
        },
        'marquee-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
        },
        'marquee-right': {
          from: { transform: 'translateX(calc(-100% - var(--gap, 1rem)))' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 16s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'text-shiny': 'text-shiny 4s linear infinite',
        'gradient-flow': 'gradient-flow 6s ease infinite',
        'arc-spin': 'arc-spin 60s linear infinite',
        'marquee-left': 'marquee-left var(--duration, 30s) linear infinite',
        'marquee-right': 'marquee-right var(--duration, 30s) linear infinite',
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CloakBid Design System
        cb: {
          base:     '#08090C',
          sub:      '#0D0F13',
          surface:  '#12151B',
          elevated: '#181C23',
          border:   'rgba(255,255,255,0.05)',
          accent:   '#635BFF',
          success:  '#2ECC8A',
          warning:  '#E7A93B',
          error:    '#E05252',
          t1:       '#F5F7FA',
          t2:       '#969DAA',
          t3:       '#646B78',
        },
        // Legacy aliases for backward compatibility
        midnight: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D30',
          700: '#1E293B',
          600: '#334155',
          500: '#64748B',
        },
      },
      fontFamily: {
        sans:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-md':   '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-lg':   '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
        'accent-sm': '0 0 16px rgba(99,91,255,0.2)',
        'accent':    '0 0 32px rgba(99,91,255,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        'flow-right': {
          '0%':   { transform: 'translateX(-4px)', opacity: '0' },
          '50%':  { opacity: '1' },
          '100%': { transform: 'translateX(4px)', opacity: '0' },
        },
        'draw-line': {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.5s ease-out forwards',
        'fade-in':    'fade-in 0.4s ease-out forwards',
        'shimmer':    'shimmer 3s linear infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'flow-right': 'flow-right 1.5s ease-in-out infinite',
        'spin-slow':  'spin-slow 20s linear infinite',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}

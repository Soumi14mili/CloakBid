/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D30',
          700: '#1E293B',
          600: '#334155',
          500: '#64748B',
        },
        vault: {
          purple: '#7C3AED',
          'purple-light': '#9353D3',
          'purple-dark': '#6D28D9',
          'purple-deep': '#4C1D95',
          indigo: '#4F46E5',
        },
        cipher: {
          teal: '#0891B2',
          'teal-light': '#06B6D4',
          'teal-dark': '#0E7490',
          electric: '#2563EB',
          green: '#10B981',
        },
        auction: {
          gold: '#D97706',
          'gold-light': '#F59E0B',
          'gold-dark': '#B45309',
          amber: '#F59E0B',
        },
        verified: {
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'emerald-dark': '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', 'monospace'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'vault-subtle': '0 10px 30px -10px rgba(139, 92, 246, 0.15)',
        'vault-glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'vault-glow-lg': '0 0 50px -10px rgba(139, 92, 246, 0.45)',
        'cipher-glow': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'card-depth': '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'vault-inset': 'inset 0 2px 8px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(139, 92, 246, 0.15)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'ring-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'ring-rotate-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'shimmer-slow': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'ring-rotate': 'ring-rotate 20s linear infinite',
        'ring-rotate-reverse': 'ring-rotate-reverse 26s linear infinite',
        'shimmer-slow': 'shimmer-slow 8s linear infinite',
      },
    },
  },
  plugins: [],
}

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
          950: '#05070D',
          900: '#090D18',
          850: '#0E1424',
          800: '#141B2D',
          700: '#1E283F',
          600: '#2D3A56',
          500: '#475569',
        },
        vault: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-dark': '#7C3AED',
          'purple-deep': '#4C1D95',
          indigo: '#6366F1',
        },
        cipher: {
          teal: '#06B6D4',
          'teal-light': '#22D3EE',
          'teal-dark': '#0891B2',
          electric: '#00F0FF',
          green: '#10B981',
        },
        auction: {
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          'gold-dark': '#D97706',
          amber: '#FF8C00',
        },
        verified: {
          emerald: '#10B981',
          'emerald-light': '#34D399',
          'emerald-dark': '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
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

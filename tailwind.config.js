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
          950: '#06080D',
          900: '#0B0F19',
          850: '#101726',
          800: '#161F33',
          700: '#1E2B47',
          600: '#2A3C63',
          500: '#3D558C',
        },
        auction: {
          gold: '#F59E0B',
          'gold-light': '#FCD34D',
          'gold-dark': '#D97706',
          amber: '#FF8C00',
        },
        vault: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-dark': '#7C3AED',
          indigo: '#6366F1',
        },
        cipher: {
          teal: '#06B6D4',
          'teal-light': '#22D3EE',
          'teal-dark': '#0891B2',
          green: '#10B981',
        },
        neon: {
          amber: '#FF6B00',
          rose: '#FF2D55',
          lime: '#39FF14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'auction-glow': '0 0 30px -5px rgba(245, 158, 11, 0.4), 0 0 15px -3px rgba(245, 158, 11, 0.2)',
        'auction-glow-lg': '0 0 60px -10px rgba(245, 158, 11, 0.5), 0 0 30px -5px rgba(245, 158, 11, 0.3)',
        'vault-glow': '0 0 30px -5px rgba(139, 92, 246, 0.4), 0 0 15px -3px rgba(139, 92, 246, 0.2)',
        'cipher-glow': '0 0 25px -5px rgba(6, 182, 212, 0.4), 0 0 10px -3px rgba(6, 182, 212, 0.2)',
        'winner-burst': '0 0 80px 20px rgba(245, 158, 11, 0.6), 0 0 40px 10px rgba(252, 211, 77, 0.4)',
        'card-depth': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255,255,255,0.05)',
        'bid-inner': 'inset 0 2px 8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(245,158,11,0.2)',
      },
      keyframes: {
        'bid-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(245, 158, 11, 0.3)' },
          '50%': { boxShadow: '0 0 40px -3px rgba(245, 158, 11, 0.7), 0 0 20px -2px rgba(252, 211, 77, 0.4)' },
        },
        'vault-seal': {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0px)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'cipher-stream': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'hologram': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'winner-burst': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        'typewriter': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
      animation: {
        'bid-pulse': 'bid-pulse 2s ease-in-out infinite',
        'vault-seal': 'vault-seal 2s ease-in-out',
        'float-up': 'float-up 1.5s ease-out forwards',
        'glow-breathe': 'glow-breathe 3s ease-in-out infinite',
        'cipher-stream': 'cipher-stream 3s linear infinite',
        'hologram': 'hologram 8s linear infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'winner-burst': 'winner-burst 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'orbit': 'orbit 6s linear infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'neon-flicker': 'neon-flicker 3s linear infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      backgroundImage: {
        'auction-grid': 'linear-gradient(rgba(245,158,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.05) 1px, transparent 1px)',
        'vault-grid': 'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
        'holographic': 'linear-gradient(45deg, transparent 25%, rgba(245,158,11,0.1) 50%, transparent 75%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}

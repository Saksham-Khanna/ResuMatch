/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        bg: '#0C0A09',
        card: '#1C1917',
        'card-hover': '#292524',
        border: 'rgba(255,255,255,0.08)',

        // Orange
        orange: {
          primary: '#F97316',
          accent: '#EA580C',
          hover: '#FB923C',
          soft: 'rgba(249,115,22,0.15)',
        },

        // Text
        heading: '#FAFAF9',
        body: '#E7E5E4',
        muted: '#A8A29E',

        // Status
        success: '#22C55E',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-orange': 'pulseOrange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOrange: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249,115,22,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(249,115,22,0)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 6px rgba(249,115,22,0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(249,115,22,0.8))' },
        },
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #F97316, #EA580C)',
        'orange-glow': 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, #1C1917, #0C0A09)',
      },
      boxShadow: {
        'orange': '0 0 24px rgba(249,115,22,0.3)',
        'orange-sm': '0 0 12px rgba(249,115,22,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}

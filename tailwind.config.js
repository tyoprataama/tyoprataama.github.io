/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      colors: {
        offwhite: '#f7f7f5',
        ink: {
          DEFAULT: '#111110',
          secondary: '#6b6b6b',
          muted: '#a8a8a8',
        },
        accent: {
          blue: '#057bf1',
          coral: '#0040ff',
          red: '#f65c4b',
          mint: '#00c48c',
          amber: '#f5a623',
        },
      },
      borderRadius: {
        card: '20px',
        sm2: '12px',
      },
      boxShadow: {
        soft: '0 8px 32px rgba(0,0,0,0.08)',
        card: '0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        navIn: {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(-20px)' },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
        blobFloat: {
          '0%': { transform: 'translate(0,0) scale(1)' },
          '100%': { transform: 'translate(30px,20px) scale(1.05)' },
        },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s both',
        navIn: 'navIn 0.7s cubic-bezier(0.16,1,0.3,1) both',
        blob: 'blobFloat 12s ease-in-out infinite alternate',
        spin: 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

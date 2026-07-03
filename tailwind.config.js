/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        lora: ['Fraunces', 'Georgia', 'serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: 'var(--bg)',
        panel: 'var(--bg-2)',
        surface: 'var(--surface)',
        line: 'var(--line)',
        line2: 'var(--line-2)',
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-2)',
          muted: 'var(--ink-3)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          soft: 'var(--accent-soft)',
        },
      },
      borderRadius: {
        card: '12px',
        sm2: '8px'
      },
      boxShadow: {
        card: '0 18px 40px rgba(0,0,0,0.10)',
        soft: '0 10px 30px rgba(0,0,0,0.06)',
      },
      keyframes: {
        fadeUp: {
          from: {
            opacity: '0',
            transform: 'translateY(18px)'
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s both'
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

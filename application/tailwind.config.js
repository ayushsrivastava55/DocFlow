/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#94a3b8',
            'h1, h2, h3, h4': {
              color: '#fff',
              fontWeight: '600',
            },
            'code': {
              color: '#86efac',
              backgroundColor: '#1a1a1a',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            'a': {
              color: '#4ade80',
              textDecoration: 'none',
              '&:hover': {
                color: '#86efac',
              },
            },
            'strong': {
              color: '#fff',
            },
            'blockquote': {
              color: '#94a3b8',
              borderLeftColor: '#4ade80',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

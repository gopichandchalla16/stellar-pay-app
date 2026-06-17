/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        stellar: {
          50:  '#eefcf6',
          100: '#d5f5e5',
          400: '#2ec98a',
          500: '#14b87e',
          600: '#0e9e6a',
          700: '#0d7d54',
          800: '#0d6344',
          900: '#0b4f37',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your exact AUD9ja brand colors
        obsidian: {
          DEFAULT: '#0a0b0d',
          card: '#121316',
          border: '#1f2128'
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706',
        }
      },
      // Smooth fade-in and slide-down animations for your filters
      animation: {
        slideDown: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        fadeIn: 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

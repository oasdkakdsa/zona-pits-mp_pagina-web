/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- ¡AÑADE ESTA LÍNEA!
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss/plugin')(function ({ addUtilities }) {
      const newUtilities = {
        '.backdrop-filter-none': { 'backdrop-filter': 'none' },
        '.backdrop-blur-sm': { 'backdrop-filter': 'blur(4px)' },
        '.backdrop-blur': { 'backdrop-filter': 'blur(8px)' },
        '.backdrop-blur-md': { 'backdrop-filter': 'blur(12px)' },
        '.backdrop-blur-lg': { 'backdrop-filter': 'blur(16px)' },
        '.backdrop-blur-xl': { 'backdrop-filter': 'blur(24px)' },
      }
      addUtilities(newUtilities, ['responsive'])
    })
  ],
}
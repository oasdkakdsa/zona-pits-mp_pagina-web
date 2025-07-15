/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ** Aquí se añade la configuración de keyframes y animation **
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-50%) translateX(50%)' }, // Posición original del botón
          '50%': { transform: 'translateY(-55%) translateX(50%)' }, // Ligero movimiento hacia arriba
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite ease-in-out', // Aplica la animación cada 3 segundos, suave
      },
    },
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
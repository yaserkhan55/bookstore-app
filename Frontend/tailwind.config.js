/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ enables manual dark mode toggle
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        sparkle: 'sparkle 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  
}

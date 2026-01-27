/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jamatex-blue': '#1e40af', // Un azul profesional para tu marca
      }
    },
  },
  plugins: [],
}
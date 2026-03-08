/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#FF6B2C",
        brandLight: "#ffe8df",
        bgPage: "#F6F7FB"
      },
    },
  },
  plugins: [],
}
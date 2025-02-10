/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./client/**/*.{vue,js,ts,jsx,tsx}",
    "./client/**/*.vue",
    "./client/views/**/*.vue",
    "./client/components/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        'spotify-green': '#1DB954',
        'spotify-black': '#191414',
        'spotify-white': '#FFFFFF',
        'spotify-gray': '#B3B3B3',
        'spotify-light-gray': '#282828',
        'spotify-dark-gray': '#121212',
      },
    },
  },
  plugins: [],
}

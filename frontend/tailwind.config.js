/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                 // Include index.html in frontend/
    "./src/**/*.{vue,js,ts,jsx,tsx}",  // Include all files inside frontend/src
    "./src/views/**/*.{vue,js}",    // Include views inside frontend/src
    "./src/components/**/*.{vue,js}", // Include components inside frontend/src
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

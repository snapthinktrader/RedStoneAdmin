module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#E53935',
          600: '#D32F2F',
          700: '#C62828',
        }
      }
    },
  },
  plugins: [],
}
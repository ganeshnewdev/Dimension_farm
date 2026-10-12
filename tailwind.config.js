/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0B291A',
          900: '#145C38',
          850: '#193729',
          800: '#1E6B43',
          700: '#23764A',
          600: '#2F855A',
          500: '#75B85B',
          400: '#95D17B',
          100: '#E8F5E9',
          50: '#F4F7F3',
        },
        gold: {
          400: '#F6CF63',
          500: '#D4AF37',
          600: '#AA820A'
        }
      },
    },
  },
  plugins: [],
}

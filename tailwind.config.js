/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          950: '#0b291a',
          900: '#145c38',
          850: '#193729',
          800: '#1e6b43',
          700: '#23764a',
          600: '#2f855a',
          500: '#75b85b',
          400: '#95d17b',
          100: '#e8f5e9',
          50: '#f4f7f3',
        },
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Primary saffron
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          600: '#4f46e5',
          800: '#3730a3',
          900: '#312e81', // Deep artisan indigo
          950: '#1e1b4b',
        },
        cream: {
          50: '#fffdfa',
          100: '#fefcf8',
          200: '#fdf8f0',
        }
      },
      fontFamily: {
        sans: ['Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      minHeight: {
        'touch': '56px',
      },
      minWidth: {
        'touch': '56px',
      }
    },
  },
  plugins: [],
}

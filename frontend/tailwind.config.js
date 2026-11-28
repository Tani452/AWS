/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terracotta / Burnt Sienna theme matching the reference design
        terracotta: {
          50: '#FAF4EE',
          100: '#F5E8DC',
          200: '#ECD3BF',
          300: '#DCB293',
          400: '#C98D65',
          500: '#B96942',
          600: '#A84B2C', // Primary brand terracotta from reference
          700: '#913C20',
          800: '#77321A',
          900: '#5F2916',
          950: '#3D180B',
        },
        // Saffron alias re-mapped to rich terracotta so all existing components blend harmoniously
        saffron: {
          50: '#FAF4EE',
          100: '#F5E8DC',
          200: '#ECD3BF',
          300: '#DCB293',
          400: '#C98D65',
          500: '#B96942',
          600: '#A84B2C', // Refined terracotta replacing harsh fluorescent orange
          700: '#913C20',
          800: '#77321A',
          900: '#5F2916',
          950: '#3D180B',
        },
        // Warm sand / oat background replacing harsh bright yellow
        amber: {
          50: '#FAF7F2', // Soft warm oatmeal page background from reference image
          100: '#F5EFE6',
          200: '#EAE1D5',
          300: '#D8CBBA',
          400: '#BFAC96',
          500: '#A68F74',
          600: '#8C7459',
          700: '#705B43',
          800: '#554532',
          900: '#3D3123',
        },
        // Deep espresso / warm charcoal replacing harsh purple/indigo
        indigo: {
          50: '#F7F5F2',
          100: '#EFECE6',
          200: '#DFD9D0',
          300: '#C4B9AD',
          400: '#9B8D7F',
          500: '#766759',
          600: '#5A4D41',
          700: '#473B31',
          800: '#362C24',
          900: '#2A241F', // Deep artisan charcoal-espresso from reference
          950: '#1C1713',
        },
        // Warm neutral slate
        slate: {
          50: '#FAF9F7',
          100: '#F3F0EB',
          200: '#E7E2DA',
          300: '#D3CCC1',
          400: '#A69E93',
          500: '#7D756A',
          600: '#5C5449',
          700: '#433C33',
          800: '#2E2721',
          900: '#1F1A16',
        },
        cream: {
          50: '#FCFAF7',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EAE1D5',
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

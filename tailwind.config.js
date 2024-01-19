/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: '#ffffff',
      dark: '#1a1a1a',
      lightDark: 'rgba(26, 26, 26, 0.3)',
      bg: '#214d76',
      grey: '#9ca3af',
      primary: 'rgb(59 130 246)',
      secondary: 'rgb(10, 133, 10)',
      tertiary: 'rgb(244 63 94)',
    },
    extend: {
      boxShadow: {
        'default': '-4px 9px 27px -1px rgba(0,0,0,0.75)',
      },
      animation: {
        'fullPulse': 'fullPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fullPulse: {
          '0%, 100%' : { opacity: '1'},
          '50%' : { opacity: '0'}
        }
      }
    },
  },
  plugins: [],
}
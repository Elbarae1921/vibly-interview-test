/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'vibly-purple': '#380e4d',
        'vibly-black': '#220936',
        'vibly-gray': {
          100: '#fafafa',
          200: '#f4f4f5',
          300: '#efefef',
          400: '#ededed',
          500: '#dee0e8',
          600: '#979797',
          700: '#505050',
          800: '#f2f2f2',
        },
        'vibly-green': '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '12px',
        'full': '100px',
      },
    },
  },
  plugins: [],
}


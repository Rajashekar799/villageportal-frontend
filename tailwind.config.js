/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#7A4F32',
        leaf: '#2F7D32',
        sand: '#EFE3CF',
        sky: '#DCEFFB'
      },
      boxShadow: {
        card: '0 6px 18px rgba(34, 60, 40, 0.12)'
      }
    }
  },
  plugins: []
};

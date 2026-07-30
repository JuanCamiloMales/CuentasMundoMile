/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#25d366',
          teal: '#128c7e',
          darkteal: '#075e54',
          bg: '#0b141a',
          panel: '#202c33',
          border: '#2a3942',
          text: '#e9edef',
          muted: '#8696a0',
          accent: '#00a884',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.08)',
      },
    },
  },
  plugins: [],
};

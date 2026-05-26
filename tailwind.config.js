/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Classic theme — سبز اسلیمی + لاجوردی
        primary: {
          DEFAULT: '#0F7A6E',
          deep:    '#0A5950',
          glow:    '#1FA193',
        },
        accent: {
          DEFAULT: '#1E3A6B',
          deep:    '#142A52',
          soft:    '#C8D2E5',
        },
        danger: '#B0392C',
        bg: {
          DEFAULT: '#F6EFDD',
          deep:    '#EFE5CB',
        },
        surface: {
          DEFAULT: '#FFFCF3',
          alt:     '#F0E5C7',
        },
        ink: {
          DEFAULT: '#2A1F12',
          soft:    '#5B4A2E',
          mute:    '#8C7651',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        ornate: '20px',
      },
      boxShadow: {
        ornate: '0 8px 28px rgba(15, 122, 110, 0.18)',
        modal:  '0 -16px 50px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};

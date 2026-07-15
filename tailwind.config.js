export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        brand: ['Baloo 2', 'system-ui', 'sans-serif'],
      },
      colors: {
        voca: {
          50: '#FFF8E1', 100: '#FFECB3', 200: '#FFE082', 300: '#FFD54F',
          400: '#FFCA28', 500: '#FFB300', 600: '#FF8F00', 700: '#FF6F00',
          800: '#E65100', 900: '#BF360C',
        },
        sky: {
          50: '#E1F5FE', 100: '#B3E5FC', 200: '#81D4FA', 300: '#4FC3F7',
          400: '#29B6F6', 500: '#03A9F4', 600: '#039BE5', 700: '#0288D1',
          800: '#0277BD', 900: '#01579B',
        },
        forest: {
          50: '#E8F5E9', 100: '#C8E6C9', 200: '#A5D6A7', 300: '#81C784',
          400: '#66BB6A', 500: '#4CAF50', 600: '#43A047', 700: '#388E3C',
          800: '#2E7D32', 900: '#1B5E20',
        },
        coral: {
          50: '#FFF3F0', 100: '#FFE0E0', 200: '#FFCDD2', 300: '#EF9A9A',
          400: '#E57373', 500: '#EF5350', 600: '#F44336', 700: '#E53935',
          800: '#D32F2F', 900: '#C62828',
        },
        ink: {
          50: '#F4F8FA', 100: '#E6EDF0', 200: '#CFD9DE', 300: '#A7BAC4',
          400: '#7A93A3', 500: '#5B7384', 700: '#334B58', 800: '#243B47',
          900: '#1B2A33',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(27,42,51,0.08)',
        card: '0 4px 24px -4px rgba(27,42,51,0.12)',
        pop: '0 8px 32px -8px rgba(27,42,51,0.2)',
        glow: '0 0 32px rgba(255,179,0,0.4)',
      },
      keyframes: {
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        slideUp: { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { transform: 'scale(0.9)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        bob: 'bob 2s ease-in-out infinite',
        slideUp: 'slideUp 0.3s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

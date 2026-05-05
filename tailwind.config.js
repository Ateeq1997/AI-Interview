/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-6px)' },
          '80%': { transform: 'translateX(6px)' },
        },
        priceFlash: {
          '0%': { transform: 'scale(1)', color: 'inherit' },
          '50%': { transform: 'scale(1.15)', color: '#6366f1' },
          '100%': { transform: 'scale(1)', color: 'inherit' },
        },
        checkmark: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        priceFlash: 'priceFlash 0.35s ease-in-out',
        checkmark: 'checkmark 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};

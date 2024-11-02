/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{html,js}"],
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      keyframes: {
        appear: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        animation: {
          appear: "appear 1s ease-in-out",
        },
      },
    },
  },
  plugins: [],
};

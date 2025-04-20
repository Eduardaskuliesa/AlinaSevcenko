/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#998EA7",
          light: "#C9BDC7",
        },
        secondary: {
          DEFAULT: "#F7D09E",
          light: "#F0E5C2",
        },
        background: "#C9BDC7",
      },
      screens: {
        xs: "480px",
        sm: "576px",
      },

      fontFamily: {
        times: ["var(--font-times)"],
      },
    },
  },
  plugins: [],
};

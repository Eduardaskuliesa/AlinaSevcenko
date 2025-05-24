/** @type {import('tailwindcss').Config} */

import containerQueries from "@tailwindcss/container-queries";

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
        xxs: "380px",
        xs: "480px",
        sm: "576px",
      },

      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        times: ["var(--font-times)"],
      },
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
      spin: {
        to: { transform: "rotate(360deg)" },
      },
      ping: {
        "75%, 100%": { transform: "scale(2)", opacity: "0" },
      },
      pulse: {
        "0%": {
          backgroundPosition: "0% 50%",
          opacity: "0.5",
        },
        "50%": {
          backgroundPosition: "100% 50%",
          opacity: "1",
        },
        "100%": {
          backgroundPosition: "0% 50%",
          opacity: "0.5",
        },
      },
      bounce: {
        "0%, 100%": {
          transform: "translateY(-25%)",
          animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
        },
        "50%": {
          transform: "translateY(0)",
          animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
        },
      },
      "fade-in": {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      "fade-out": {
        from: { opacity: 1 },
        to: { opacity: 0 },
      },
      "zoom-in": {
        from: { transform: "scale(0.95)" },
        to: { transform: "scale(1)" },
      },
      "zoom-out": {
        from: { transform: "scale(1)" },
        to: { transform: "scale(0.95)" },
      },
      "slide-in-from-top": {
        from: { transform: "translateY(-2%)" },
        to: { transform: "translateY(0)" },
      },
      "slide-out-to-top": {
        from: { transform: "translateY(0)" },
        to: { transform: "translateY(-2%)" },
      },
      "slide-in-from-bottom": {
        from: { transform: "translateY(2%)" },
        to: { transform: "translateY(0)" },
      },
      "slide-out-to-bottom": {
        from: { transform: "translateY(0)" },
        to: { transform: "translateY(2%)" },
      },
      "slide-in-from-left": {
        from: { transform: "translateX(-2%)" },
        to: { transform: "translateX(0)" },
      },
      "slide-out-to-left": {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(-2%)" },
      },
      "slide-in-from-right": {
        from: { transform: "translateX(2%)" },
        to: { transform: "translateX(0)" },
      },
      "slide-out-to-right": {
        from: { transform: "translateX(0)" },
        to: { transform: "translateX(2%)" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      spin: "spin 1s linear infinite",
      ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      pulse: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      bounce: "bounce 1s infinite",
      in: "fade-in 0.2s ease-out",
      "in-slide-down": "fade-in 0.2s ease-out, slide-in-from-top 0.2s ease-out",
      "in-slide-up":
        "fade-in 0.2s ease-out, slide-in-from-bottom 0.2s ease-out",
      "in-slide-left":
        "fade-in 0.2s ease-out, slide-in-from-right 0.2s ease-out",
      "in-slide-right":
        "fade-in 0.2s ease-out, slide-in-from-left 0.2s ease-out",
      "in-zoom": "fade-in 0.2s ease-out, zoom-in 0.2s ease-out",
      // Animation Out
      out: "fade-out 0.2s ease-in",
      "out-slide-down":
        "fade-out 0.2s ease-in, slide-out-to-bottom 0.2s ease-in",
      "out-slide-up": "fade-out 0.2s ease-in, slide-out-to-top 0.2s ease-in",
      "out-slide-left": "fade-out 0.2s ease-in, slide-out-to-left 0.2s ease-in",
      "out-slide-right":
        "fade-out 0.2s ease-in, slide-out-to-right 0.2s ease-in",
      "out-zoom": "fade-out 0.2s ease-in, zoom-out 0.2s ease-in",
    },
  },
  plugins: [containerQueries],
};

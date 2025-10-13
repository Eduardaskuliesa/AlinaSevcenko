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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        ping: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        pulse: {
          "50%": { opacity: "0.5" },
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
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "zoom-out": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-top": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-out-to-bottom": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-left": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out-to-right": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite",

        // Base animations
        in: "fade-in 0.2s ease-out",
        out: "fade-out 0.2s ease-out",

        // Slide animations with fade
        "in-from-top": "slide-in-from-top 0.3s ease-out, fade-in 0.2s ease-out",
        "out-to-top": "slide-out-to-top 0.3s ease-in, fade-out 0.2s ease-in",
        "in-from-bottom":
          "slide-in-from-bottom 0.3s ease-out, fade-in 0.2s ease-out",
        "out-to-bottom":
          "slide-out-to-bottom 0.3s ease-in, fade-out 0.2s ease-in",
        "in-from-left":
          "slide-in-from-left 0.3s ease-out, fade-in 0.2s ease-out",
        "out-to-left": "slide-out-to-left 0.3s ease-in, fade-out 0.2s ease-in",
        "in-from-right":
          "slide-in-from-right 0.3s ease-out, fade-in 0.2s ease-out",
        "out-to-right":
          "slide-out-to-right 0.3s ease-in, fade-out 0.2s ease-in",

        // Zoom animations
        "zoom-in": "zoom-in 0.2s ease-out",
        "zoom-out": "zoom-out 0.2s ease-in",
      },
    },
  },
  plugins: [containerQueries],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "myBg-gradient": "",
      },
      transformOrigin: {
        "spacy-s": "50% 50%",
      },
      keyframes: {
        animateContainer: {
          "0%": {
            opacity: "0",
            transform: "scale(0)",
            boxShadow:
              "0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "25%": {
            opacity: "1",
            transform: "scale(0.9)",
            boxShadow:
              "0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "43.75%": {
            transform: "scale(1.15)",
            boxShadow:
              "0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset",
          },
          "62.5%": {
            transform: "scale(1)",
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset",
          },
          "81.25%": {
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset",
          },
          "100%": {
            opacity: "1",
            boxShadow:
              "0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset",
          },
        },
        animateCheck: {
          from: {
            strokeDashoffset: "80",
          },
          to: {
            strokeDashoffset: "0",
          },
        },
        animateShadow: {
          "0%": {
            opacity: "0",
            width: "100%",
            height: "15%",
          },
          "25%": {
            opacity: "0.25",
          },
          "43.75%": {
            width: "40%",
            height: "7%",
            opacity: "0.35",
          },
          "100%": {
            width: "85%",
            height: "15%",
            opacity: "0.25",
          },
        },
      },
      animation: {
        animateShadow: "animateShadow 0.75s ease-out forwards 0.75s",
        animateCheck: "animateCheck 0.35s forwards 0.50s ease-out",
        animateContainer: "animateContainer 0.75s ease-out forwards 0.10s",
      },
    },
  },
  plugins: [],
};
export default config;

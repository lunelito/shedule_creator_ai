/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-a0": "#121212",
        "surface-a10": "#282828",
        "surface-a20": "#3f3f3f",
        "surface-a30": "#575757",
        "surface-a40": "#717171",
        "surface-a50": "#8b8b8b",
      },
      fontSize: {
        "fluid-lg": "clamp(1.5rem, 2vw + 1rem, 2.5rem)",
        "fluid-md": "clamp(1rem, 1.5vw + 0.5rem, 1.5rem)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};

export default config;

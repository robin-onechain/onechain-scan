/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  corePlugins: {
    preflight: false
  },
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#214FF6",
        primary1: "#F4A0A1",
        gray_0: "#E9ECEF",
        gray_1: "#99A0AD",
        gray_2: "#2FA766",
        gray_3: "#F8F9FA",
        gray_4: "#9A9FB5",
        red_0: "#214FF6",
        red_1: "#FAD9D9",
        blue_0: "#0E7BE9",
        green_0: "#D5EDE0",
        green_1: "#777E90",
        green_2: "#E3E5E8",
        green_3: "#F4F5F7"
      }
    },
    fontFamily: {
      sofia: ["Sofia Sans Condensed"]
    }
  }
};

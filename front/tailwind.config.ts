import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        bpgray: "#706f6f",
        secundary: "#2b4168",
        acent: "#5eba98",
        google: "#498AF4",
      },
      fontFamily: {
        futura: ['"Futura Md BT"', "sans"],
      },
    },
   
      darkMode:  'media', 
      theme: {
        extend: {},
      },
  },
  plugins: [],
};
export default config;

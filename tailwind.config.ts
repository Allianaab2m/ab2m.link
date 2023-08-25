import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        myTheme: {
          "primary": "#B5CDF3",
          "secondary": "#5B6E7F",
          "accent": "#F27B7B",
          "neutral": "#6B6B6B",
          "base-100": "#383838",
          "info": "#5C98F2",
          "success": "#739680",
          "warning": "#F2E1B3",
          "error": "#F24F4F",
        },
      },
    ],
  },
};
export default config;

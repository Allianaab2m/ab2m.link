/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        myTheme: {
          primary: "#B5CDF3",
          secondary: "#5B6E7F",
          accent: "#F27B7B",
          neutral: "#6B6B6B",
          "base-100": "#383838",
          info: "#5C98F2",
          success: "#739680",
          warning: "#F2E1B3",
          error: "#F24F4F",
        },
      },
    ],
  },
};

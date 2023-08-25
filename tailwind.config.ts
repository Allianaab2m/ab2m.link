module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          "primary": "#B5CDF3"
        },
        myTheme: {
          "primary": "#B5CDF3",
          "secondary": "#5B6E7F",
          "accent": "#F27B7B",
          "neutral": "#6B6B6B",
          "base-100": "#383838",
          "info": "#5C98F2",
          "success": "#739680",
          "warning": "#F2E1B3",
          "error": "#F24F4F"
        }
      }
    ]
  }
};

import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    syntaxHighlight: "shiki",
    remarkRehype: {
      footnoteLabel: "脚注",
    },
    shikiConfig: {
      theme: "css-variables",
      wrap: true
    }
  }
});

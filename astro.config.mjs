import { defineConfig } from "astro/config";
import icon from "astro-icon";
import expressiveCode from "astro-expressive-code";
import remarkLinkCard from "remark-link-card"

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), expressiveCode()],
  markdown: {
    remarkPlugins: [
      [
        remarkLinkCard,
        {
          cache: true,
          shortenUrl: true
        }
      ]
    ]
  }
});
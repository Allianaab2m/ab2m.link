import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import expressiveCode, { ExpressiveCodeTheme } from "astro-expressive-code";
import fs from "node:fs"

const jsoncString = fs.readFileSync(new URL(`./flexppuccin.jsonc`, import.meta.url), 'utf-8')
const flexppuccin = ExpressiveCodeTheme.fromJSONString(jsoncString)

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), expressiveCode({
    defaultProps: {
      wrap: true,
      frame: "code",
    },
    styleOverrides: {
      codeFontSize: '1rem'
    },
    themes: [flexppuccin]
  })],
  markdown: {
    remarkRehype: {
      footnoteLabel: "脚注"
    },
  }
});
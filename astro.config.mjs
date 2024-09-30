import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import swup from "@swup/astro";
import Compress from "astro-compress";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import Color from "colorjs.io";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import remarkEmoji from "remark-emoji";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";
import { rawFonts } from "./src/plugins/vite-raw-fonts.mjs";

const oklchToHex = (str) => {
  const DEFAULT_HUE = 250;
  const regex = /~?\d+(\.\d+)?/g;
  const matches = str.string.match(regex);
  const lch = [matches[0], matches[1], DEFAULT_HUE];
  return new Color("oklch", lch).to("srgb").toString({
    format: "hex",
  });
};

// https://astro.build/config
export default defineConfig({
  site: "https://ab2m.link",
  base: "/",
  trailingSlash: "always",
  integrations: [
    tailwind(),
    swup({
      theme: false,
      animationClass: "transition-swup-",
      containers: ["main"],
      smoothScrolling: true,
      cache: true,
      preload: true,
      accessibility: true,
      updateHead: true,
      updateBodyClass: true,
      globalInstance: true,
    }),
    icon({
      include: {
        "material-symbols": ["*"],
        "fa6-brands": ["*"],
        "fa6-regular": ["*"],
        "fa6-solid": ["*"],
        "simple-icons": ["*"],
      },
    }),
    svelte(),
    sitemap(),
    Compress({
      CSS: false,
      Image: false,
      Action: {
        Passed: async () => true,
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      langs: ["javascript", "gleam"],
    },
    remarkPlugins: [
      remarkMath,
      remarkEmoji,
      remarkReadingTime,
      remarkGithubAdmonitionsToDirectives,
      remarkDirective,
      parseDirectiveNode,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            note: (x, y) => AdmonitionComponent(x, y, "note"),
            tip: (x, y) => AdmonitionComponent(x, y, "tip"),
            important: (x, y) => AdmonitionComponent(x, y, "important"),
            caution: (x, y) => AdmonitionComponent(x, y, "caution"),
            warning: (x, y) => AdmonitionComponent(x, y, "warning"),
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["anchor"],
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {
              className: ["anchor-icon"],
              "data-pagefind-ignore": true,
            },
            children: [
              {
                type: "text",
                value: "#",
              },
            ],
          },
        },
      ],
    ],
  },
  vite: {
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          if (
            warning.message.includes("is dynamically imported by") &&
            warning.message.includes("but also statically import ed by")
          ) {
            return;
          }
        },
      },
    },
    plugins: [rawFonts([".woff2", ".ttf", ".woff", ".otf"])],
    css: {
      preprocessorOptions: {
        stylus: {
          define: {
            oklchToHex: oklchToHex,
          },
        },
      },
    },
    ssr: {
      external: ["@resvg/resvg-js"],
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});

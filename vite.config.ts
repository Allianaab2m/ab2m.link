import { defineConfig } from "vite";
import Icons from "unplugin-icons/vite"
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solidPlugin(),
    Icons({
      compiler: "solid",
      customCollections: {
        "custom-icons": {
          activitypub: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><g fill="none"><path fill="currentColor" fill-rule="evenodd" d="m137.15 52l86.841 63.279v25.237l-86.841 63.655v-25.236l69.533-50.849l-69.533-50.473V52Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="m137.15 102.849l34.617 25.237l-34.617 25.236v-50.473Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M119.841 52L33 115.279v25.237l69.533-50.473v101.322l17.308 12.806V52Zm-34.617 76.086L50.31 153.322l34.617 25.236v-50.472h.298Z" clip-rule="evenodd"/></g></svg>'
        }
      }
    }),
  ],
  server: {
    host: true,
    port: 8080,
  },
});

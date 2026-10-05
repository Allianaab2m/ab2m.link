import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import postcssNesting from 'tailwindcss/nesting/index.js';

// Tailwind CSS v3 is wired through PostCSS directly: @astrojs/tailwind does not
// support Astro >= 6. The base styles it used to inject live in
// src/styles/tailwind.css (imported by Layout.astro).
export default {
    plugins: {
        'postcss-import': postcssImport,          // to combine multiple css files
        'tailwindcss/nesting': postcssNesting,
        tailwindcss: tailwindcss,
        autoprefixer: autoprefixer,
    }
};

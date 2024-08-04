---
title: Fuwariで好きなフォントを使う
published: 2024-08-05
description: ''
image: ''
tags: [Astro, Fuwari]
category: 'Website'
draft: true
---

Fuwariのデフォルトフォント(Roboto)を自分の好きなフォントに変更する方法．

## Fontsourceからフォントをインストール

今回はIBM Plex Sans JPをインストールする．

```
pnpm install @fontsource/ibm-plex-sans-jp
```

## `src/layouts/Layout.astro`を編集する

2~4行目の`import @fontsource/roboto/`をインストールしたフォントに置き換える．

```diff
---
import GlobalStyles from '@components/GlobalStyles.astro'
- import '@fontsource/roboto/400.css'
- import '@fontsource/roboto/500.css'
- import '@fontsource/roboto/700.css'
+ import '@fontsource/ibm-plex-sans-jp/400.css'
+ import '@fontsource/ibm-plex-sans-jp/500.css'
+ import '@fontsource/ibm-plex-sans-jp/700.css'
```

## `tailwind.config.mjs`を書き換える

```diff
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}'],
  darkMode: 'class', // allows toggling dark mode manually
  theme: {
    extend: {
      fontFamily: {
        sans: [
-         'Roboto',
+         'IBM Plex Sans JP',
          'sans-serif',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

## 等幅フォントの変更

コードブロックなどで表示される等幅フォントは`src/components/misc/Markdown.astro`を編集して変更する．

```diff
---
- import '@fontsource-variable/jetbrains-mono'
- import '@fontsource-variable/jetbrains-mono/wght-italic.css'
+ import '@fontsource/ibm-plex-mono/300.css'
+ import '@fontsource/ibm-plex-mono/300-italic.css'
...

    code
-     font-family: 'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace
+     font-family: 'IBM Plex Sans', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace
```

Fontsourceからフォントをインストールするところと`tailwind.config.mjs`を書き換えるところは同じ．

## 参考

https://docs.astro.build/ja/guides/fonts/

[このサイトのLayout.astro](https://github.com/Allianaab2m/ab2m.link/tree/main/src/layouts/Layout.astro)
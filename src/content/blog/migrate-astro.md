---
title: Next.jsからAstroに移行した
published_at: "2023-10-23T18:06:19.229Z"
emoji: "▶️"
---

元々このサイトはNext.js + TailwindCSS + daisyUI + Vercelという構成で作られていた．

ある日，このサイトを触りたくなったときにふとNext.jsはToo muchだと感じたので，前から気になっていたAstroにエイヤと置き換えた．

見た目の部分では大きく変化した部分は無いが，ファイル構造はじめ，開発者体験は割と良くなったと感じている．

Astroの解説記事はググると色々と出てくる．詳しい説明はそちらに投げるとして，ざっくりとAstroのポイントを並べると

- 静的サイトジェネレーター
    - ただし必要に応じてSSRも選択できるっぽい

- コンポーネントに好きなUIフレームワーク(React, Vue, SolidJS...)を自由に使える
    - このページのこのコンポーネントはReactで書きたいな，とかここはVueがいいな，とかが出来るらしい
    - このサイトではわざわざUIフレームワークを導入する必要性を感じていないので，やっていない...

- ビルドの時にJavaScriptを全部剥がす => 超速い
    - ちなみにUIフレームワークを使ったときはその部分だけレンダリング時にハイドレーションされる

- 独自の構文でJavaScriptによるロジック部分とHTMLによるページ構造部分を一つのファイルにまとめて記述する

- MarkdownやMDXのサポートが手厚い

## 爆速で実装したブログ機能

元々やろうとしていたことはこのブログ機能を実装する事だったのだが，Next.jsでは，適切にremark/rehypeでReactコンポーネントやらHTMLやらを吐き出すように仕向けなくてはならないので割と大変だった．

その点Astroの場合は`pages`ディレクトリに`.mdx`ファイルをそのまま置けば良く，HTMLへの変換をするremark/rehypeの部分もうまく隠されていて，一瞬で機能を付けることが出来た．


さらに，`.mdx`の方のFrontmatterに

```mdx
---
layout: ../../layouts/BlogDetail.astro
---
```

と，Astroのレイアウトコンポーネントを指定してやると，MDXがテンプレートに沿って描画される．

描画されたMDXのスタイルが気に入らない場合は，別のファイルに書いたCSSファイルをレイアウトコンポーネントでスタイルシートを読み込めばCSSがHTMLに変換された後のMDXに当たり，スタイリングが出来る．

## フォルダ構造がシンプルになった

もはやフレームワークとか関係ない問題の話だが，整理が出来ない悪い癖がひどく，たいていの場合どこに何のファイルやコンポーネントを置いたか忘れてしまう．

Astroは慣習的に，ある程度ファイルの置き場所やその役割が決まっている．

このサイトであれば，`src`以下の構造はこんな感じ．

```sh
src/
├── components/
│   ├── Footer.astro
│   ├── icons/
│   ├── Link.astro
│   └── Navbar.astro
├── env.d.ts
├── layouts/
│   ├── Base.astro            // Layout for all pages
│   ├── base.css
│   ├── BlogDetail.astro      // Layout for .mdx
│   └── BlogDetail.css
└── pages/
    ├── articles.astro        -> /articles
    ├── blogs/
    │   ├── hello.mdx         -> /blogs/hello
    │   ├── index.astro       -> /blogs
    │   └── migrate-astro.mdx -> /blogs/migrate-astro
    └── index.astro           -> /
```

`components`にはフッターとかに置いてるDiscordとかGithubのアイコンのSVGとか，フッター自体とかが置いてある．

`layouts`には毎ページ書くには面倒なMetaタグとか，ページ間である程度共通してる部分を切り出している．

`pages`はAstroがルーティングするフォルダで，ここに`.astro`とか`.mdx`を置くとルーティングしてくれる．

## 感想

適当にブログ的な何かを作って，その他情報を書くためだけのサイトには，Next.jsは少し過剰すぎたような気がする．
小中規模なこの程度のサイトであれば，AstroやGatsbyで必要十分であったのだ．

今後はこのブログに(使うかわかんないけど)LaTeXの数式表示とか，外部のブログサービスにありがちな機能をちょっとずつ追加していこうと思う．

フレームワークの実現可能範囲を超えた拡張が必要になった場合は，またAstroからNext.jsに戻るかもしれないが，当分はAstroで運用してみる．

他にも何か工夫したところを思い出したら適宜追記することにする．

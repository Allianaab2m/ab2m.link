---
title: 自サイトをまたReworkした
published_at: "2023-12-17T08:46:47.995Z"
---

二カ月ほど前にこのサイトをNext.jsからAstroに[置き換えた](./migrate-astro)．

それ以来，このサイトを触っていなかった(なんで？)のだが，気が向いたので全面的にリニューアルした．こいついっつも気分で自サイト触ってんな．

前のサイトはWeb Archiveか何かでしか見れなくなるだろうが，リニューアルに際してやったことを書いていく．

## daisyUIやめる

そろそろ自分でCSSを書くべきだなあと感じたので，daisyUIをやめた．

CSS，難しすぎない？ 表示が崩れる環境があると思うが，ご容赦願いたい．


## カラースキームの変更

今まではdaisyUIの機能を使って自作の~~ダサい~~カラースキームを使っていたが，daisyUIをやめたので，Tailwindに自分でカラースキームを設定する必要がある．

そこで最近発見して気に入った[Flexoki](https://stephango.com/flexoki)というカラースキームを使うことにした．

Flexokiは[Neovim](https://github.com/kepano/flexoki-neovim)や[Tailwind](https://gist.github.com/martin-mael/4b50fa8e55da846f3f73399d84fa1848)で使えるカラースキームを提供している．

もともとNeovimのカラースキームにこれを採用したのがきっかけだったのだが，かなりいい配色で気に入っている．

## ダーク/ライトモードの切り替えボタンの追加

CSSなんもわからん人間なせいで，TailwindCSSでDark/Lightを切り替える方法がよくわからないでいた．

[公式ドキュメント](https://docs.astro.build/ja/tutorial/6-islands/2/)を参考に，実装が出来た．

## [Content Collection](https://docs.astro.build/ja/guides/content-collections/)にした

今までは`pages/blogs`に`.mdx`の形式で記事を置いていたが，Content Collectionを使うことで，`content/blog`以下に追いやることが出来た．
これで

- `pages/`: ルーティングとLayoutを表示するための`.astro`ファイル
- `layouts/`: コンテンツの配置を定義する`.astro`ファイル
- `content/blog/`: 記事

と， 置き場所が決まりスッキリした．

FrontmatterにZodのバリデーションを効かせたり，記事側にAstroのレイアウトファイルを指定するFrontmatterが不要になるなど，かなりウマ味があった変更．

Content Collectionの使い方や，記事にTailwindCSSのスタイルを当てる方法などは以下のサイトを参考にした．

https://www.to-r.net/media/astro-content-collections/

https://www.to-r.net/media/astro-tailwind-css-apply/

困ったのが`dark:`がこの方法だと当たらないという問題．それっぽい話はGitHubにあったが，これでは解決しなかった．

https://github.com/tailwindlabs/tailwindcss/discussions/2917

## Articlesページの排除

もともとArticlesページという，Zennに書いた記事を一覧表示するページがあったのだが，これは`ab2m.link`のブログ一覧とページが別になっていた．

分かれている理由もないので，Articlesページを削除し，ブログ一覧ページにZennの記事も混ぜて表示することにした．

また，`published_at`でソートして投稿日順になるようにしたり，Zennの記事の場合はZennのロゴが表示されるようにした．

## おわりに

誰が見てるのか分からんサイトのリニューアルの話でした．思ったよりAstroがパワフルだった．正直ずっとこれでいいんじゃないかな．

多分次に触るのは二カ月後．

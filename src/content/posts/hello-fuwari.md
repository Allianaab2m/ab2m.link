---
title: Hello, Fuwari!
published: 2024-08-02
description: 'n度目の自サイトリニューアル'
image: ''
tags: [Astro, Fuwari]
category: 'Website'
draft: false
---

もう何度やり替えたか忘れてしまったが，また[このサイト](https://ab2m.link)をアップデートした．

今回からは[Fuwari](https://github.com/saicaca/fuwari)というAstroを用いたブログテンプレートに切り替えた．

Astroには有志が公開している[Themes](https://astro.build/themes/)というものが存在し，そこで公開されているレポジトリをクローンして配置すればそのデザイン通りのAstroページが出来るというもの．

Fuwariはそこに公開されていたブログテンプレートの一つだ．

swupによるページ遷移アニメーションや，ページ全てがAstro(一部Svelte)で記述されていることによる柔軟性の高さが良さげだったので，採用した．

以前のサイトのように自分で1からデザインを考えるのも嫌いじゃないけれど，作った時点で満足して更新が途絶えるパターンが今までに何度となく起こってきた(から，こんなにリニューアルしているのだが)．

また，私がそこまでデザインに明るくないことから，たびたび表示の崩壊を起こしていたり，そもそもスマホで適切なサイズで見れない致命的な問題も抱えていた．

今回からテーマにデザイン面を出来る他の人に頼ることで，より記事を書くことに専念できる...はず．アウトプット頑張りたい．

## Fuwariのいいところ

特殊な記述をMarkdown上で行うことで，様々なコンポーネントを表示できる．ゼロからこれをやろうとしてずいぶん苦労した記憶があるので，めちゃくちゃありがたい．

例えば，

```markdown
::github{repo="Allianaab2m/ab2m.link"}
```

とすれば

::github{repo="Allianaab2m/ab2m.link"}

このようにリンクカードとして表示される．

Youtubeの埋め込みをそのまま貼れば，埋め込みとして表示してくれるなど．これは元のAstroでもそうなってた気がするけど．

<iframe width="560" height="315" src="https://www.youtube.com/embed/VV4-ZgAfCP8?si=VeyI0Rh6VPu3AwPU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

GitHubのAdmonitionにも対応している．

↓Admonitionってのはこういうの

:::note
色々書くよ
:::

```markdown
:::note
色々書くよ
:::
```

あとはあんまり使う機会はなさそうだが，$\KaTeX$による数式表示もできる．

$$
  \int_S \textbf{\textit{D}} \cdot \textbf{\textit{n}}dS=Q \\
  \nabla \times \textbf{\textit{E}}  -\frac{\partial{\textbf{\textit{B}}}}{\partial t}
$$

---
title: "TypeScript はマクロの夢を見るか: Sweetener で始める構文拡張"
published: 2026-10-06
description: "macro_rules! in TypeScript"
image: ""
tags: ["TypeScript", "Sweetener", "Functional Programming"]
category: Development
draft: false
lang: "ja"
---

みなさんはパイプライン演算子が欲しいですか？私は欲しいです．みなさんも欲しいですよね．ええ，そうです．みなさんはパイプライン演算子を求めています．

ですが TC39 の [proposal-pipeline-operator](https://github.com/tc39/proposal-pipeline-operator) は Stage 2 から一向に動く気配を見せません．

これでは困りましたね．敬虔な関数型言語信者のみなさんであれば，パイプライン演算子のない世界のコードを書いたり読んだりするのが辛いということを知っているはずです．

現に TypeScript ではパイプライン演算子が無いために，こんなことをしています．**なんということでしょう．**

```ts
// 内側から外側へ読む
sum(map([1, 2, 3], (n) => n * 2));

// あるいは pipe 関数で頑張る
pipe(
  [1, 2, 3],
  map((n) => n * 2),
  sum,
);
```

かたやお隣，とは言い難いですが Rust に目を向けると `macro_rules!` なるマクロ展開がサポートされているではありませんか．TypeScript にもこういう仕組みがあれば構文拡張もできそうですね．

......え，あるんですか？

**あるみたいですよ．** それが今回紹介する [Sweetener](https://sweetener-ts.github.io) です．

---

## Sweetener とは何か

Sweetener はマクロを定義・使用するための独自構文 `.sts` から `.ts` を生成するためのライブラリ・ビルドツールです．

とりあえずインストールしましょう．

```bash
npm install --save-dev @sweetener/cli
npx sweetener init
```

試しに，Ruby の `unless` を定義してみます．`if` と逆の動作をします．

```ts title="macros.sts"
export syntax unless:stmt {
    rule { unless ($condition:expr) { $($body:stmt)* } } => {
        if (!($condition)) { $($body)* }
    }
}
```

このようにして定義したマクロは以下のように使うことができます．

```ts title="main.sts"
import { unless } from "./macros.sts" for syntax;

export function withdraw(balance: number, amount: number): string {
  unless (amount <= balance) {
    return "insufficient funds";
  }
  return `withdrew ${String(amount)}`;
}
```

これは単純な TypeScript コードに展開され，以下のようなコードになります．

展開には以下のコマンドを使います．

```bash
npx sweetener expand src/main.sts
```

```ts
export function withdraw(balance: number, amount: number): string {
  if (!(amount <= balance)) {
    return "insufficient funds";
  }
  return `withdrew ${String(amount)}`;
}
```

型検査はこの展開後のコードに対して `tsc` が行うため，Sweetener が特有の型チェックを行うことはありません．

また，マクロの `import` には `for syntax` をつける必要があり，これは展開後の TypeScript コードには出力されません．

## マクロを読む

`unless` マクロを読み解いてみます．

```ts macros.sts
export syntax unless:stmt {
    rule { unless ($condition:expr) { $($body:stmt)* } } => {
        if (!($condition)) { $($body)* }
    }
}
```

- `syntax unless:stmt` で，`unless` という名前のマクロを「文(stmt) が書ける位置」に定義しています．
- `rule { ... }` の中が実際に展開されるパターンです．`()` 内で1個の式を `$condition` として，`{}` 内で0個以上の文を `$body` としてキャプチャしています．
  - `$(...)*` は繰り返し
- `=>` 以降は，実際に TypeScript として展開されるコードを書きます．キャプチャした条件式を反転し，その後のブロックに文を渡すことで `unless` の動作を実装しています．

## パイプラインマクロを実装してみる

次に Elixir スタイル[^1]のパイプライン演算子を実装するマクロを書いてみます．

[^1]: 左辺の評価結果を，右辺の関数の第一引数に暗黙的に渡すスタイル．

```ts title="operators.sts"
export operator (|>):expr {
    fixity infix;
    associativity left;
    precedence 35;

    rule { $value:expr |> $function:ident $(. $member:ident)* ($($argument:expr),*) } => {
        $function $(. $member)*($value #if(present $argument) {, $($argument), *})
    }

    rule { $value:expr |> $function:ident $(. $member:ident)* } => {
        $function $(. $member)*($value)
    }
}
```

```ts title="main.sts"
import { (|>) } from "./operators.sts" for syntax;

const result = [1, 2, 3] |> map((n) => n * 2) |> sum;
```

このコードは TypeScript に展開されたとき，このようになります．

```ts
const result = sum(map([1, 2, 3], (n) => n * 2));
```

なるほど，確かにパイプライン演算子として機能するようにマクロが展開されていますね．

TC39 で提案されている Hack スタイル(`x |> f(%)` のように `%` で代入される値の位置を指定する) のパイプライン演算子も書くことができます．

## 他の活用例

すでに公式の例としては

- Effect-TS のボイラープレートをマクロとして展開する
  - `effect f(x: string) { ... }` を `const f = (x: string) => Effect.gen(function* () { ... })` にする
  - `const x = yield* f()` を `x <- f()` にする
  - `error NotFound { id: string }` を `Data.TaggedError` にする
  - `service Database` を `Context.Tag` にする
  - `handle f() { errors }` を `Effect.catchTag` にする
- Drizzle のテーブル定義 DSL

などがあり，Effect-TS, Drizzle ユーザー[^2]としてはかなり魅力的に見えました．

[^2]: こんなツイートをしていたりします
    <blockquote class="twitter-tweet"><p lang="und" dir="ltr">I ❤ <a href="https://x.com/EffectTS_?ref_src=twsrc%5Etfw">@EffectTS_</a> &amp; <a href="https://x.com/DrizzleORM?ref_src=twsrc%5Etfw">@DrizzleORM</a> !<a href="https://x.com/hashtag/Kirisame3D?src=hash&amp;ref_src=twsrc%5Etfw">#Kirisame3D</a> <a href="https://t.co/ZIzYb0MX89">pic.twitter.com/ZIzYb0MX89</a></p>&mdash; ありあな (@Alliana_VRC) <a href="https://x.com/Alliana_VRC/status/2086116908747882886?ref_src=twsrc%5Etfw">August 8, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

Effect-TS は特にボイラープレートが多く，読むのが結構つらいので，これらのマクロでコードレビュー時の読みづらさが軽減されるのではないかと期待していたり．

## 現状の制約

なんといってもまだ alpha 版という点です．以下の点においてはまだ改善の余地がありそうです．

### エディタの支援がハイライトだけ

LSP やそれに付随するエディタ支援機能の実装自体は PR として上がっているため，それがマージされるとかなり開発しやすくなりそうです．

### 型ごとのマクロ展開を書けない

展開は型検査より前に行われるので，型内部によってマクロの展開方法を変えるなどの記述は現時点では行えません．

### `.sts`, `.stsx` のフォーマットに Biome が対応していない

現状 `.sts`, `.stsx` は Prettier でしかフォーマットできません．普段私が使っているのは Biome なので，ここはつらいなあと思いました．

## おわりに

ガッツリ実戦投入できるパターンはそこまで多くないとは思いますが，ボイラープレートを排除するための手段として知っておくと良さそうだなーという感じです．

マクロ・メタプログラミングに代表される構文の hack はどこまでやっていいのかチームや状況によって大きく変わると思います．~~個人開発ならこれですべてを破壊するのも悪くないですね~~

邪悪なマクロを組まない限り，構文としてはシンプルになるでしょうから，少なくとも人間の認知負荷に対しては良い効果をもたらしてくれると期待しています．

AI エージェントに対してはトークン効率などの面でベンチマークを取る必要がありそうですが．実際どこまでついてきてくれるかは気になるところです．

TypeScript で今まで出来なかったことや，記述量が多くなってしまっていた部分を解決するので，他の言語から TypeScript, Effect-TS などに移ってきたい場合に使える...のか？わからん．誰か実証してください．

この記事で上げたもの以外にも便利なマクロの使い道を思いついたら Zenn の Scrap, [便利な Sweetener マクロ n 選](https://zenn.dev/alliana_ab2m/scraps/1688d382a3f575) に随時追記していくので，気になったら見てみてください．

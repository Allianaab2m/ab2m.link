---
title: 令和のこの時代にバックエンド TypeScript をやるなら Effect-TS を使え
description: 2026年は Effect-TS 元年なので Effect の良さをつらつらと書く
published: 2026-05-13
tags: ["TypeScript", "Functional Programming", "Effect-TS"]
category: Development
draft: false
---

5月に入り，ついに Drizzle ORM v1.0.0-rc.1 がリリースされ，なんと Effect v4 のネイティブサポートが入った． 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Drizzle v1.0.0-rc.1 is out 🚀<br><br>▪︎ Effect v4 native support<br>▪︎ JIT row mappers to reduce ORM overhead to ~0<br>▪︎ Reworked casing API (breaking change)<br>▪︎ Drizzle for LLM agents (preview)<br><br>Drizzle is now as fast as using raw driver and mapping(or not mapping) results by hand… <a href="https://t.co/o5UKPuPQQK">pic.twitter.com/o5UKPuPQQK</a></p>&mdash; Drizzle ORM (@DrizzleORM) <a href="https://twitter.com/DrizzleORM/status/2049984880600121556?ref_src=twsrc%5Etfw">April 30, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

これを見て私は **2026年は Effect-TS 元年である** と確信した．今まで Effect-TS 側が何かライブラリやランタイムに向けたアダプターをサポートすることはあったが，ライブラリ側から Effect-TS に歩み寄ってくることは今までになかった．しかも Drizzle が．

めっちゃクリックベイトみたいなタイトルだが，割と本当だと思っている．

巷では「バックエンド TypeScript はやめろ」みたいな話題が定期的に飛び交うが，私はそうは思わない．ライブラリも，デプロイする環境も数多くある．動作速度も必要十分である．

そして何より，フロントエンドでは TypeScript がデファクトスタンダードとなっている現状で，あえてバックエンド用に新たな言語を習得するコストが高いと考えているためである．

そんな筋金入りのバックエンド TypeScript 推進派の私だが，もちろん否定派の意見にも理がある部分はある．
否定派の言い分はおおむね以下の3点に集約される:

- ライブラリが頻繁に壊れる・塩漬けビリティが低い
- Rails のように思想を持って開発を導いてくれる骨太なフレームワークが NestJS くらいしかなく，しかもそれは控えめに言って使えたものではない
- ORM ねーじゃん

これらの問題は Effect-TS を使えば解決するのではないか，そう考えている．

## Effect-TS とは何者

Effect-TS は TypeScript 上で動くエフェクトシステム，関数型コンビネータ，標準ライブラリ群である．

エフェクトシステムという意味不明な単語が突然登場したが，ざっくり説明すると，失敗するかもしれない処理や非同期処理，副作用を伴う処理や依存によって実現する処理を1つの `Effect<A, E, R>` という型で一括で扱う Haskell 由来の仕組みである．Effect-TS で書かれたコードの中には `Promise` も `async/await` も登場しない．`A` が成功時の値，`E` が失敗時のエラー，`R` が Effect 自体の実行に必要な依存をそれぞれ表している．

```typescript
import { Effect } from "effect"

// User を返し，NotFoundError で失敗する．実行には UserRepo が必要．
const findUser = (id: number): Effect.Effect<User, NotFoundError, UserRepo> =>
  Effect.gen(function* () {
    const repo = yield* UserRepo // R = UserRepo
    const user = yield* repo.findById(id) // (id: number) => Effect<User, NotFoundError>
    return user // User
  })
```

これだけ見れば「ふーん，ただの `Result` 型ね」で終わってしまうかもしれないが，この `Effect` 型を中心にエコシステム全体が同じ思想で組み上がっているのが Effect-TS の真骨頂である．

## 不満に反論する

### ライブラリが壊れる

Effect のエコシステムに閉じればかなり緩和される．`@effect/*` という名前空間で公式が用意している標準ライブラリが利用可能である．`argon2` など，特殊な処理をするライブラリを入れない限りはほぼ Effect エコシステム内でバックエンドを構築できる．

- `effect/Schema`: バリデーション・パース・シリアライズ
- `@effect/platform`: HTTP サーバー・クライアント，ファイルシステム，KVS
- `@effect/sql`: SQL クライアント，クエリビルダ，簡易マイグレータ
- `@effect/cli`: CLI ツール
- `@effect/ai`: LLM クライアントの抽象化

これらがすべて Effect 本体と同じ思想・同じリリースサイクルで管理されている．バリデーションは Zod, HTTP サーバーは Hono, DB は Drizzle, ロガーは Pino...みたいな組み合わせをやらなくても良い．

無論，頼るライブラリセットを絞れば，ライブラリが壊れるというリスクは小さくなる．また，Effect 本体の API は現在 v4 のリリースが計画されており，現在 beta となっている．これが LTS となる予定であり，今後メジャーバージョンを頻繁に出さない方針が明言されている[^1]．
v3 もすでに feature freeze 済みで，v4 安定後も保守は継続される予定だ．

[^1]: https://effect.website/blog/releases/effect/40-beta/

### 思想のないフレームワーク

これに関しては Effect-TS こそが思想そのものである．

Effect-TS はライブラリである一方，フレームワークでもある．

- 依存性注入： `Context` / `Layer`
- 制御フロー： `Effect.gen`
- エラーハンドリング： `Effect.catchTag` / `Effect.catchAll`
- リソース管理： `Effect.acquireRelease`
- 並行制御： `Effect.fork` / `Effect.race` / `Effect.all({ concurrency })`
- HTTP サーバ： `@effect/platform/HttpApi`

```typescript
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"

const User = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
})

const UsersApi = HttpApiGroup.make("users")
  .add(
    HttpApiEndpoint.get("getById", "/users/:id")
      .setPath(Schema.Struct({ id: Schema.NumberFromString }))
      .addSuccess(User)
      .addError(Schema.TaggedStruct("NotFound", {}), { status: 404 })
  )
  .add(
    HttpApiEndpoint.post("create", "/users")
      .setPayload(Schema.Struct({ name: Schema.String }))
      .addSuccess(User)
  )

const Api = HttpApi.make("api").add(UsersApi)
```

あとはこの `Api` に対して `HttpApiBuilder` でハンドラを実装するだけで，リクエストのパース・バリデーション・レスポンスのシリアライズ・エラーレスポンスが全部型に乗ったまま動く．

Rails ほど Convention over Configuration を押し付けてくるわけではないが，少なくとも「ルーティングはこれ，DI はこれ，バリデーションはこれ」とある程度バックエンドサーバーを実装する上でのフローが Effect エコシステム上に構築されている．

### ORM ねーじゃん

Effect には長らく，薄い SQL クライアントしか存在しなかった(`@effect/sql`)．だが，冒頭でも触れたとおり，Drizzle に Effect のネイティブサポートが追加された．

```typescript
import { PgClient } from "@effect/sql-pg"
import * as PgDrizzle from "drizzle-orm/effect-postgres"
import { Effect, Redacted } from "effect"
import { usersTable } from "./schema"
import { relations } from "./relations"

const PgClientLive = PgClient.layer({
  url: Redacted.make(process.env.DATABASE_URL!),
})

const DB = PgDrizzle.make({ relations }).pipe(
  Effect.provide(PgDrizzle.DefaultServices)
)

const program = Effect.gen(function* () {
  const db = yield* DB
  const users = yield* db.select().from(usersTable)
  return users
}).pipe(Effect.provide(PgClientLive))

await Effect.runPromise(program)
```

`Effect.gen` の中で Drizzle の `db.select()` を `Effect.tryPromise` で包む必要はもうない．`yield*` するだけで SELECT 文の戻り値が左辺に束縛される．コネクションも `PgClient` を通じて提供される．

従来は Drizzle の Promise ベース API と Effect の世界とのあいだにグルーコードが必要だったが，それが消えた．

---

という話を最近 VRChat の技術コミュニティ内の至る所で行っており，「隙あらば Effect 語り」，隙E語をしていたのだが，その中でこんな声も聞いた．

### 関数型プログラミングを理解していないと辛い？

これは半分 Yes で，半分 No かなと思う．Effect の根っこの部分には確かに関数型的な発想が強く入っているが，書き手としてそれらを理解する必要は必ずしもない．

`Effect.gen` を使うと，手続き型的なコードに変化させられる．`yield*` は `await` の代わりになるし，そう考えると `Effect.gen` は `async` とも取ることができる．`await` と違う点は，エラーも依存も型に載るという点ぐらいではないだろうか．

関数型のエッセンスはあったら便利だが，別に無くても書けるというところが Effect-TS を Effect-TS たらしめている大きな要素だと考えているし，それを体現するためには他の静的型付け言語ではなく，TypeScript である必要があったのだと考えている．

全部 `pipe` で書いてやるぜヒャッハー！な人はそうすれば良いし，`Effect.gen` で手続き的に書きたいぜ，って人もそうすれば良い．

### ボイラープレートが多くなる？

間違いなくこれは Yes である．明日から `async () => {}` を `Effect.gen(function* () {})` で書いてくださいなんて言われれば正直気が狂う．コードベースも全体的に `Promise` とクラスでサクッと書くのに比べれば記述が増えるのは事実である．

ところが，これは果たして 2026 年において欠点と言えるだろうか，というのを問いたい．

今日日，アプリケーションコードのほとんどは AI エージェントに生成させる時代である．ある程度 Effect で書かれたコードベースを一度発見すれば，AI エージェントはそれを模倣し，実装を行ってくれる．人間はコードを書くことよりも，書かれたコードを読んで検証し，方針を定めることが中心になりつつある．

よって，書くコストは AI にほぼ吸収され，読むコスト・実装の誤りに気づき，修正するコストだけを人間が負うことになる．このコストをさらに最小化させるために Effect を活用できないかというところである．

`Effect<User, NotFoundError | DbError, UserRepo | Logger>` という1つの型シグネチャを読めば，この処理が「何を返すのか」「何で失敗しうるのか」「何に依存しているのか」がすべて分かる．LSP でカーソルを当てればそのままホバーに出る．

`Effect.catchTag` で `NotFoundError` をハンドルし忘れていれば，ハンドルを忘れたエラー型がそのまま `E` に乗り続け，浮かび上がってくる．依存を提供し忘れていれば，`R` が `never` にならず Effect を実行する場所で型エラーが発生する．

つまり，AI が書いたコードを人間が読むとき，その妥当性を型と LSP が即座にフィードバックしてくれる．これは「AI が書く → LSP を通じて AI に型エラーが伝えられる → 修正のためにまた AI が書く」という実装のループを人間が関わることなく組み立てることができるということである．

ボイラープレートが多少増えても，この開発速度と安定性を得られるのなら，それに越したことはないと考える．ボイラープレートのコストは AI に押し付けて，型安全性のリターンだけ人間が受け取ることができる時代がやってきたということである．

## まとめ

というわけで，TypeScript をバックエンドの言語として選定しようとしているときには，是非一度検討してみてほしい．

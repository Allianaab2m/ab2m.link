---
title: GithubActionsで他のレポジトリからPR作成する
published_at: "2023-12-17T15:44:54.924Z"
---
いろいろ試行錯誤した末にcontents-ab2mlinkからab2m.linkの`src/content`フォルダへ複製することが出来た．

今思えば，Submoduleでも良かったかもしれないけど．

内容としては，GithubActionsでcontentsのアップデート内容をab2m.linkに送り，別のブランチにコミットし，ab2m.link側のActionsを発火するようにする．

発火されたActionsではghコマンドでPull requestsを作るようになっている．

なぜこんなことをしたかというと，Obsidian Gitを使ってObsidianから執筆～Deployまでを完結させたかったから．

実際にはDeployまで自動にするのは怖いのでPull Requestを作るようにした．

## デプロイ元

```yml
name: Make pull request for main repo

on:
  workflow_dispatch:
  push:
    branches: main

jobs:
  make-pr:
    name: Make pull request for main repo
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - uses: technote-space/get-diff-action@v4.0.1
        with:
          PATTERNS: content/blog/*.md

      - name: Push file
        uses: dmnemec/copy_file_to_another_repo_action@main
        env:
          API_TOKEN_GITHUB: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        with:
          source_file: "content/"
          destination_repo: "Allianaab2m/ab2m.link"
          destination_folder: "src/"
          destination_branch: "blog-update"
          user_email: "56180684+Allianaab2m@users.noreply.github.com"
          user_name: "Alliana"
          commit_message: "Blog article update"
        if: env.GIT_DIFF
      - name: Dispatch create-pr
        uses: peter-evans/repository-dispatch@v1
        with:
          repository: "Allianaab2m/ab2m.link"
          token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          event-type: create-pr
        if: env.GIT_DIFF
```

## デプロイ先

```yml
name: Create PR for update blog article

on:
  workflow_dispatch:
  repository_dispatch:
    types:
      - create-pr

jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: ${{ github.env.pull_request.head.ref }}
          fetch-depth: 0

      - name: Create Pull request
        run: gh pr create -B "main" -H "blog-update" -t "Blog update" -b "Blog update"
        env:
          GH_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}

```

PAT使ってるのとか，~~PR立ちっぱだと落ちてるように見える~~(→修正した)とか，イケてない感じはあるけど動くのでヨシって感じ．

Obsidianからブログを更新できるようになって快適．

## 参考にした記事

https://zenn.dev/mh4gf/articles/copy-file-to-another-repository

https://zenn.dev/seya/articles/96ea2e7d81d0be

https://zenn.dev/kshida/articles/auto-generate-release-pr-with-github-actions
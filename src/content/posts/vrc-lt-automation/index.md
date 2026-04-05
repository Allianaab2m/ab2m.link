---
title: VRChat 内で LT をするときのスライド動画生成を自動化する
description: ''
published: 2026-04-05
category: Development
tags: ["VRChat", "GitHub Actions", "Cloudflare R2"]
draft: false
---

VRChat 内で LT をする場合，スライドを書き出した PDF 内のページを2秒ずつ送る動画形式にする必要がある．

これは VRChat 内のスライドシステムとして実装されているアセットのほとんどが動画プレイヤーの仕組みを用いており，スライド送りの機能は，オフセットを2秒ずつ動かすという方法で実装されているためである．

PDF を突っ込めばスライドシステムで読み込める形式の動画を生成し，リンクを発行してくれる Web サービスもあるにはあるが，以下の理由から後述の `ffmpeg` を用いた方法でスライド動画を生成した．

- 画質の劣化が激しい
- 生成される URL が長い
- たまに生成が失敗するなど，動作が安定していない
  - 開発者のことは知ってはいるが，ファイルを入れるのはどことなく不安

## 手順1. PDF ファイルを用意する

まずはスライドの内容を書き出した PDF ファイルを用意する．

私は Marp を使っているため，Marp を用いて PDF を生成した．

## 手順2. PDF ファイルを動画に変換する

スライドの PDF ファイル名が `slide.pdf` であるとして，以下のコマンドを実行する．

コマンドの内容を少し解説すると，`pdftoppm` は PDF ファイルのページの1枚1枚を PNG ファイルとして書き出すコマンド．解像度はスライドシステム内で綺麗に表示するために 4K で書き出している．

`ffmpeg` はその生成された PNG ファイルを1枚あたり2秒表示する動画に変換している．

```bash
pdftoppm -png -scale-to-x 3840 -scale-to-y 2160 slide.pdf slide
ffmpeg -framerate 1/2 -i slide-%02d.png -s 3840x2160 -r 60 -c:v libx264 -pix_fmt yuv420p -profile:v baseline slide.mp4
```

## 手順3. オブジェクトストレージに突っ込む

あとはこれで生成された動画ファイルをオブジェクトストレージに格納し，URL を得る．

今回の用途では Cloudflare R2 が 10GB 分のストレージを持っているため，これを利用することにした．

自分でファイル名を決めるので，衝突の心配がない．また，R2 に独自ドメインを当てることで，スライドを表示するための URL はとても短くなる．

## 手順4. ここまでの手順を GitHub Actions で自動化する

あとはここまでの手順を GitHub Actions にやらせることで， Markdown を main に push するだけでスライドデータが用意できるようになる．

この仕組み自体は GitHub Actions と Cloudflare R2 を用いた簡易的なものであるため，使ってみたい場合はご自身のアカウントで同じような環境を構築し，ワークフローを書くことで実現できる．

以下，Claude に以上の要件を伝えた上で書いてもらったワークフローを貼っておく．

`*.md` に変更があった場合と，手動で実行できるようになっている．

`*.md` の方は差分更新で，手動で実行した場合は全てのスライドをコンパイルするので，枚数が増えてくると `ffmpeg` の実行にそこそこ時間がかかりそうな雰囲気がある．

Secrets は適宜自分の S3 互換ストレージのものに置き換えるなどしてほしい．

```yaml
name: Build and Deploy Slides

on:
  push:
    branches: [main]
    paths:
      - "**/*.md"
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Determine target directories
        id: targets
        run: |
          if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
            dirs=$(ls -d */index.md 2>/dev/null | xargs -I{} dirname {})
          else
            # HEAD コミットで変更された .md ファイルの親ディレクトリだけ対象
            dirs=$(git diff-tree --no-commit-id --name-only -r HEAD -- '*.md' \
              | xargs -I{} dirname {} | sort -u \
              | while read -r dir; do [ -f "$dir/index.md" ] && echo "$dir"; done)
          fi

          if [ -z "$dirs" ]; then
            echo "No slide directories to build."
            echo "skip=true" >> "$GITHUB_OUTPUT"
          else
            echo "skip=false" >> "$GITHUB_OUTPUT"
          fi

          {
            echo "dirs<<EOF"
            echo "$dirs"
            echo "EOF"
          } >> "$GITHUB_OUTPUT"

      - uses: actions/setup-node@v4
        if: steps.targets.outputs.skip == 'false'
        with:
          node-version: "22"

      - name: Install dependencies
        if: steps.targets.outputs.skip == 'false'
        run: |
          sudo apt-get update
          sudo apt-get install -y poppler-utils ffmpeg
          npm install -g @marp-team/marp-cli

      - name: Build and convert slides
        if: steps.targets.outputs.skip == 'false'
        run: |
          while IFS= read -r dir; do
            [ -z "$dir" ] && continue
            project=$(basename "$dir")
            echo "::group::Building $project"

            # Marp to PDF
            marp --theme-set .styles/index.css --allow-local-files --pdf "$dir/index.md" -o "$dir/${project}.pdf" --verbose

            # PDF to PNG (3840x2160)
            pushd "$dir"
            pdftoppm -png -scale-to-x 3840 -scale-to-y 2160 "${project}.pdf" slide

            # Rename to ensure 2-digit zero-padded numbering for ffmpeg
            for f in slide-*.png; do
              num=$(echo "$f" | sed 's/slide-0*\([0-9]*\)\.png/\1/')
              dest=$(printf 'slide-%02d.png' "$num")
              [ "$f" != "$dest" ] && mv "$f" "$dest"
            done

            # PNG to MP4
            ffmpeg -framerate 1/2 -i slide-%02d.png -s 3840x2160 -r 60 -c:v libx264 -pix_fmt yuv420p -profile:v baseline "${project}.mp4"

            rm -f slide-*.png
            popd

            echo "::endgroup::"
          done <<< "${{ steps.targets.outputs.dirs }}"

      - name: Upload to Cloudflare R2
        if: steps.targets.outputs.skip == 'false'
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_ENDPOINT: https://${{ secrets.R2_ACCOUNT_ID }}.r2.cloudflarestorage.com
          R2_BUCKET: ${{ secrets.R2_BUCKET_NAME }}
        run: |
          while IFS= read -r dir; do
            [ -z "$dir" ] && continue
            project=$(basename "$dir")
            aws s3 cp "$dir/${project}.pdf" "s3://${R2_BUCKET}/slides/${project}.pdf" --endpoint-url "$R2_ENDPOINT"
            aws s3 cp "$dir/${project}.mp4" "s3://${R2_BUCKET}/slides/${project}.mp4" --endpoint-url "$R2_ENDPOINT"
          done <<< "${{ steps.targets.outputs.dirs }}"
```

## 見た目の違いに関して

実際どれぐらい見た目が違うのか実際に検証した．ちなみに私は画像処理系に関しては門外漢なので，主観ベースでしかお話できないことを予め断っておく．

左は Web Screen を用いて PDF を動画に変換したもの，右は今回の手法で動画に変換したもの．

![比較](./hikaku.png)

今回の手法で出力した場合のほうが，全体的に文字のぼやけがなく，クリアに表示されていることがわかる．

## 謝辞

[えー](https://github.com/a1678991)さんから手順2で示した動画化コマンドとアイデアを頂きました．ありがとうございました．
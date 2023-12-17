---
title: GithubActionsで他のレポジトリからPR作成する
published_at: "2023-12-17T15:44:54.924Z"
---
いろいろ試行錯誤した末にcontents-ab2mlinkからab2m.linkの`src/content`フォルダへ複製することが出来た．
Submoduleでも良かったかもしれないけど...

内容としては，GithubActionsでcontentsのアップデート内容をab2m.linkに送り，別のブランチにコミットし，ab2m.link側のActionsを発火するようにする．
発火されたActionsではghコマンドでPull requestsを作るようになっている．

なぜこんなことをしたかというと，Obsidian Gitを使ってObsidianから執筆～Deployまでを完結させたかったから．
実際にはDeployまで自動にするのは怖いのでPull Requestを作るようにした．
---
title: ポータブルSSDにArch Linuxを入れるときはブートローダの場所に気を付けよう
published_at: "2023-12-30T04:01:23.514Z"
---
## TL:DR;

- EFIバイナリを`/boot/EFI/boot/bootx86.efi`に入れておくといい
- `grub-install`が内部で使っている`efibootmgr`になんかバグがあるっぽい
- `efibootmgr`に別途フラグを与えて実行することで回避可能

 私が使っているラップトップをWindowsとArch Linuxのデュアルブートにした．

デュアルブートといっても，1つのSSDにこれらを共存させるのは何かの拍子にぶっ壊れてしまう危険性がある．
そこで，ポータブルSSDにArch Linuxをインストールし，取り付けている間はArch，外すとWindowsが起動するような環境とすることにした．

インストールは問題なく完了し，何度か再起動をしてSwayの導入まで進めた．

が，一度Windowsへ戻ると二度とBIOS(UEFI)がArchを認識しない状態になってしまった．
## 全部Arch Wikiに書いてた

適当にググりながらヒットしたのがこのページ．やはりArch Wikiは聖書

[Unified Extensible Firmware Interface#ファームウェアのメニューにUEFIブートローダーが表示されない - ArchWiki](https://wiki.archlinux.jp/index.php/Unified_Extensible_Firmware_Interface#.E3.83.AA.E3.83.A0.E3.83.BC.E3.83.90.E3.83.96.E3.83.AB.E3.83.89.E3.83.A9.E3.82.A4.E3.83.96.E3.81.AE.E3.83.87.E3.83.95.E3.82.A9.E3.83.AB.E3.83.88.E3.83.96.E3.83.BC.E3.83.88.E3.83.91.E3.82.B9)

> 一部のファームウェアはカスタムのブートエントリをサポートしていません。そのようなファームウェアはハードコードされたブートエントリからしか起動しません。

つまり，`/boot/EFI/hoge/`とかにEFIバイナリを置いても，一部の環境では認識してもらえてないかもよ！とある．

もちろん対処法もあり，`/boot/EFI/boot/bootx64.efi`に置くとたいていの場合認識してもらえるそうだ．生成されたEFIバイナリを手でコピーしてもいいが，`grub-install`コマンドに`--removable`フラグが用意されているのでそれを使えばOK．

```sh
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=Arch --removable
```

このページにはもう一つ，`efibootmgr`のバグの可能性が書いてある．
対処法は`efibootmgr`に`-e 3`(EDD 3.0を強制する)というフラグを渡すというものだが，`grub-install`には直接このフラグを渡せない．

そこで，`efibootmgr`をラップする．`/usr/local/bin/efibootmgr`に

```sh
#!/bin/sh

exec /usr/bin/efibootmgr -e 3 "$@"
```

と書き，`chmod +x /usr/local/bin/efibootmgr`とする．こうすることで，`grub-install`でも`-e 3`フラグが渡された状態で実行される．

これらの手順を同時に実行したため，根本的解決がどちらで行われたかは分からなかったが，(ほぼArch Wikiの書き写しだけど)参考になれば．

## 参考文献

[Unified Extensible Firmware Interface - ArchWiki](https://wiki.archlinux.jp/index.php/Unified_Extensible_Firmware_Interface)

[Arch Linuxのインストール](https://zenn.dev/imzrust/articles/42420891968a7)

[Linuxの起動の流れ #Linux - Qiita](https://qiita.com/tomomoss/items/f3f3d9d4ffd8fe3662bb)
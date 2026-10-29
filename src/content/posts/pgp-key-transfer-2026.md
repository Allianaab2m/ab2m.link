---
title: OpenPGP 鍵を移行した
published: 2026-10-29
description: "OpenPGP 鍵を移行し，SSH 鍵に関しても変更を加えたため，それに関する声明"
image: ""
tags: []
category: ""
draft: false
lang: "ja"
---

## TL;DR:

OpenPGP 鍵を移行した．

- 旧鍵: `BE93 7556 2F46 135A 855D F10C 690B 82B2 B500 ABE1`
- 新鍵: `AC18 34FA D1D3 9235 4BE6 E223 BD28 E3FF 1A11 AAB2`
- 新しい鍵は [こちら](https://ab2m.link/pub.asc) から
- SSH 公開鍵は [GitHub](https://github.com/Allianaab2m.keys) を参照

以下，Transition statement.

[こちら](https://ab2m.link/key-transition-2026-10-29.txt.asc)からも Transition statement を入手できる．

```txt
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

Date: 2026-10-29

I am transitioning my OpenPGP key to a new one stored on hardware tokens.
The old key will expire shortly and should no longer be used.

Old key:
    BE93 7556 2F46 135A 855D F10C 690B 82B2 B500 ABE1
New key:
    AC18 34FA D1D3 9235 4BE6 E223 BD28 E3FF 1A11 AAB2

This document is signed by both keys. The keys have also cross-signed each other.
Please update your keyring and any references accordingly.

The new key is available at:
    https://ab2m.link/pub.asc

- -- Yuji Yoshimura (Alliana)

-----BEGIN PGP SIGNATURE-----

iLkEARMKAB0WIQRrN5sM1mZRM9fmbzvPI9GEANOeLwUCauLYywAKCRDPI9GEANOe
L0bmAgkBff8A5cbERv5p3FoWmZQWMY5iiuZc8NoDga1zWRH2JfR0fJv5YwtmUtik
umZ1NAt6Ku1+IU/G/lkQFCan2QXTXMECCQGlyKlbvrbncV15qiCRgqCiOa2XVs8h
mrizySiWLhScgdZ86AyFpc5HSdmTe1OfORDaF7PYOr1+zNz0KrYYxPkTQoh1BAEW
CgAdFiEEnVFJRBSu0WjJkHRttQVlhJMbTscFAmri2M8ACgkQtQVlhJMbTsdQjAEA
+Ye4hjdFn9k95nzu2JK7tXGOiph/ByCQ2J+CTiwR4vcBAMtLTVxy3b3NHhm9BrWn
UPNxgYgxYSlxR96gmqhYgn0I
=ZJ1Z
-----END PGP SIGNATURE-----
```

Transition statement の検証をするには，以下のコマンドを使ってください．

```sh
curl -s https://ab2m.link/pub.asc | gpg --import
gpg --recv-keys BE9375562F46135A855DF10C690B82B2B500ABE1
gpg --check-sigs AC1834FAD1D392354BE6E223BD28E3FF1A11AAB2
curl -s https://ab2m.link/key-transition-2026-10-29.txt.asc | gpg --verify
```

また，今後の GitHub におけるコミット署名は，SSH 鍵ではなく PGP 鍵で行う．

これまで SSH 鍵で署名したコミットは引き続き Verified として表示されるが，新しいコミットに SSH 鍵の署名が付くことはない．

## 移行のきっかけ

OpenAI と Yubico のキャンペーンで YubiKey C NFC と YubiKey C Nano を安く手に入れたので，4 年使った PGP 鍵を引退させることにした．

ここ数年はコミット署名を SSH 鍵（1Password の ssh-agent）に任せていたが，署名がソフトウェアだけで完結しているのがどうも気になっていたので，鍵をハードウェアに移した．

## 新しい構成

- 主鍵: 保管用の YubiKey
- 署名・暗号化の副鍵: 持ち歩き用の YubiKey
- SSH: YubiKey ごとに FIDO2 鍵（`ed25519-sk`）

SSH には PGP の Auth 副鍵を使わず，YubiKey の FIDO2 機能で作った鍵を使う．

OpenSSH 8.2 以降は FIDO2 鍵に対応していて，秘密鍵は YubiKey の外に出ず，ログイン時にタッチするだけで済む．gpg-agent を挟まなくていいので運用が楽になった．

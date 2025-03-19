# NormToStandardJapanChar

[![NormToStandardJapanChar v0.4.6](https://img.shields.io/badge/NormToStandardJapanChar-v0.4.6-6479ff.svg)](https://github.com/komiyamma/vscode_extension_norm_to_standard_japan_char/releases)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

Unicode文章でよく発生する「文字のゆれ(形が近い異字体等)」を「標準的な文字」へと正規化する機能を提供します。  

NFCやNFKCで一括変換といった単純なものではなく、以下のように調整しています。  

- １文字ずつ走査します。  

    - ここでいう「１文字」とは、サロゲートペアなど「複数の文字で１つの文字」を形成している場合、その「複数の文字全体」を１文字として取り扱います。  
- 文字がsjisの文字に収まっている場合、それをそのまま採用します。  
- 文字がsjisの文字に収まっていない場合、「NFC」でUnicode正規化を試みます。  
- この変換の結果、「何らかの文字変換が行われた」場合、それを採用します。  
- 上では文字の変化が起きなかった場合、該当文字を「NFKC」でUnicode正規化を試みます。  
- この変換の結果、「元の文字とバイト数が同じか、それ以下の場合のみ」それを採用します。  
  
以上の形で「文字の揺れ」を解消しています。

## 使い方

コマンドパレットで「Normalize to standard Japanese characters」を実行する。  
テキストを何も選択していない場合は全文を対象とする。  
テキストを選択している時は、選択している範囲を対処とする。  

## マーケットプレイス

[NormToStandardJapanChar](https://marketplace.visualstudio.com/items?itemName=komiyamma.normtostandardjapanchar) で公開されています。

## Change Log

### 0.4.6

- README の文言修正

### 0.4.5

- アイコンの作成

### 0.4.3

- 修正対象がない場合には、何もしないようにした。

### 0.4.2

- README の文言修正

### 0.4.1

- 初公開


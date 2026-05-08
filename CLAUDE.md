# CLAUDE.md

このファイルは、Claude Code が本リポジトリで作業する際に従うべきガイドラインを記述します。

## コーディング規約

### Signal / Observable の命名規則

1. **Observable は `$` サフィックス**（例: `users$`, `state$`）
2. **Signal はサフィックスなし**（例: `count`, `user`）
3. **private な `Subject` を public な `Observable` として公開するときは、内部 Subject の先頭に `_` を付ける**（例: `private _users$` / `readonly users$`）
4. **signal と observable が混在するクラスでは、片方の命名規則を破らないように一貫性を最優先する**

詳細・コード例は [docs/coding-conventions.md](docs/coding-conventions.md) を参照。

# angular-three-tier-architecture

Angular における 3 層アーキテクチャ（Component / Usecase / API Service）を素振りするためのリポジトリ。動作確認用に Express ベースの簡易バックエンドも同梱している。

## 必要環境

- Node.js 24.15.0（[mise.toml](./mise.toml) で固定）
- npm 11.12.1（package.json の `packageManager` で固定）

## セットアップ

```bash
npm ci
```

## 開発

フロントエンドとバックエンドをまとめて起動する。

```bash
npm run dev
```

- フロントエンド: <http://localhost:14200>
- バックエンド: <http://localhost:63000>

個別に起動する場合は `npm start`（フロントエンド）/ `npm run start:backend`（バックエンド）。

## npm scripts

| script | 内容 |
| --- | --- |
| `npm run dev` | フロントエンド + バックエンドを同時起動（concurrently） |
| `npm start` | フロントエンドのみ（`ng serve --port 14200`） |
| `npm run start:backend` | バックエンドのみ（`tsx watch`） |
| `npm run build` | フロントエンドの本番ビルド |
| `npm run build:backend` | バックエンドの型チェック / コンパイル |
| `npm test` | Vitest で単体テストを実行 |
| `npm run lint` | ESLint（angular-eslint）でコードを検証 |

## ディレクトリ構成

```
src/app/
├── apis/                          # データアクセス層（HTTP 通信・型変換）
│   ├── user.ts                    # フロントエンド共通の User 型（camelCase）
│   ├── list-users-api.service.ts
│   ├── fetch-user-api.service.ts
│   ├── create-user-api.service.ts
│   └── update-user-api.service.ts
├── pages/                         # ページ単位で Component + Usecase をペア化
│   ├── user-list/                 # 一覧（signal 完結型）
│   ├── user-detail/               # 詳細（signal 完結型）
│   ├── user-create/               # 追加（Observable 返却型）
│   └── user-edit/                 # 編集（Observable 返却型）
├── app.config.ts                  # provideHttpClient / provideRouter
├── app.routes.ts                  # /users, /users/new, /users/:id, /users/:id/edit
└── app.{ts,html,css}              # ルートコンポーネント

backend/src/
├── data/users.ts                  # in-memory のユーザー保管庫
├── routes/user.ts                 # /api/{list_users,fetch_user,create_user,update_user}
└── server.ts                      # Express エントリポイント
```

## 実装済み機能

User の CRUD のうち削除を除く 4 ページ。

| ルート | コンポーネント | 役割 |
| --- | --- | --- |
| `/users` | `UserListComponent` | ユーザー一覧。各行クリックで詳細に遷移 |
| `/users/new` | `UserCreateComponent` | フォームで追加。成功時に詳細へ遷移 |
| `/users/:id` | `UserDetailComponent` | ユーザー詳細。編集 / 一覧へのリンク |
| `/users/:id/edit` | `UserEditComponent` | フォームで編集。成功時に詳細へ遷移 |

## バックエンド API

ベース URL: `http://localhost:63000/api`

| メソッド | パス | 用途 |
| --- | --- | --- |
| `GET` | `/list_users/` | ユーザー一覧取得 |
| `GET` | `/fetch_user/?id=:id` | ユーザー 1 件取得 |
| `POST` | `/create_user/` | ユーザー作成（id を返す） |
| `PUT` | `/update_user/` | ユーザー更新 |
| `GET` | `/health` | ヘルスチェック |

レスポンス / リクエストは snake_case。フロントエンドへの camelCase 変換は API Service 内で行う（[tmp/three-tier-architecture.md](./tmp/three-tier-architecture.md) 参照）。

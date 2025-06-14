# Daily Standup Frontend

デイリースタンドアップアプリケーションのフロントエンド

## 環境設定

### 1. 環境変数ファイルの作成

プロジェクトルートに `.env` ファイルを作成し、以下の内容を設定してください：

```env
# バックエンドAPIの接続先
VITE_API_BASE_URL=http://localhost:3001/api

# 環境設定
VITE_ENV=development

# その他の設定
VITE_APP_NAME=Daily Standup
VITE_APP_VERSION=1.0.0
```

### 2. 環境変数の説明

| 変数名 | 説明 | デフォルト値 |
|--------|------|-------------|
| `VITE_API_BASE_URL` | バックエンドAPIのベースURL | `http://localhost:3001/api` |
| `VITE_ENV` | 実行環境（development/production） | `development` |
| `VITE_APP_NAME` | アプリケーション名 | `Daily Standup` |
| `VITE_APP_VERSION` | アプリケーションバージョン | `1.0.0` |

## 開発環境のセットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

### 3. Storybookの起動

```bash
npm run storybook
```

Storybookが起動すると、ブラウザで `http://localhost:6006` にアクセスしてコンポーネントの開発・確認ができます。

### 4. ビルド

```bash
npm run build
```

## 機能

- **ログイン/ログアウト**: JWTトークンベースの認証
- **ダッシュボード**: プロジェクトの概要と統計情報
- **デイリーレポート**: 日次レポートの作成・管理
- **カレンダー**: 日付選択機能
- **レスポンシブデザイン**: モバイル・デスクトップ対応

## 技術スタック

- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Vite**: ビルドツール
- **Storybook**: コンポーネント開発

## Storybook

このプロジェクトでは、コンポーネントの開発・テスト・ドキュメント化のためにStorybookを使用しています。

### Storybookの利点

- **コンポーネントの独立した開発**: アプリケーション全体を起動せずにコンポーネントを開発
- **インタラクティブなテスト**: コンポーネントの様々な状態を確認
- **ドキュメント化**: コンポーネントの使用方法とプロパティを自動生成
- **視覚的なテスト**: コンポーネントの見た目の変更を即座に確認

### 利用可能なストーリー

- `Button.stories.ts` - ボタンコンポーネント
- `Header.stories.ts` - ヘッダーコンポーネント
- `Page.stories.ts` - ページコンポーネント

### Storybookの使用方法

1. `npm run storybook` でStorybookを起動
2. ブラウザで `http://localhost:6006` にアクセス
3. 左側のサイドバーからコンポーネントを選択
4. 右側のパネルでプロパティを変更して動作を確認

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Dashboard.tsx    # ダッシュボード
│   ├── DailyReport.tsx  # デイリーレポート
│   ├── Layout.tsx       # レイアウト
│   ├── Login.tsx        # ログイン画面
│   └── Sidebar.tsx      # サイドバー
├── config/              # 設定ファイル
│   └── index.ts         # 環境変数管理
├── services/            # APIサービス
│   └── api.ts           # APIクライアント
└── App.tsx              # メインアプリケーション
```

## API仕様

### 認証エンドポイント

- `POST /auth/login` - ログイン
- `POST /auth/logout` - ログアウト
- `GET /auth/me` - 現在のユーザー情報
- `POST /auth/refresh` - トークンリフレッシュ

### デイリーレポートエンドポイント

- `GET /daily-reports` - レポート一覧取得
- `POST /daily-reports` - レポート作成
- `PUT /daily-reports/:id` - レポート更新
- `DELETE /daily-reports/:id` - レポート削除

### ダッシュボードエンドポイント

- `GET /dashboard` - ダッシュボードデータ取得
- `GET /dashboard/stats` - 統計データ取得

## 開発者向け情報

### 環境変数の追加

新しい環境変数を追加する場合は、以下の手順で行ってください：

1. `src/config/index.ts` に新しい設定を追加
2. `.env` ファイルに変数を追加
3. TypeScriptの型定義を更新（必要に応じて）

### APIクライアントの拡張

新しいAPIエンドポイントを追加する場合は、`src/services/api.ts` に新しい関数を追加してください。

## ライセンス

© 2025 Universal Micro Networks Co., Ltd.

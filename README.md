# Daily Standup Frontend

最新のReact、TypeScript、Tailwind CSS、Storybookを使用したフロントエンドプロジェクトです。

## 🚀 技術スタック

- **React 19.1.0** - 最新のReactライブラリ
- **TypeScript 5.8.3** - 型安全な開発
- **Vite 6.3.5** - 高速なビルドツール
- **Tailwind CSS 4.1.10** - ユーティリティファーストCSSフレームワーク
- **Storybook 9.0.8** - コンポーネント開発環境
- **Vitest 3.2.3** - テストフレームワーク
- **ESLint** - コード品質管理

## 📦 インストール

```bash
npm install
```

## 🏃‍♂️ 実行方法

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動し、通常は `http://localhost:5173` でアクセスできます。

### プロダクションビルド

```bash
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

### ビルド結果のプレビュー

```bash
npm run preview
```

ビルドされたアプリケーションをローカルでプレビューできます。

## 🧪 テストの実行

### テストの実行

```bash
npm test
```

### テストの監視モード

```bash
npm run test:watch
```

### カバレッジレポートの生成

```bash
npm run test:coverage
```

## 📚 Storybook

### Storybookの起動

```bash
npm run storybook
```

Storybookが起動し、通常は `http://localhost:6006` でアクセスできます。

### Storybookのビルド

```bash
npm run build-storybook
```

静的ファイルとしてStorybookをビルドします。

## 🔧 開発ツール

### コードの品質チェック

```bash
npm run lint
```

ESLintを使用してコードの品質をチェックします。

### 型チェック

```bash
npx tsc --noEmit
```

TypeScriptの型チェックを実行します。

## 📁 プロジェクト構造

```
daily-standup-frontend/
├── src/                    # ソースコード
│   ├── components/         # Reactコンポーネント
│   ├── stories/           # Storybookストーリー
│   ├── App.tsx           # メインアプリケーション
│   ├── main.tsx          # エントリーポイント
│   └── index.css         # グローバルスタイル
├── public/                # 静的ファイル
├── .storybook/           # Storybook設定
├── tailwind.config.js    # Tailwind CSS設定
├── postcss.config.js     # PostCSS設定
├── vite.config.ts        # Vite設定
└── package.json          # 依存関係とスクリプト
```

## 🎨 Tailwind CSS

このプロジェクトではTailwind CSSを使用しています。カスタムスタイルを追加する場合は、`tailwind.config.js`を編集してください。

## 📝 開発のベストプラクティス

1. **コンポーネント開発**: 新しいコンポーネントを作成する際は、必ずStorybookストーリーも作成してください
2. **型安全性**: TypeScriptの型定義を適切に行い、`any`型の使用を避けてください
3. **レスポンシブデザイン**: Tailwind CSSのレスポンシブクラスを活用してください
4. **テスト**: 新しい機能を追加する際は、対応するテストも作成してください

## 🤝 コントリビューション

1. このリポジトリをフォークしてください
2. 機能ブランチを作成してください (`git checkout -b feature/amazing-feature`)
3. 変更をコミットしてください (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュしてください (`git push origin feature/amazing-feature`)
5. プルリクエストを作成してください

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

# Daily Standup Frontend

チームの日次スタンドアップミーティングを効率化するためのWebアプリケーションです。

## 🚀 主な機能

- **デイリーレポート管理**: チームメンバーの日次報告の一覧表示・編集
- **チーム管理**: メンバー一覧表示・検索・招待機能
- **認証システム**: ユーザーログイン・セッション管理
- **モダンなUI**: macOS風デザイン・レスポンシブ対応

## 🛠️ 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: React Context API
- **ドキュメント**: Storybook (自動化されたドキュメント生成)

## 📦 インストール

```bash
npm install
```

## 🚀 開発サーバーの起動

```bash
npm run dev
```

## 📚 Storybook (自動化されたドキュメント)

Storybookは自動化されたドキュメント生成システムとして設定されており、以下の機能を提供します：

### 自動ドキュメント生成機能

- **コンポーネントの自動解析**: TypeScript型定義から自動的にプロパティ情報を抽出
- **インタラクティブなドキュメント**: リアルタイムでコンポーネントを操作可能
- **レスポンシブプレビュー**: モバイル・タブレット・デスクトップでの表示確認
- **アクセシビリティチェック**: 自動的なアクセシビリティ検証
- **視覚的回帰テスト**: Chromaticによる自動テスト

### Storybookの起動

```bash
npm run storybook
```

### ドキュメントの構成

1. **Introduction**: プロジェクト概要・技術スタック・セットアップ方法
2. **Components**: 各コンポーネントの詳細ドキュメント
   - プロパティ一覧（自動生成）
   - 使用例
   - インタラクティブなプレビュー
3. **Examples**: 実装例・ベストプラクティス
4. **自動生成ドキュメント**: コンポーネントの型定義から自動生成

### 自動ドキュメント生成の利点

- **常に最新**: コード変更に自動で同期
- **型安全性**: TypeScript型定義から正確な情報を抽出
- **開発効率**: 手動でのドキュメント更新が不要
- **品質向上**: 自動的なアクセシビリティ・パフォーマンスチェック

### カスタムドキュメントの追加

新しいコンポーネントのドキュメントを追加する場合：

```tsx
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Component from './Component';

const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'コンポーネントの説明',
      },
    },
  },
  argTypes: {
    // プロパティの詳細設定
  },
  tags: ['autodocs'], // 自動ドキュメント生成を有効化
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // デフォルトプロパティ
  },
};
```

## 🏗️ ビルド

```bash
npm run build
```

## 🧪 テスト

```bash
npm run test
```

## 📁 プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── *.tsx           # コンポーネントファイル
│   └── *.stories.tsx   # Storybookストーリー（自動ドキュメント）
├── contexts/           # React Context
├── services/           # APIサービス
├── types/              # TypeScript型定義
├── config/             # 設定ファイル
├── utils/              # ユーティリティ関数
└── stories/            # Storybookドキュメント
    ├── Introduction.mdx # プロジェクト概要
    └── Examples.mdx    # 使用例・ベストプラクティス
```

## 🔧 設定ファイル

- **Storybook設定**: `.storybook/main.ts` - 自動ドキュメント生成の設定
- **プレビュー設定**: `.storybook/preview.ts` - ドキュメント表示の設定
- **Vite設定**: `vite.config.ts` - ビルド設定
- **TypeScript設定**: `tsconfig.json` - 型チェック設定

## 🤝 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🔗 関連リンク

- [Storybook公式ドキュメント](https://storybook.js.org/)
- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/)

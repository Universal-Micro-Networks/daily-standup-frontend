import type { Meta, StoryObj } from '@storybook/react';
import DailyReportForm from './DailyReportForm';

const meta: Meta<typeof DailyReportForm> = {
  title: 'Components/DailyReportForm',
  component: DailyReportForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# デイリーレポート入力フォーム

デイリーレポートの入力・編集フォームコンポーネントです。ユーザーは「昨日やったこと」「今日やること」「困っていること」を入力できます。

## テキストエリアのスペック

### 昨日やったこと（必須）
- **高さ**: 128px (h-32)
- **幅**: 親要素の100% (w-full)
- **パディング**: 左右12px、上下8px (px-3 py-2)
- **ボーダー**: グレー (border-gray-300)
- **角丸**: 8px (rounded-lg)
- **フォーカス時**: 青いリング (focus:ring-blue-500)
- **リサイズ**: 不可 (resize-none)
- **プレースホルダー**: "昨日完了したタスクを入力してください"

### 今日やること（必須）
- **高さ**: 128px (h-32)
- **幅**: 親要素の100% (w-full)
- **パディング**: 左右12px、上下8px (px-3 py-2)
- **ボーダー**: グレー (border-gray-300)
- **角丸**: 8px (rounded-lg)
- **フォーカス時**: 青いリング (focus:ring-blue-500)
- **リサイズ**: 不可 (resize-none)
- **プレースホルダー**: "今日予定しているタスクを入力してください"
- **特殊機能**: 昨日やったことをコピーするボタン

### 困っていること・ボトルネック（任意）
- **高さ**: 96px (h-24) - 他の2つより小さい
- **幅**: 親要素の100% (w-full)
- **パディング**: 左右12px、上下8px (px-3 py-2)
- **ボーダー**: グレー (border-gray-300)
- **角丸**: 8px (rounded-lg)
- **フォーカス時**: 青いリング (focus:ring-blue-500)
- **リサイズ**: 不可 (resize-none)
- **プレースホルダー**: "困っていることやブロックしている問題があれば入力してください"
        `,
      },
    },
  },
  argTypes: {
    isEditing: {
      control: 'boolean',
      description: '編集モードかどうか',
    },
    initialData: {
      control: 'object',
      description: 'フォームの初期データ',
    },
    currentReport: {
      control: 'object',
      description: '現在のレポート内容（編集モード時）',
    },
    onSubmit: {
      action: 'form submitted',
      description: 'フォーム送信時のコールバック関数',
    },
    onClose: {
      action: 'form closed',
      description: 'フォームを閉じる時のコールバック関数',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isEditing: false,
    initialData: {
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'デフォルトの入力フォームです。すべてのテキストエリアが空の状態で表示されます。',
      },
    },
  },
};

export const TextAreaSpecs: Story = {
  args: {
    isEditing: false,
    initialData: {
      yesterdayWork: '• ユーザー認証機能の実装\n• APIエンドポイントの設計\n• データベーススキーマの更新\n• パスワードリセット機能の実装\n• ユニットテストの作成',
      todayWork: '• フロントエンドの実装\n• テストの作成\n• ドキュメントの更新\n• コードレビューの実施',
      blockingIssues: '外部APIの仕様確認が必要\nセキュリティ要件の詳細確認待ち'
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## テキストエリアのスペック詳細表示

このストーリーでは、各テキストエリアの実際のサイズとスタイリングを確認できます。

### 昨日やったこと（128px高さ）
- 複数行のテキストが表示され、スクロール可能
- 必須項目として赤いアスタリスク（*）が表示
- フォーカス時に青いリングが表示

### 今日やること（128px高さ）
- コピーボタンが右上に配置
- 昨日やったことをコピーする機能
- 必須項目として赤いアスタリスク（*）が表示

### 困っていること・ボトルネック（96px高さ）
- 他の2つより小さい高さ
- 任意入力項目（アスタリスクなし）
- 短いテキストでも適切に表示
        `,
      },
    },
  },
};

export const WithInitialData: Story = {
  args: {
    isEditing: false,
    initialData: {
      yesterdayWork: 'ユーザー認証機能の実装\nAPIエンドポイントの設計',
      todayWork: 'フロントエンドの実装\nテストの作成',
      blockingIssues: '外部APIの仕様確認が必要'
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '初期データが設定された状態のフォームです。各テキストエリアの表示状態を確認できます。',
      },
    },
  },
};

export const EditMode: Story = {
  args: {
    isEditing: true,
    initialData: {
      yesterdayWork: 'ユーザー認証機能の実装\nAPIエンドポイントの設計',
      todayWork: 'フロントエンドの実装\nテストの作成',
      blockingIssues: '外部APIの仕様確認が必要'
    },
    currentReport: {
      yesterdayWork: 'ユーザー認証機能の実装\nAPIエンドポイントの設計',
      todayWork: 'フロントエンドの実装\nテストの作成',
      blockingIssues: '外部APIの仕様確認が必要'
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '編集モードのフォームです。現在のレポート内容が表示され、更新できます。',
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    isEditing: false,
    initialData: {
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
## 空の状態でのテキストエリア表示

すべてのテキストエリアが空の状態で、プレースホルダーテキストが表示されます。

### プレースホルダーテキスト
- **昨日やったこと**: "昨日完了したタスクを入力してください"
- **今日やること**: "今日予定しているタスクを入力してください"
- **困っていること・ボトルネック**: "困っていることやブロックしている問題があれば入力してください"

### 必須項目の表示
- 昨日やったことと今日やることには赤いアスタリスク（*）が表示
- 困っていること・ボトルネックは任意項目のためアスタリスクなし
        `,
      },
    },
  },
};

export const WithError: Story = {
  args: {
    isEditing: false,
    initialData: {
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    },
    onSubmit: (data) => {
      console.log('Form submitted:', data);
      throw new Error('送信に失敗しました');
    },
    onClose: () => {
      console.log('Form closed');
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'エラー状態のフォームです。送信時にエラーが発生し、エラーメッセージが表示されます。',
      },
    },
  },
};

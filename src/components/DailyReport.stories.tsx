import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import DailyReport from './DailyReport';

const meta: Meta<typeof DailyReport> = {
  title: 'Components/DailyReport',
  component: DailyReport,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'デイリースタンドアップレポートを表示・編集するコンポーネントです。チームメンバーの日次報告を一覧表示し、ユーザーは自分のレポートを入力・編集できます。',
      },
    },
  },
  argTypes: {
    sidebarOpen: {
      control: 'boolean',
      description: 'サイドバーの開閉状態',
    },
    selectedDate: {
      control: 'date',
      description: '表示するレポートの日付',
    },
    onToggleSidebar: {
      action: 'sidebar toggled',
      description: 'サイドバーの開閉を切り替えるコールバック関数',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarOpen: false,
    selectedDate: new Date(),
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
};

export const WithSidebarOpen: Story = {
  args: {
    sidebarOpen: true,
    selectedDate: new Date(),
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
};

export const WithCustomDate: Story = {
  args: {
    sidebarOpen: false,
    selectedDate: new Date('2024-01-15'),
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
};

export const WithInputPanelOpen: Story = {
  args: {
    sidebarOpen: false,
    selectedDate: new Date(),
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
  parameters: {
    docs: {
      description: {
        story: 'デイリーレポート入力スライドペインが開いた状態です。ユーザーは「昨日やったこと」「今日やること」「困っていること」を入力できます。',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // スライドペインを開くボタンをクリック
    const canvas = within(canvasElement);
    const addButton = canvas.getByRole('button', { name: /＋/ });
    await userEvent.click(addButton);
  },
};

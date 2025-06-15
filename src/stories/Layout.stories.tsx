import type { Meta, StoryObj } from '@storybook/react';
import Layout from '../components/Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'アプリケーションのメインレイアウトコンポーネントです。サイドバーとメインコンテンツエリアを管理します。',
      },
    },
  },
  argTypes: {
    initialSidebarOpen: {
      control: 'boolean',
      description: 'サイドバーの初期開閉状態',
    },
    onLogout: {
      action: 'logout',
      description: 'ログアウト時のコールバック関数',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialSidebarOpen: true,
  },
};

export const WithSidebarClosed: Story = {
  args: {
    initialSidebarOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'サイドバーが閉じた状態のレイアウト',
      },
    },
  },
};

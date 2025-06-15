import type { Meta, StoryObj } from '@storybook/react';
import Team from './Team';

const meta: Meta<typeof Team> = {
  title: 'Components/Team',
  component: Team,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'チームメンバー管理コンポーネントです。チームメンバーの一覧表示、検索、招待機能を提供します。',
      },
    },
  },
  argTypes: {
    sidebarOpen: {
      control: 'boolean',
      description: 'サイドバーの開閉状態',
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
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
};

export const WithSidebarOpen: Story = {
  args: {
    sidebarOpen: true,
    onToggleSidebar: () => console.log('Sidebar toggled'),
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import Layout from '../components/Layout';

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSidebarClosed: Story = {
  parameters: {
    docs: {
      description: {
        story: 'サイドバーが閉じた状態のレイアウト',
      },
    },
  },
};

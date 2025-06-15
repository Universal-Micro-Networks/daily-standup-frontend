import type { Meta, StoryObj } from '@storybook/react';
import { AuthProvider } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'ユーザーログインフォームコンポーネントです。ユーザー名とパスワードによる認証機能を提供します。',
      },
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'エラー状態のログインフォームの例です。',
      },
    },
  },
};

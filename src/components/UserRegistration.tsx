import React, { useState } from 'react';
import { userAPI } from '../services/api';
import { useTranslation } from '../utils/i18n';
import { getCurrentTheme, setTheme, type Theme } from '../utils/theme';

interface UserRegistrationProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const UserRegistration: React.FC<UserRegistrationProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();

  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 設定情報の状態
  const [settings, setSettings] = useState({
    theme: getCurrentTheme(),
    language: 'ja' as const
  });

  // エラー状態
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserInfoChange = (key: string, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [key]: value
    }));
    // エラーをクリア
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: ''
      }));
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // テーマが変更された場合、即座に適用
    if (key === 'theme') {
      setTheme(value as Theme);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // 名前のバリデーション
    if (!userInfo.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    // メールアドレスのバリデーション
    if (!userInfo.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // パスワードのバリデーション
    if (!userInfo.password) {
      newErrors.password = 'パスワードは必須です';
    } else if (userInfo.password.length < 8) {
      newErrors.password = 'パスワードは8文字以上で入力してください';
    }

    // パスワード確認のバリデーション
    if (!userInfo.confirmPassword) {
      newErrors.confirmPassword = 'パスワードの確認は必須です';
    } else if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // ユーザー登録APIを呼び出し
      await userAPI.registerUser({
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
        settings: settings
      });

      console.log('User registration successful');

      // 成功時のコールバック
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to register user:', error);
      // エラーメッセージを表示
      setErrors(prev => ({
        ...prev,
        general: 'ユーザー登録に失敗しました。'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/daily_standup_icon.svg"
              alt="Daily Standup"
              className="w-12 h-12 mr-3"
            />
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Daily Standup</h1>
          </div>
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">ユーザー登録</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            アカウント情報を入力してください
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* エラーメッセージ表示 */}
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          {/* ユーザー情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">ユーザー情報</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="名前を入力してください"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => handleUserInfoChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="メールアドレスを入力してください"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={userInfo.password}
                onChange={(e) => handleUserInfoChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="パスワードを入力してください（8文字以上）"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                パスワード確認 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={userInfo.confirmPassword}
                onChange={(e) => handleUserInfoChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  errors.confirmPassword ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="パスワードを再入力してください"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* 設定情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">設定</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                テーマ
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="light">ライト</option>
                <option value="dark">ダーク</option>
                <option value="auto">自動（システム設定）</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                言語
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="it">Italiano</option>
                <option value="zh-cn">简体中文</option>
                <option value="zh-tw">繁體中文</option>
                <option value="et">Eesti</option>
              </select>
            </div>
          </div>

          {/* ボタン */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white'
              }`}
            >
              {isSubmitting ? '登録中...' : '登録'}
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                キャンセル
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;

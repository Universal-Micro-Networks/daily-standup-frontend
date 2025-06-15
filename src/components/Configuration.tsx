import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { getCurrentLanguage, setLanguage, useTranslation, type SupportedLanguage } from '../utils/i18n';
import { getCurrentTheme, setTheme, type Theme } from '../utils/theme';

interface ConfigurationProps {
  onClose: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onClose }) => {
  const { t } = useTranslation();

  const [settings, setSettings] = useState({
    notifications: true,
    theme: getCurrentTheme(),
    language: getCurrentLanguage()
  });

  // ユーザー情報の状態
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });

  // 元のユーザー情報を保持（変更検出用）
  const [originalUserInfo, setOriginalUserInfo] = useState({
    name: '',
    email: ''
  });

  // パスワード変更の状態
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 表示状態の管理
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showUserInfoChange, setShowUserInfoChange] = useState(false);

  // エラー状態
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // テーマが変更された場合、即座に適用
    if (key === 'theme') {
      setTheme(value as Theme);
    }

    // 言語が変更された場合、即座に適用
    if (key === 'language') {
      setLanguage(value as SupportedLanguage);
    }
  };

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

  const handlePasswordChange = (key: string, value: string) => {
    setPasswordChange(prev => ({
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

  const validateUserInfo = () => {
    const newErrors: {[key: string]: string} = {};

    if (!userInfo.name.trim()) {
      newErrors.name = t('configuration.validation.nameRequired');
    }

    if (!userInfo.email.trim()) {
      newErrors.email = t('configuration.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
      newErrors.email = t('configuration.validation.invalidEmail');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors: {[key: string]: string} = {};

    if (!passwordChange.currentPassword) {
      newErrors.currentPassword = t('configuration.validation.currentPasswordRequired');
    }

    if (!passwordChange.newPassword) {
      newErrors.newPassword = t('configuration.validation.newPasswordRequired');
    } else if (passwordChange.newPassword.length < 8) {
      newErrors.newPassword = t('configuration.validation.passwordMinLength');
    }

    if (!passwordChange.confirmPassword) {
      newErrors.confirmPassword = t('configuration.validation.confirmPasswordRequired');
    } else if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      newErrors.confirmPassword = t('configuration.validation.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUserInfo = async () => {
    if (!validateUserInfo()) return;

    setIsSubmitting(true);
    try {
      // 名前が変更された場合のみ更新
      if (userInfo.name !== originalUserInfo.name) {
        await userAPI.updateUserName({
          name: userInfo.name
        });
        console.log('User name updated successfully');

        // 元のユーザー情報を更新（名前のみ）
        setOriginalUserInfo(prev => ({
          ...prev,
          name: userInfo.name
        }));
      }

      setShowUserInfoChange(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to update user info:', error);
      // エラーメッセージを表示
      setErrors(prev => ({
        ...prev,
        general: 'ユーザー情報の更新に失敗しました。'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePassword = async () => {
    if (!validatePasswordChange()) return;

    setIsSubmitting(true);
    try {
      // バックエンドAPIを呼び出し
      await userAPI.changePassword({
        new_password: passwordChange.newPassword,
        confirm_password: passwordChange.confirmPassword
      });

      console.log('Password changed successfully');
      setShowPasswordChange(false);
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to change password:', error);
      // エラーメッセージを表示
      setErrors(prev => ({
        ...prev,
        general: 'パスワードの変更に失敗しました。'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSettings = () => {
    // 設定を保存する処理
    console.log('Settings saved:', settings);

    // 言語が変更された場合、ページをリロードして変更を反映
    if (settings.language !== getCurrentLanguage()) {
      window.location.reload();
    }

    onClose();
  };

  useEffect(() => {
    // コンポーネントマウント時にユーザー情報を取得
    const fetchUserInfo = async () => {
      try {
        const response = await userAPI.getUserInfo();
        setUserInfo(response);
        setOriginalUserInfo(response);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{t('configuration.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 設定内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* ユーザー情報 */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('configuration.userInfo')}</h3>
                <button
                  onClick={() => setShowUserInfoChange(!showUserInfoChange)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  {showUserInfoChange ? t('configuration.cancel') : t('configuration.edit')}
                </button>
              </div>

              {showUserInfoChange ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('configuration.name')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => handleUserInfoChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('configuration.placeholders.name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('configuration.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => handleUserInfoChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                        errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={t('configuration.placeholders.email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* エラーメッセージ表示 */}
                  {errors.general && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveUserInfo}
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isSubmitting ? t('configuration.saving') : t('configuration.save')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserInfoChange(false);
                        setErrors({});
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {t('configuration.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {isLoadingUserInfo ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">読み込み中...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('configuration.name')}:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t('configuration.email')}:</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{userInfo.email}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* パスワード変更 */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">{t('configuration.passwordChange')}</h3>
                <button
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showPasswordChange ? t('configuration.cancel') : t('configuration.change')}
                </button>
              </div>

              {showPasswordChange && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('configuration.currentPassword')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordChange.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t('configuration.placeholders.currentPassword')}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('configuration.newPassword')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordChange.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t('configuration.placeholders.newPassword')}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('configuration.confirmPassword')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={passwordChange.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t('configuration.placeholders.confirmPassword')}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* エラーメッセージ表示 */}
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSavePassword}
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isSubmitting
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSubmitting ? t('configuration.changing') : t('configuration.passwordChangeButton')}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordChange({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setErrors({});
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {t('configuration.cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 通知設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('configuration.notifications')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{t('configuration.dailyReportNotifications')}</p>
                  <p className="text-sm text-gray-500">{t('configuration.notificationDescription')}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* テーマ設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('configuration.theme')}</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('configuration.themeLabel')}</p>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">{t('configuration.light')}</option>
                  <option value="dark">{t('configuration.dark')}</option>
                  <option value="auto">{t('configuration.auto')}</option>
                </select>
              </div>
            </div>

            {/* 言語設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('configuration.language')}</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('configuration.languageLabel')}</p>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <p className="text-xs text-gray-500 mt-1">
                  {t('configuration.languageChangeNote')}
                </p>
              </div>
            </div>

            {/* アプリケーション情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">{t('configuration.appInfo')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{t('configuration.version')}: 1.0.0</p>
                <p>{t('configuration.lastUpdate')}: 2024年1月</p>
                <p>{t('configuration.license')}: MIT License</p>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {t('configuration.close')}
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('configuration.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;

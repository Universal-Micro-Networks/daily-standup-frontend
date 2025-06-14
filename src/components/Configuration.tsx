import React, { useState } from 'react';

interface ConfigurationProps {
  onClose: () => void;
}

const Configuration: React.FC<ConfigurationProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    theme: 'light',
    language: 'ja'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">設定</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 設定内容 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* 通知設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">通知設定</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">デイリーレポートの通知</p>
                  <p className="text-sm text-gray-500">レポートの提出期限や更新を通知します</p>
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

            {/* 自動保存設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">自動保存設定</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">自動保存</p>
                  <p className="text-sm text-gray-500">レポートの入力内容を自動的に保存します</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* テーマ設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">テーマ設定</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">テーマ</p>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">ライト</option>
                  <option value="dark">ダーク</option>
                  <option value="auto">自動</option>
                </select>
              </div>
            </div>

            {/* 言語設定 */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">言語設定</h3>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">言語</p>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* アプリケーション情報 */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">アプリケーション情報</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>バージョン: 1.0.0</p>
                <p>最終更新: 2024年1月</p>
                <p>ライセンス: MIT License</p>
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
            キャンセル
          </button>
          <button
            onClick={() => {
              // 設定を保存する処理
              console.log('Settings saved:', settings);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Configuration;

import React, { useState } from 'react';

interface DailyReportProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

interface ReportData {
  id: number;
  memberName: string;
  yesterdayWork: string;
  todayWork: string;
  blockingIssues: string;
  status: 'completed' | 'in-progress' | 'blocked';
}

const DailyReport: React.FC<DailyReportProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData] = useState({
    yesterdayWork: '',
    todayWork: '',
    blockingIssues: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // ここでフォームデータを処理
    console.log('Submit:', formData);
    // フォームをリセット
    setFormData({
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    });
    setIsPanelOpen(false);
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setFormData({
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    });
  };

  const handleCopyYesterdayToToday = () => {
    setFormData(prev => ({
      ...prev,
      todayWork: prev.yesterdayWork
    }));
  };

  const [recentTasks, setRecentTasks] = useState([
    'ユーザー認証機能の実装',
    'APIエンドポイントの設計',
    'データベーススキーマの更新',
    'パスワードリセット機能の実装',
    'ユニットテストの作成'
  ]);

  const [frequentTasks, setFrequentTasks] = useState([
    'コードレビューの実施',
    'ドキュメントの更新',
    'バグ修正の対応'
  ]);

  const removeTask = (taskToRemove: string) => {
    setRecentTasks(prev => prev.filter(task => task !== taskToRemove));
  };

  const removeFrequentTask = (taskToRemove: string) => {
    setFrequentTasks(prev => prev.filter(task => task !== taskToRemove));
  };

  const reportData: ReportData[] = [
    {
      id: 1,
      memberName: '田中太郎',
      yesterdayWork: 'ユーザー認証機能の実装\nAPIエンドポイントの設計\nデータベーススキーマの更新',
      todayWork: 'パスワードリセット機能の実装\nユニットテストの作成\nセキュリティレビューの実施',
      blockingIssues: 'なし',
      status: 'completed'
    },
    {
      id: 2,
      memberName: '佐藤花子',
      yesterdayWork: 'データベース設計の見直し\nER図の更新\nパフォーマンス分析の実行',
      todayWork: 'マイグレーションスクリプトの作成\nパフォーマンステスト\nインデックス最適化',
      blockingIssues: '外部APIのレスポンスが遅い',
      status: 'in-progress'
    },
    {
      id: 3,
      memberName: '鈴木一郎',
      yesterdayWork: 'フロントエンドコンポーネントのリファクタリング\nUIライブラリの更新\nレスポンシブデザインの調整',
      todayWork: '新機能のUI実装\nレスポンシブデザインの調整\nブラウザ互換性テスト',
      blockingIssues: 'デザインシステムの更新が必要',
      status: 'in-progress'
    },
    {
      id: 4,
      memberName: '高橋美咲',
      yesterdayWork: 'QAテストの実行\nバグレポートの作成\nテストケースの更新',
      todayWork: '回帰テストの実行\nテストケースの更新\nテスト環境の設定確認',
      blockingIssues: 'テスト環境の設定に問題あり',
      status: 'blocked'
    },
    {
      id: 5,
      memberName: '伊藤健太',
      yesterdayWork: 'プロジェクト管理ツールの設定\nタスクの整理\nチームミーティングの実施',
      todayWork: 'スプリント計画の策定\nチームミーティングの実施\n進捗報告書の作成',
      blockingIssues: 'なし',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'in-progress':
        return '進行中';
      case 'blocked':
        return 'ブロック';
      default:
        return '不明';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ヘッダー */}
      <header className="mac-header">
        <div className="flex items-center px-6 py-1 h-15">
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 mac-button"
              aria-label={sidebarOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {sidebarOpen ? (
                // 左向き矢印（メニューが開いている時）
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                // ハンバーガーメニュー（メニューが閉じている時）
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mac-text-shadow">デイリーレポート</h2>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-6 mac-scrollbar w-full">
        {/* レポートテーブル */}
        <div className="mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full">
          {/* デスクトップ表示 */}
          <div className="hidden lg:block overflow-x-auto w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 bg-gray-50/50">メンバー名</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 bg-gray-50/50">昨日やったこと</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 bg-gray-50/50">今日やること</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 bg-gray-50/50">困っていること・ボトルネック</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{item.memberName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {item.yesterdayWork.split('\n').map((work, index) => (
                          <div key={index} className="flex items-start mb-1">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>{work}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {item.todayWork.split('\n').map((work, index) => (
                          <div key={index} className="flex items-start mb-1">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>{work}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {item.blockingIssues === 'なし' ? (
                          <span className="text-green-600">なし</span>
                        ) : (
                          <span className="text-red-600">{item.blockingIssues}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* モバイル表示 */}
          <div className="lg:hidden space-y-4">
            {reportData.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{item.memberName}</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">昨日やったこと:</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.yesterdayWork.split('\n').map((work, index) => (
                        <div key={index} className="flex items-start mb-1">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{work}</span>
                        </div>
                      ))}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">今日やること:</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.todayWork.split('\n').map((work, index) => (
                        <div key={index} className="flex items-start mb-1">
                          <span className="text-gray-400 mr-2">•</span>
                          <span>{work}</span>
                        </div>
                      ))}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">困っていること・ボトルネック:</h5>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.blockingIssues === 'なし' ? (
                        <span className="text-green-600">なし</span>
                      ) : (
                        <span className="text-red-600">{item.blockingIssues}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* フローティングボタン */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-2xl font-bold z-50"
      >
        ＋
      </button>

      {/* スライドパネル */}
      {/* パネル */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">デイリーレポート入力</h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* フォーム */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* 昨日やったこと */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  昨日やったこと
                </label>
                <textarea
                  value={formData.yesterdayWork}
                  onChange={(e) => handleInputChange('yesterdayWork', e.target.value)}
                  className="w-80 h-32 px-1 py-0.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="昨日完了したタスクを入力してください"
                />
              </div>

              {/* 今日やること */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    今日やること
                  </label>
                  <button
                    onClick={handleCopyYesterdayToToday}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="昨日やったことをコピー"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={formData.todayWork}
                  onChange={(e) => handleInputChange('todayWork', e.target.value)}
                  className="w-80 h-32 px-1 py-0.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="今日予定しているタスクを入力してください"
                />
              </div>

              {/* 困っていること・ボトルネック */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  困っていること・ボトルネック
                </label>
                <textarea
                  value={formData.blockingIssues}
                  onChange={(e) => handleInputChange('blockingIssues', e.target.value)}
                  className="w-80 h-24 px-1 py-0.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="困っていることやブロックしている問題があれば入力してください"
                />
              </div>
            </div>
          </div>

          {/* フッター */}
          <div className="p-6 border-t border-gray-200">
            {/* 頻出タスク一覧 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">頻出タスク一覧</h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {frequentTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                    onClick={() => {
                      const currentTasks = formData.todayWork ? formData.todayWork.split('\n').filter(t => t.trim()) : [];
                      const newTask = task;
                      if (!currentTasks.includes(newTask)) {
                        const updatedTasks = [...currentTasks, newTask];
                        handleInputChange('todayWork', updatedTasks.join('\n'));
                      }
                    }}
                  >
                    <span className="text-sm text-gray-700 truncate">{task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 優先度の高い次のタスク一覧 */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">優先度の高い次のタスク一覧</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recentTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      const currentTasks = formData.todayWork ? formData.todayWork.split('\n').filter(t => t.trim()) : [];
                      const newTask = task;
                      if (!currentTasks.includes(newTask)) {
                        const updatedTasks = [...currentTasks, newTask];
                        handleInputChange('todayWork', updatedTasks.join('\n'));
                      }
                    }}
                  >
                    <span className="text-sm text-gray-700 truncate">{task}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTask(task);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              登録
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;

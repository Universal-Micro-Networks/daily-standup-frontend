import React from 'react';

interface DashboardProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sidebarOpen, onToggleSidebar }) => {
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
            <h2 className="text-2xl font-semibold text-gray-800 mac-text-shadow">ダッシュボード</h2>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-6 mac-scrollbar w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* カード1 */}
          <div className="mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">今日のタスク</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">12</p>
            <p className="text-sm text-gray-500">完了済み: 8/12</p>
          </div>

          {/* カード2 */}
          <div className="mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">チームメンバー</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">8</p>
            <p className="text-sm text-gray-500">オンライン: 6人</p>
          </div>

          {/* カード3 */}
          <div className="mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">プロジェクト進捗</h3>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">75%</p>
            <p className="text-sm text-gray-500">完了予定: 2週間後</p>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="mt-8 mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近のアクティビティ</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              { user: '田中太郎', action: 'タスクを完了しました', time: '5分前', icon: '✅' },
              { user: '佐藤花子', action: '新しいプロジェクトを作成しました', time: '15分前', icon: '📁' },
              { user: '鈴木一郎', action: 'コメントを追加しました', time: '30分前', icon: '💬' },
              { user: '高橋美咲', action: 'ファイルをアップロードしました', time: '1時間前', icon: '📎' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50/80 rounded-lg transition-all duration-200">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    <span className="font-semibold">{activity.user}</span> が {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

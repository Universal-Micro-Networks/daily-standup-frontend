import React, { useEffect, useState } from 'react';
import { authAPI, dailyReportAPI } from '../services/api';

interface DailyReportProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedDate?: Date;
}

interface ReportData {
  id: string;
  memberName?: string;
  yesterdayWork: string;
  todayWork: string;
  blockingIssues: string;
  status?: 'completed' | 'in-progress' | 'blocked';
  report_date?: string;
  yesterday_work?: string;
  today_plan?: string;
  issues?: string;
  user_name?: string;
  user_id?: string;
}

const DailyReport: React.FC<DailyReportProps> = ({ sidebarOpen, onToggleSidebar, selectedDate = new Date() }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userReport, setUserReport] = useState<ReportData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    yesterdayWork: '',
    todayWork: '',
    blockingIssues: ''
  });

  // 日付をYYYY-MM-DD形式にフォーマットする関数
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ユーザーのレポートを検索する関数
  const findUserReport = (reports: ReportData[], userId: string): ReportData | null => {
    console.log('Searching for user report with ID:', userId);
    return reports.find(report => {
      const reportUserId = report.user_id;
      const reportUserIdLower = reportUserId?.toLowerCase();
      const userIdLower = userId?.toLowerCase();

      const isMatch = reportUserId === userId || reportUserIdLower === userIdLower;

      console.log('Comparing report:', {
        reportId: report.id,
        reportUserId,
        searchUserId: userId,
        isMatch,
        hasUserId: !!report.user_id
      });

      return isMatch;
    }) || null;
  };

  // 現在のユーザー情報を取得
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authAPI.getCurrentUser();
        console.log('Current user:', user);
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  // ユーザー情報が取得された後にレポート検索を実行
  useEffect(() => {
    if (currentUser && reportData.length > 0) {
      // ユーザーIDのみを使用
      const userId = currentUser.id || currentUser.user_id;

      console.log('Checking for user report with ID:', userId);
      console.log('Available user fields:', currentUser);
      console.log('Available reports:', reportData.map(r => ({
        id: r.id,
        user_name: r.user_name,
        user_id: r.user_id
      })));

      // ユーザーIDでのみ検索
      const userReport = findUserReport(reportData, userId);

      console.log('Found user report:', userReport);
      setUserReport(userReport);
      setIsEditing(!!userReport);
    }
  }, [currentUser, reportData]);

  // APIレスポンスをReportData形式に変換する関数
  const transformReportData = (apiData: any[]): ReportData[] => {
    return apiData.map(item => ({
      id: item.id,
      memberName: item.user_name || item.memberName || 'メンバー',
      yesterdayWork: item.yesterday_work || item.yesterdayWork || '',
      todayWork: item.today_plan || item.todayWork || '',
      blockingIssues: item.issues || item.blockingIssues || '',
      status: item.status,
      report_date: item.report_date,
      yesterday_work: item.yesterday_work,
      today_plan: item.today_plan,
      issues: item.issues,
      user_name: item.user_name,
      user_id: item.user_id
    }));
  };

  // 選択された日付が変更されたときにデータを取得
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const formattedDate = formatDate(selectedDate);
        const response = await dailyReportAPI.getReports(formattedDate, 100, 0);

        // APIレスポンスからreports配列を取得
        let reports = [];
        if (response && response.reports && Array.isArray(response.reports)) {
          reports = response.reports;
        } else if (Array.isArray(response)) {
          reports = response;
        }

        // データを変換して設定
        const transformedReports = transformReportData(reports);
        setReportData(transformedReports);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('レポートの取得に失敗しました');
        setReportData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [selectedDate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // 必須項目のバリデーション
      const errors: string[] = [];

      if (!formData.yesterdayWork.trim()) {
        errors.push('昨日やったことは必須項目です。');
      }

      if (!formData.todayWork.trim()) {
        errors.push('今日やることは必須項目です。');
      }

      // エラーがある場合はすべて表示
      if (errors.length > 0) {
        setSubmitError(errors.join('\n'));
        errors.forEach(error => {
          console.error(error);
        });
        return;
      }

      if (isEditing && userReport) {
        // 編集モードの場合
        const updateData = {
          yesterday_work: formData.yesterdayWork,
          today_plan: formData.todayWork,
          issues: formData.blockingIssues
        };

        // PUTメソッドでレポートを更新
        await dailyReportAPI.updateReport(userReport.id, updateData);

        // 成功時の処理
        console.log('Report updated successfully:', updateData);
      } else {
        // 新規作成モードの場合
        const createData = {
          report_date: formatDate(selectedDate),
          yesterday_work: formData.yesterdayWork,
          today_plan: formData.todayWork,
          issues: formData.blockingIssues
        };

        // POSTメソッドでレポートを作成
        await dailyReportAPI.createReport(createData);

        // 成功時の処理
        console.log('Report created successfully:', createData);
      }

      // フォームをリセット
      setFormData({
        yesterdayWork: '',
        todayWork: '',
        blockingIssues: ''
      });

      // パネルを閉じる
      setIsPanelOpen(false);
      setIsEditing(false);

      // レポート一覧を再取得
      const formattedDate = formatDate(selectedDate);
      const response = await dailyReportAPI.getReports(formattedDate, 100, 0);

      let reports = [];
      if (response && response.reports && Array.isArray(response.reports)) {
        reports = response.reports;
      } else if (Array.isArray(response)) {
        reports = response;
      }

      const transformedReports = transformReportData(reports);
      setReportData(transformedReports);

    } catch (err) {
      console.error('Failed to submit report:', err);
      setSubmitError(isEditing ? 'レポートの更新に失敗しました。もう一度お試しください。' : 'レポートの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsPanelOpen(false);
    setFormData({
      yesterdayWork: '',
      todayWork: '',
      blockingIssues: ''
    });
  };

  const handleOpenPanel = () => {
    if (isEditing && userReport) {
      // 編集モードの場合、既存のデータをフォームに設定
      setFormData({
        yesterdayWork: userReport.yesterday_work || userReport.yesterdayWork || '',
        todayWork: userReport.today_plan || userReport.todayWork || '',
        blockingIssues: userReport.issues || userReport.blockingIssues || ''
      });
    } else {
      // 新規作成モードの場合、フォームをリセット
      setFormData({
        yesterdayWork: '',
        todayWork: '',
        blockingIssues: ''
      });
    }
    setIsPanelOpen(true);
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
          {/* ローディング状態 */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">データを読み込み中...</p>
              </div>
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => {
                    const formattedDate = formatDate(selectedDate);
                    dailyReportAPI.getReports(formattedDate, 100, 0)
                      .then(setReportData)
                      .catch(err => setError('レポートの取得に失敗しました'));
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  再試行
                </button>
              </div>
            </div>
          )}

          {/* データ表示 */}
          {!isLoading && !error && (
            <>
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
                    {!Array.isArray(reportData) || reportData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          {formatDate(selectedDate)}のレポートはありません
                        </td>
                      </tr>
                    ) : (
                      reportData.map((item) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* モバイル表示 */}
              <div className="lg:hidden space-y-4">
                {!Array.isArray(reportData) || reportData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {formatDate(selectedDate)}のレポートはありません
                  </div>
                ) : (
                  reportData.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{item.memberName}</h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">昨日やったこと:</h5>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {item.yesterdayWork.split('\n').map((work, index) => (
                              <div key={index} className="flex items-start mb-1">
                                <span className="text-gray-400 mr-2">•</span>
                                <span>{work}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">今日やること:</h5>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {item.todayWork.split('\n').map((work, index) => (
                              <div key={index} className="flex items-start mb-1">
                                <span className="text-gray-400 mr-2">•</span>
                                <span>{work}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">困っていること・ボトルネック:</h5>
                          <div className="text-sm text-gray-600 leading-relaxed">
                            {item.blockingIssues === 'なし' ? (
                              <span className="text-green-600">なし</span>
                            ) : (
                              <span className="text-red-600">{item.blockingIssues}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* フローティングボタン */}
      <button
        onClick={handleOpenPanel}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 ${
          isEditing
            ? 'bg-orange-500 hover:bg-orange-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isEditing ? (
          // 鉛筆アイコン（編集モード）
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ) : (
          // ＋アイコン（新規作成モード）
          <span className="text-2xl font-bold">＋</span>
        )}
      </button>

      {/* スライドパネル */}
      {/* パネル */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              {isEditing ? 'デイリーレポート編集' : 'デイリーレポート入力'}
            </h3>
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
                  昨日やったこと <span className="text-red-500">*</span>
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
                    今日やること <span className="text-red-500">*</span>
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

              {/* エラーメッセージ */}
              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    送信中...
                  </div>
                ) : (
                  isEditing ? '更新' : '登録'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;

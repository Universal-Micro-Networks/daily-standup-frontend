import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import { useTranslation } from '../utils/i18n';

interface TeamProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  invitedAt: string;
  expiresAt?: string;
}

const Team: React.FC<TeamProps> = ({ sidebarOpen, onToggleSidebar }) => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('メンバー');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'members' | 'pending'>('members');

  // APIからユーザー情報を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching users...');

        // ユーザー一覧のみ取得（招待中のユーザー一覧は一時的に無効化）
        const users = await userAPI.getUsers(100, 0);

        console.log('Raw users response:', users);

        // ユーザー一覧をTeamMember形式に変換
        const transformedUsers: TeamMember[] = users.map((user: any) => {
          console.log('Processing user:', user);
          return {
            id: user.id || user.user_id || user.uuid || '',
            name: user.name || user.username || user.display_name || user.full_name || 'Unknown',
            email: user.email || user.mail || '',
            role: user.role || user.job_title || user.position || t('team.member'),
            avatar: user.avatar || user.profile_image || user.profile_picture,
            status: user.status || (user.is_active !== undefined ? (user.is_active ? 'active' : 'inactive') : 'active'),
            lastActive: user.last_active || user.last_login || user.updated_at || user.created_at
          };
        });

        console.log('Transformed users:', transformedUsers);

        setTeamMembers(transformedUsers);
        setPendingInvites([]); // 一時的に空配列を設定

      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(t('team.error'));
        setTeamMembers([]);
        setPendingInvites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      setInviteError(t('team.emailRequired'));
      return;
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError(t('team.invalidEmail'));
      return;
    }

    // 一時的に招待機能を無効化
    setInviteError(t('team.inviteError'));
    return;

    // 以下のコードは一時的にコメントアウト
    /*
    try {
      setIsInviting(true);
      setInviteError(null);
      setInviteSuccess(null);

      await userAPI.inviteUser({
        email: inviteEmail.trim(),
        role: inviteRole
      });

      setInviteSuccess(`${inviteEmail} に招待メールを送信しました`);
      setInviteEmail('');
      setInviteRole('メンバー');
      setShowInviteForm(false);

      // 招待中のユーザー一覧を再取得
      const invites = await userAPI.getPendingInvites();
      const transformedInvites: PendingInvite[] = invites.map((invite: any) => ({
        id: invite.id || invite.invite_id,
        email: invite.email,
        role: invite.role || 'メンバー',
        invitedAt: invite.invited_at || invite.created_at,
        expiresAt: invite.expires_at
      }));
      setPendingInvites(transformedInvites);

      // 3秒後に成功メッセージを消す
      setTimeout(() => {
        setInviteSuccess(null);
      }, 3000);

    } catch (err) {
      console.error('Failed to invite user:', err);
      setInviteError('ユーザーの招待に失敗しました。もう一度お試しください。');
    } finally {
      setIsInviting(false);
    }
    */
  };

  const handleResendInvite = async (inviteId: string, email: string) => {
    try {
      await userAPI.resendInvite(inviteId);
      setInviteSuccess(`${email} に招待メールを再送信しました`);
      setTimeout(() => {
        setInviteSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to resend invite:', err);
      setInviteError('招待メールの再送信に失敗しました');
      setTimeout(() => {
        setInviteError(null);
      }, 3000);
    }
  };

  const handleCancelInvite = async (inviteId: string, email: string) => {
    if (!window.confirm(`${email} への招待を取り消しますか？`)) {
      return;
    }

    try {
      await userAPI.cancelInvite(inviteId);
      setPendingInvites(prev => prev.filter(invite => invite.id !== inviteId));
      setInviteSuccess(`${email} への招待を取り消しました`);
      setTimeout(() => {
        setInviteSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to cancel invite:', err);
      setInviteError('招待の取り消しに失敗しました');
      setTimeout(() => {
        setInviteError(null);
      }, 3000);
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInvites = pendingInvites.filter(invite =>
    invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invite.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? t('team.active') : t('team.inactive');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mac-text-shadow">{t('team.title')}</h2>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-6 mac-scrollbar w-full">
        <div className="mac-card p-6 hover:mac-box-shadow transition-all duration-300 w-full">
          {/* ヘッダー部分 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{t('team.teamManagement')}</h3>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={true}
              title={t('team.inviteError')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{t('team.inviteMember')}</span>
            </button>
          </div>

          {/* 招待フォーム */}
          {showInviteForm && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-lg font-medium text-blue-800 mb-4">{t('team.inviteNewMember')}</h4>
              <form onSubmit={handleInviteUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('team.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="inviteEmail"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@company.com"
                      disabled={isInviting}
                    />
                  </div>
                  <div>
                    <label htmlFor="inviteRole" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('team.role')}
                    </label>
                    <select
                      id="inviteRole"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isInviting}
                    >
                      <option value={t('team.member')}>{t('team.member')}</option>
                      <option value={t('team.developer')}>{t('team.developer')}</option>
                      <option value={t('team.designer')}>{t('team.designer')}</option>
                      <option value={t('team.projectManager')}>{t('team.projectManager')}</option>
                      <option value={t('team.qaEngineer')}>{t('team.qaEngineer')}</option>
                    </select>
                  </div>
                </div>

                {inviteError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{inviteError}</p>
                  </div>
                )}

                {inviteSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">{inviteSuccess}</p>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    disabled={isInviting}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isInviting
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isInviting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{t('team.inviting')}</span>
                      </div>
                    ) : (
                      t('team.inviteEmail')
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteEmail('');
                      setInviteRole(t('team.member'));
                      setInviteError(null);
                      setInviteSuccess(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    disabled={isInviting}
                  >
                    {t('team.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* タブ */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'members'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('team.members')} ({teamMembers.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm cursor-not-allowed ${
                    activeTab === 'pending'
                      ? 'border-gray-400 text-gray-400'
                      : 'border-transparent text-gray-400'
                  }`}
                  disabled={true}
                  title={t('team.inviteError')}
                >
                  {t('team.pending')} ({pendingInvites.length}) - {t('team.notImplemented')}
                </button>
              </nav>
            </div>
          </div>

          {/* 検索バー */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === 'members' ? t('team.searchMembers') : t('team.searchPending')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* ローディング状態 */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t('team.loading')}</p>
              </div>
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('team.retry')}
                </button>
              </div>
            </div>
          )}

          {/* メンバー一覧 */}
          {!isLoading && !error && activeTab === 'members' && (
            <div className="space-y-4">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? t('team.noSearchResults') : t('team.noTeamMembers')}
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* アバター */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(member.name)}
                      </div>
                    </div>

                    {/* メンバー情報 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                            {getStatusText(member.status)}
                          </span>
                          {member.lastActive && (
                            <span className="text-xs text-gray-500">
                              {t('team.lastActive')}: {member.lastActive}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex-shrink-0 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 招待中のユーザー一覧 */}
          {!isLoading && !error && activeTab === 'pending' && (
            <div className="space-y-4">
              {filteredInvites.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? t('team.noSearchResults') : t('team.noPendingUsers')}
                </div>
              ) : (
                filteredInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* アバター */}
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white font-semibold">
                        📧
                      </div>
                    </div>

                    {/* 招待情報 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{invite.email}</h3>
                          <p className="text-sm text-gray-600">{t('team.role')}: {invite.role}</p>
                          <p className="text-sm text-gray-500">招待日時: {formatDate(invite.invitedAt)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                            {t('team.pending')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex-shrink-0 ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleResendInvite(invite.id, invite.email)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="再招待"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCancelInvite(invite.id, invite.email)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="招待取り消し"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 統計情報 */}
          {!isLoading && !error && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{teamMembers.length}</div>
                  <div className="text-sm text-blue-600">{t('team.totalMembers')}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </div>
                  <div className="text-sm text-green-600">{t('team.activeMembers')}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{pendingInvites.length}</div>
                  <div className="text-sm text-yellow-600">{t('team.pendingInvites')}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {teamMembers.filter(m => m.role === t('team.developer')).length}
                  </div>
                  <div className="text-sm text-gray-600">{t('team.developers')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Team;

import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import UserRegistration from './components/UserRegistration';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { initializeTheme } from './utils/theme';

function AppContent() {
  const { isAuthenticated, user, shouldShowLogin, logout } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);

  // テーマを初期化
  useEffect(() => {
    initializeTheme();
  }, []);

  // URLパラメータをチェックしてユーザー登録画面を表示するか判定
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const registrationToken = urlParams.get('registration');
    if (registrationToken) {
      setShowRegistration(true);
    }
  }, []);

  // ユーザー登録画面を表示
  if (showRegistration) {
    return (
      <UserRegistration
        onSuccess={() => {
          setShowRegistration(false);
          // 登録成功後、ログイン画面にリダイレクト
          window.location.href = '/';
        }}
      />
    );
  }

  if (shouldShowLogin) {
    return <LoginForm />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">認証中...</p>
        </div>
      </div>
    );
  }

  return <Layout onLogout={logout} user={user} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

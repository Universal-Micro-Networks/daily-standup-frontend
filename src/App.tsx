import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import { authConfig } from './config';
import { authAPI } from './services/api';
import { getUserFromToken } from './utils/jwt';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 初期化時にトークンをチェック
  useEffect(() => {
    const token = localStorage.getItem(authConfig.tokenKey);
    if (token) {
      // JWTトークンからユーザー情報を取得
      const userFromToken = getUserFromToken(token);
      if (userFromToken) {
        setIsLoggedIn(true);
        setUser(userFromToken);
      } else {
        // トークンが無効な場合、削除
        localStorage.removeItem(authConfig.tokenKey);
        localStorage.removeItem(authConfig.refreshTokenKey);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);

      // トークンを保存（access_tokenを使用）
      if (response && response.access_token) {
        localStorage.setItem(authConfig.tokenKey, response.access_token);

        // JWTトークンからユーザー情報を取得
        const userFromToken = getUserFromToken(response.access_token);
        setUser(userFromToken);

        // ログイン状態を更新
        setIsLoggedIn(true);
      } else {
        alert('ログインに失敗しました。トークンが取得できませんでした。');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // エラーハンドリング（実際の実装ではユーザーにエラーを表示）
      alert('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
    }
  };

  const handleLogout = async () => {
    try {
      // ログアウトAPIを呼び出し
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // ローカルストレージからトークンを削除
      localStorage.removeItem(authConfig.tokenKey);
      localStorage.removeItem(authConfig.refreshTokenKey);
      localStorage.removeItem(authConfig.rememberMeKey);

      // ユーザー情報をクリア
      setUser(null);

      // ログイン状態を更新
      setIsLoggedIn(false);
    }
  };

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <Layout onLogout={handleLogout} user={user} />;
}

export default App;

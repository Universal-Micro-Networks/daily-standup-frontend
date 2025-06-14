import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authConfig } from '../config';
import { apiClient, authAPI } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  showLoginForm: () => void;
  hideLoginForm: () => void;
  shouldShowLogin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [shouldShowLogin, setShouldShowLogin] = useState(false);

  // 認証失敗時のコールバックを設定
  useEffect(() => {
    apiClient.setUnauthorizedCallback(() => {
      console.log('Unauthorized access detected, showing login form');
      setIsAuthenticated(false);
      setUser(null);
      setShouldShowLogin(true);
    });
  }, []);

  // 初期認証状態のチェック
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem(authConfig.tokenKey);
      if (token) {
        try {
          // トークンが存在する場合、ユーザー情報を取得して認証状態を確認
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          setShouldShowLogin(false);
        } catch (error) {
          console.error('Failed to verify authentication:', error);
          // 認証に失敗した場合、トークンを削除してログイン画面を表示
          localStorage.removeItem(authConfig.tokenKey);
          setIsAuthenticated(false);
          setUser(null);
          setShouldShowLogin(true);
        }
      } else {
        setShouldShowLogin(true);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);

      if (response.access_token) {
        localStorage.setItem(authConfig.tokenKey, response.access_token);
        setIsAuthenticated(true);
        setShouldShowLogin(false);

        // ユーザー情報を取得
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem(authConfig.tokenKey);
    setIsAuthenticated(false);
    setUser(null);
    setShouldShowLogin(true);
  };

  const showLoginForm = () => {
    setShouldShowLogin(true);
  };

  const hideLoginForm = () => {
    setShouldShowLogin(false);
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    showLoginForm,
    hideLoginForm,
    shouldShowLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

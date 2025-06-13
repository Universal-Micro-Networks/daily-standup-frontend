// 環境変数の設定
export const config = {
  // バックエンドAPIの接続先
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",

  // 環境設定
  env: import.meta.env.VITE_ENV || "development",

  // アプリケーション設定
  appName: import.meta.env.VITE_APP_NAME || "Daily Standup",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // その他の設定
  isDevelopment: import.meta.env.VITE_ENV === "development",
  isProduction: import.meta.env.VITE_ENV === "production",
};

// API関連の設定
export const apiConfig = {
  baseURL: config.apiBaseUrl,
  timeout: 10000, // 10秒
  headers: {
    "Content-Type": "application/json",
  },
};

// 認証関連の設定
export const authConfig = {
  tokenKey: "daily_standup_token",
  refreshTokenKey: "daily_standup_refresh_token",
  rememberMeKey: "daily_standup_remember_me",
};

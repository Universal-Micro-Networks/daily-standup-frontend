import { apiConfig, authConfig } from "../config";

// APIクライアントの基本設定
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    this.defaultHeaders = apiConfig.headers;
  }

  // 認証トークンを取得
  private getAuthToken(): string | null {
    return localStorage.getItem(authConfig.tokenKey);
  }

  // リクエストヘッダーを構築
  private buildHeaders(
    customHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    const token = this.getAuthToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // リクエストを実行
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(
      options.headers as Record<string, string>
    );

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GETリクエスト
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  // POSTリクエスト
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    // URLSearchParamsの場合はそのまま送信、それ以外はJSON.stringify
    const body =
      data instanceof URLSearchParams
        ? data
        : data
        ? JSON.stringify(data)
        : undefined;

    return this.request<T>(endpoint, {
      method: "POST",
      headers,
      body,
    });
  }

  // PUTリクエスト
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETEリクエスト
  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();

// 認証関連のAPI
export const authAPI = {
  // ログイン
  async login(
    username: string,
    password: string
  ): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await apiClient.post<{
      access_token: string;
      token_type: string;
    }>("/auth/login", formData, {
      "Content-Type": "application/x-www-form-urlencoded",
    });

    return response;
  },

  // ログアウト
  async logout(): Promise<void> {
    return apiClient.post("/auth/logout");
  },

  // ユーザー情報取得
  async getCurrentUser(): Promise<any> {
    return apiClient.get("/users/me");
  },

  // トークンリフレッシュ
  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post("/auth/refresh");
  },
};

// デイリーレポート関連のAPI
export const dailyReportAPI = {
  // レポート一覧取得
  async getReports(
    reportDate: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<any[]> {
    const params = new URLSearchParams({
      report_date: reportDate,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return apiClient.get(`/daily-reports?${params.toString()}`);
  },

  // レポート作成
  async createReport(data: {
    yesterdayWork: string;
    todayWork: string;
    blockingIssues: string;
  }): Promise<any> {
    return apiClient.post("/daily-reports", data);
  },

  // レポート更新
  async updateReport(id: string, data: any): Promise<any> {
    return apiClient.put(`/daily-reports/${id}`, data);
  },

  // レポート削除
  async deleteReport(id: string): Promise<void> {
    return apiClient.delete(`/daily-reports/${id}`);
  },
};

// ダッシュボード関連のAPI
export const dashboardAPI = {
  // ダッシュボードデータ取得
  async getDashboardData(): Promise<any> {
    return apiClient.get("/dashboard");
  },

  // 統計データ取得
  async getStats(): Promise<any> {
    return apiClient.get("/dashboard/stats");
  },
};

import { apiConfig, authConfig } from "../config";

// APIクライアントの基本設定
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private onUnauthorized: (() => void) | null = null;

  constructor() {
    this.baseURL = apiConfig.baseURL;
    this.timeout = apiConfig.timeout;
    this.defaultHeaders = apiConfig.headers;
  }

  // 認証失敗時のコールバックを設定
  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  // 認証トークンを取得
  private getAuthToken(): string | null {
    return localStorage.getItem(authConfig.tokenKey);
  }

  // 認証トークンを保存
  private setAuthToken(token: string): void {
    localStorage.setItem(authConfig.tokenKey, token);
  }

  // 認証トークンを削除
  private removeAuthToken(): void {
    localStorage.removeItem(authConfig.tokenKey);
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

    console.log(`API Request: ${options.method || "GET"} ${url}`);
    console.log("Request headers:", headers);
    if (options.body) {
      console.log("Request body:", options.body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`API Response: ${response.status} ${response.statusText}`);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.status === 401) {
        // 401エラーの場合、トークンを削除してログイン画面を表示
        this.removeAuthToken();
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
        throw new Error("Authentication failed");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("API Response data:", responseData);
      return responseData;
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
};

// ユーザー関連のAPI
export const userAPI = {
  // ユーザー一覧取得
  async getUsers(limit: number = 100, offset: number = 0): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/users?${queryString}` : "/users";

      const response = await apiClient.get<any[]>(endpoint);

      // レスポンスが配列でない場合の処理
      if (!Array.isArray(response)) {
        console.warn("API response is not an array:", response);
        return [];
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  // 特定のユーザー情報取得
  async getUser(id: string): Promise<any> {
    return apiClient.get(`/users/${id}`);
  },

  // ユーザー招待
  async inviteUser(data: { email: string; role?: string }): Promise<any> {
    return apiClient.post("/users/invite", data);
  },

  // 招待中のユーザー一覧取得
  async getPendingInvites(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>("/users/invites/pending");

      // レスポンスが配列でない場合の処理
      if (!Array.isArray(response)) {
        console.warn(
          "API response for pending invites is not an array:",
          response
        );
        return [];
      }

      return response;
    } catch (error) {
      console.error("Failed to fetch pending invites:", error);
      throw error;
    }
  },

  // 招待の再送信
  async resendInvite(inviteId: string): Promise<any> {
    return apiClient.post(`/users/invites/${inviteId}/resend`);
  },

  // 招待の取り消し
  async cancelInvite(inviteId: string): Promise<any> {
    return apiClient.delete(`/users/invites/${inviteId}`);
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
    report_date: string;
    yesterday_work: string;
    today_plan: string;
    issues: string;
  }): Promise<any> {
    return apiClient.post("/daily-reports", data);
  },

  // レポート更新
  async updateReport(
    id: string,
    data: {
      yesterday_work: string;
      today_plan: string;
      issues: string;
    }
  ): Promise<any> {
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

// JWTトークンをデコードする関数
export const decodeJWT = (token: string): any => {
  try {
    // トークンが存在しない場合のチェック
    if (!token) {
      return null;
    }

    // JWTは3つの部分（ヘッダー.ペイロード.署名）に分かれている
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // ペイロード部分（2番目の部分）をデコード
    const payload = parts[1];

    // Base64URLデコード（パディングを追加してBase64に変換）
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // JSONに変換
    const decoded = JSON.parse(atob(padded));

    return decoded;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
};

// JWTトークンからユーザー名を取得する関数
export const getUserNameFromToken = (token: string): string | null => {
  const decoded = decodeJWT(token);
  if (decoded && decoded.name) {
    return decoded.name;
  }
  return null;
};

// JWTトークンからユーザー情報を取得する関数
export const getUserFromToken = (token: string): any => {
  return decodeJWT(token);
};

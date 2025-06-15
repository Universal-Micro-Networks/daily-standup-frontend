export type Theme = "light" | "dark" | "auto";

// テーマのローカルストレージキー
const THEME_STORAGE_KEY = "daily-standup-theme";

// 現在のテーマを取得
export const getCurrentTheme = (): Theme => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  return savedTheme || "auto";
};

// テーマを設定
export const setTheme = (theme: Theme): void => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
};

// テーマを適用
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;

  // 既存のテーマクラスを削除
  root.classList.remove("light", "dark");

  if (theme === "auto") {
    // システム設定に合わせる
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.add(prefersDark ? "dark" : "light");
  } else {
    // 明示的に指定されたテーマを適用
    root.classList.add(theme);
  }
};

// システム設定の変更を監視
export const watchSystemTheme = (): void => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) => {
    const currentTheme = getCurrentTheme();
    if (currentTheme === "auto") {
      applyTheme("auto");
    }
  };

  mediaQuery.addEventListener("change", handleChange);

  // クリーンアップ関数を返す
  return () => mediaQuery.removeEventListener("change", handleChange);
};

// 初期化
export const initializeTheme = (): void => {
  const theme = getCurrentTheme();
  applyTheme(theme);
  watchSystemTheme();
};

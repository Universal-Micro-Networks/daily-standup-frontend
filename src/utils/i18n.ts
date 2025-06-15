import { useEffect, useState } from "react";
import de from "../locales/de.json";
import en from "../locales/en.json";
import et from "../locales/et.json";
import fr from "../locales/fr.json";
import it from "../locales/it.json";
import ja from "../locales/ja.json";
import zhCn from "../locales/zh-cn.json";
import zhTw from "../locales/zh-tw.json";

// サポートされている言語の型定義
export type SupportedLanguage =
  | "ja"
  | "en"
  | "de"
  | "fr"
  | "it"
  | "zh-cn"
  | "zh-tw"
  | "et";

// リソースファイルの型定義
export interface LocaleResources {
  common: {
    save: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    submit: string;
    loading: string;
    error: string;
    success: string;
    required: string;
  };
  settings: {
    title: string;
    userInfo: {
      title: string;
      name: string;
      email: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      saving: string;
      saved: string;
    };
    password: {
      title: string;
      change: string;
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
      currentPasswordPlaceholder: string;
      newPasswordPlaceholder: string;
      confirmPasswordPlaceholder: string;
      currentPasswordRequired: string;
      newPasswordRequired: string;
      newPasswordMinLength: string;
      confirmPasswordRequired: string;
      passwordMismatch: string;
      changing: string;
      changed: string;
    };
    notifications: {
      title: string;
      dailyReport: string;
      description: string;
    };
    theme: {
      title: string;
      theme: string;
      light: string;
      dark: string;
      auto: string;
    };
    language: {
      title: string;
      language: string;
      ja: string;
      en: string;
      de: string;
      fr: string;
      it: string;
      "zh-cn": string;
      "zh-tw": string;
      et: string;
    };
    appInfo: {
      title: string;
      version: string;
      lastUpdate: string;
      license: string;
    };
  };
  dailyReport: {
    title: string;
    yesterdayWork: string;
    todayWork: string;
    blockingIssues: string;
    yesterdayWorkPlaceholder: string;
    todayWorkPlaceholder: string;
    blockingIssuesPlaceholder: string;
    submit: string;
    update: string;
    submitting: string;
    frequentTasks: string;
    priorityTasks: string;
    copyFromYesterday: string;
    currentReport: string;
  };
  team: {
    title: string;
    inviteUser: string;
    email: string;
    role: string;
    member: string;
    developer: string;
    designer: string;
    projectManager: string;
    qaEngineer: string;
    invite: string;
    inviting: string;
    inviteSuccess: string;
    inviteError: string;
  };
  sidebar: {
    dashboard: string;
    dailyReport: string;
    team: string;
    settings: string;
    logout: string;
    help: string;
  };
  login: {
    title: string;
    email: string;
    password: string;
    login: string;
    loggingIn: string;
    loginError: string;
    emailRequired: string;
    passwordRequired: string;
  };
}

// リソースファイルのマッピング
const resources: Record<SupportedLanguage, LocaleResources> = {
  ja,
  en,
  de,
  fr,
  it,
  "zh-cn": zhCn,
  "zh-tw": zhTw,
  et,
};

const LANGUAGE_KEY = "app_language";

// デフォルト言語
const DEFAULT_LANGUAGE: SupportedLanguage = "ja";

// 現在の言語を取得
export const getCurrentLanguage = (): SupportedLanguage => {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (saved && saved in resources) {
    return saved as SupportedLanguage;
  }

  // ブラウザの言語設定を確認
  const browserLang = navigator.language.toLowerCase();

  // 完全一致
  if (browserLang in resources) {
    return browserLang as SupportedLanguage;
  }

  // 部分一致（例: ja-JP → ja）
  const langPrefix = browserLang.split("-")[0];
  if (langPrefix in resources) {
    return langPrefix as SupportedLanguage;
  }

  // 中国語の特別処理
  if (browserLang.startsWith("zh")) {
    if (browserLang.includes("tw") || browserLang.includes("hk")) {
      return "zh-tw";
    }
    return "zh-cn";
  }

  return "ja"; // デフォルト
};

// 言語を設定
export const setLanguage = (language: SupportedLanguage): void => {
  if (language in resources) {
    localStorage.setItem(LANGUAGE_KEY, language);
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: language })
    );
  }
};

// 翻訳関数
export const t = (
  key: string,
  params?: Record<string, string | number>
): string => {
  const currentLang = getCurrentLanguage();
  const resource = resources[currentLang];

  if (!resource) {
    console.warn(`Resource not found for language: ${currentLang}`);
    return key;
  }

  const keys = key.split(".");
  let value: any = resource;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      console.warn(
        `Translation key not found: ${key} for language: ${currentLang}`
      );
      return key;
    }
  }

  if (typeof value !== "string") {
    console.warn(
      `Translation value is not a string: ${key} for language: ${currentLang}`
    );
    return key;
  }

  // パラメータ置換
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
};

// Reactフック
export const useTranslation = () => {
  const [currentLanguage, setCurrentLanguageState] =
    useState<SupportedLanguage>(getCurrentLanguage());

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguageState(event.detail);
    };

    window.addEventListener(
      "languageChanged",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languageChanged",
        handleLanguageChange as EventListener
      );
    };
  }, []);

  const changeLanguage = (language: SupportedLanguage) => {
    setLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguage,
  };
};

// 言語名の取得
export const getLanguageName = (language: SupportedLanguage): string => {
  const languageNames: Record<SupportedLanguage, string> = {
    ja: "日本語",
    en: "English",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    "zh-cn": "简体中文",
    "zh-tw": "繁體中文",
    et: "Eesti",
  };

  return languageNames[language] || language;
};

// サポートされている言語のリストを取得
export const getSupportedLanguages = (): Array<{
  code: SupportedLanguage;
  name: string;
}> => {
  return Object.keys(resources).map((code) => ({
    code: code as SupportedLanguage,
    name: getLanguageName(code as SupportedLanguage),
  }));
};

// リソースファイルを直接取得（型安全性のため）
export const getResources = (language: SupportedLanguage): LocaleResources => {
  return resources[language] || resources[DEFAULT_LANGUAGE];
};

export default {
  t,
  getCurrentLanguage,
  setLanguage,
  getLanguageName,
  getSupportedLanguages,
  getResources,
};

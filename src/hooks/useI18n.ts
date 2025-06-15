import { useCallback, useEffect, useState } from "react";
import {
  getCurrentLanguage,
  getSupportedLanguages,
  setLanguage,
  t,
  type SupportedLanguage,
} from "../utils/i18n";

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguageState] =
    useState<SupportedLanguage>(getCurrentLanguage());

  // 言語変更時の処理
  const changeLanguage = useCallback((language: SupportedLanguage) => {
    setLanguage(language);
    setCurrentLanguageState(language);
    // ページをリロードして言語変更を反映
    window.location.reload();
  }, []);

  // 翻訳関数
  const translate = useCallback(
    (key: string, language?: SupportedLanguage) => {
      return t(key, language || currentLanguage);
    },
    [currentLanguage]
  );

  // サポートされている言語のリストを取得
  const supportedLanguages = getSupportedLanguages();

  // 初期化時に言語を設定
  useEffect(() => {
    const savedLanguage = getCurrentLanguage();
    if (savedLanguage !== currentLanguage) {
      setCurrentLanguageState(savedLanguage);
    }
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    translate,
    supportedLanguages,
    t: translate, // 短縮形
  };
};

export default useI18n;

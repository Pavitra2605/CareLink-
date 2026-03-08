import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation, interpolate, DEFAULT_LANGUAGE, translations } from './index';
import { translateText, translateBatch } from '../services/translationService';

const LANGUAGE_STORAGE_KEY = '@carelink_language';

const LanguageContext = createContext({
  locale: DEFAULT_LANGUAGE,
  setLocale: () => {},
  t: (key, vars) => key,
  translateDynamic: async (text) => text,
  translateDynamicBatch: async (texts) => texts,
  isRTL: false,
});

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted language on mount
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang && translations[savedLang]) {
          setLocaleState(savedLang);
        }
      } catch (e) {
        console.warn('Failed to load language preference:', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Set locale and persist
  const setLocale = useCallback(async (newLocale) => {
    if (!translations[newLocale]) return;
    setLocaleState(newLocale);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLocale);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  }, []);

  /**
   * Translate a key from the offline rule-based translations.
   * Supports interpolation: t('symptomQ.questionOf', { current: 1, total: 4 })
   */
  const t = useCallback((key, vars) => {
    const value = getTranslation(locale, key);
    if (vars && typeof value === 'string') {
      return interpolate(value, vars);
    }
    return value;
  }, [locale]);

  /**
   * Dynamic translation using Google Translate API (online).
   * Falls back to the original text if translation fails.
   */
  const translateDynamic = useCallback(async (text) => {
    if (locale === 'en') return text;
    try {
      return await translateText(text, locale);
    } catch {
      return text;
    }
  }, [locale]);

  /**
   * Batch dynamic translation using Google Translate API.
   */
  const translateDynamicBatch = useCallback(async (texts) => {
    if (locale === 'en') return texts;
    try {
      return await translateBatch(texts, locale);
    } catch {
      return texts;
    }
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    translateDynamic,
    translateDynamicBatch,
    isRTL: false, // Hindi and Tamil are LTR
    isLoading,
  }), [locale, setLocale, t, translateDynamic, translateDynamicBatch, isLoading]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;

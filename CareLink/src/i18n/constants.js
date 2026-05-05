import en from './locales/en';
import ta from './locales/ta';
import hi from './locales/hi';

export const translations = { en, ta, hi };

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', icon: '🇬🇧' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', icon: '🇮🇳' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: '🇮🇳' },
];

export const DEFAULT_LANGUAGE = 'en';

export function getTranslation(locale, key) {
  const lang = translations[locale] || translations[DEFAULT_LANGUAGE];
  const keys = key.split('.');
  let result = lang;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      let fallback = translations[DEFAULT_LANGUAGE];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key;
        }
      }
      return fallback;
    }
  }
  return result;
}

export function interpolate(str, vars = {}) {
  if (typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

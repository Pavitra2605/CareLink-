/**
 * Translation Service
 * Uses translate-google-api for dynamic (online) translations
 * Falls back gracefully when offline
 */

import translate from 'translate-google-api';

// Simple in-memory cache for dynamic translations
const translationCache = new Map();

/**
 * Translate a single text string to the target language.
 * Uses caching to avoid redundant API calls.
 * 
 * @param {string} text - The text to translate
 * @param {string} targetLang - Target language code ('ta', 'hi', etc.)
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLang, sourceLang = 'en') {
  if (!text || targetLang === sourceLang) return text;

  const cacheKey = `${sourceLang}:${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const result = await translate(text, {
      tld: 'com',
      to: targetLang,
      from: sourceLang,
    });

    const translated = Array.isArray(result) ? result.join('') : result;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch (error) {
    console.warn('Translation API error:', error.message);
    return text; // Fallback to original text
  }
}

/**
 * Translate multiple texts in a single batch.
 * More efficient for translating multiple strings at once.
 * 
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateBatch(texts, targetLang, sourceLang = 'en') {
  if (!texts || texts.length === 0 || targetLang === sourceLang) return texts;

  const results = [];
  const toTranslate = [];
  const toTranslateIndices = [];

  // Check cache first
  for (let i = 0; i < texts.length; i++) {
    const cacheKey = `${sourceLang}:${targetLang}:${texts[i]}`;
    if (translationCache.has(cacheKey)) {
      results[i] = translationCache.get(cacheKey);
    } else {
      toTranslate.push(texts[i]);
      toTranslateIndices.push(i);
      results[i] = null;
    }
  }

  if (toTranslate.length === 0) return results;

  try {
    // Translate uncached texts one by one (translate-google-api handles single strings)
    const translatedPromises = toTranslate.map(async (text, idx) => {
      try {
        const result = await translate(text, {
          tld: 'com',
          to: targetLang,
          from: sourceLang,
        });
        const translated = Array.isArray(result) ? result.join('') : result;
        const cacheKey = `${sourceLang}:${targetLang}:${text}`;
        translationCache.set(cacheKey, translated);
        return { index: toTranslateIndices[idx], value: translated };
      } catch {
        return { index: toTranslateIndices[idx], value: text };
      }
    });

    const translatedResults = await Promise.all(translatedPromises);
    for (const { index, value } of translatedResults) {
      results[index] = value;
    }
  } catch (error) {
    console.warn('Batch translation error:', error.message);
    // Fill remaining nulls with original texts
    for (let i = 0; i < results.length; i++) {
      if (results[i] === null) results[i] = texts[i];
    }
  }

  return results;
}

/**
 * Clear the translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

/**
 * Get the cache size (for debugging)
 */
export function getTranslationCacheSize() {
  return translationCache.size;
}

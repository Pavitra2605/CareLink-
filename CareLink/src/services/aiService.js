/**
 * CareLink AI Service Client
 *
 * Connects the React-Native app to the CareLink AI Microservice.
 * Endpoints:
 *   POST /api/v1/triage/predict        – symptom triage
 *   POST /api/v1/triage/analyze-image   – MedGemma VLM image analysis
 *   POST /api/v1/triage/chat            – follow-up chat
 *   GET  /health                        – health check
 */

const AI_BASE_URL =
  process.env.EXPO_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

// ─── Helpers ────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 30_000;

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function apiUrl(path) {
  // Strip trailing slash from base, ensure path starts with /
  const base = AI_BASE_URL.replace(/\/+$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

// ─── Health check ───────────────────────────────────────────

export async function checkHealth() {
  try {
    const res = await fetchWithTimeout(apiUrl('/health'));
    if (!res.ok) return { available: false };
    const data = await res.json();
    return { available: true, ...data };
  } catch {
    return { available: false };
  }
}

// ─── Triage predict ─────────────────────────────────────────

/**
 * Send symptoms to the AI service for risk classification.
 *
 * @param {object} params
 * @param {string} params.symptomsText   – free-text symptom description
 * @param {number} [params.age]          – patient age
 * @param {number} [params.durationDays] – symptom duration in days
 * @param {string[]} [params.chronicConditions]
 * @param {string} [params.language]     – "en" | "es" | "fr"
 * @returns {Promise<object>} TriageResponse (prediction, probabilities, explanation, …)
 */
export async function predictTriage({
  symptomsText,
  age = 30,
  durationDays = 1,
  chronicConditions = [],
  language = 'en',
}) {
  const res = await fetchWithTimeout(
    apiUrl('/api/v1/triage/predict'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symptoms_text: symptomsText,
        age,
        duration_days: durationDays,
        chronic_conditions: chronicConditions,
        language,
      }),
    },
    60_000, // VLM inference can be slow
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Triage failed (${res.status})`);
  }
  return res.json();
}

// ─── Image analysis (VLM) ───────────────────────────────────

/**
 * Upload a photo for MedGemma visual analysis.
 *
 * @param {object} params
 * @param {string} params.imageUri – local file URI from camera
 * @param {string} [params.question]
 * @param {string} [params.language]
 * @returns {Promise<object>} { analysis, model_ready, model_name, filename }
 */
export async function analyzeImage({
  imageUri,
  question = 'What do you observe in this medical image? Are there any concerning findings?',
  language = 'en',
}) {
  const formData = new FormData();

  // React Native's FormData accepts { uri, name, type }
  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeType =
    ext === 'png' ? 'image/png' :
    ext === 'webp' ? 'image/webp' :
    'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: mimeType,
  });
  formData.append('question', question);
  formData.append('language', language);

  const res = await fetchWithTimeout(
    apiUrl('/api/v1/triage/analyze-image'),
    {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type — fetch will set multipart boundary automatically
    },
    90_000, // VLM image inference is heavy
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Image analysis failed (${res.status})`);
  }
  return res.json();
}

// ─── Chat (follow-up conversation) ─────────────────────────

/**
 * Send a follow-up chat message.
 *
 * @param {object} params
 * @param {string} params.message        – user message
 * @param {Array}  [params.history]      – [{role, content}, …]
 * @param {object} [params.triageContext] – previous triage result for context
 * @param {string} [params.language]
 * @returns {Promise<object>} { reply, model_ready }
 */
export async function chat({
  message,
  history = [],
  triageContext = null,
  language = 'en',
}) {
  const res = await fetchWithTimeout(
    apiUrl('/api/v1/triage/chat'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        triage_context: triageContext,
        language,
      }),
    },
    60_000,
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Chat failed (${res.status})`);
  }
  return res.json();
}

// ─── Convenience: duration string → days ────────────────────

const DURATION_MAP = {
  'Today': 0,
  '2-3 days': 2,
  '1 week': 7,
  '2+ weeks': 14,
  'Ongoing': 30,
};

export function durationToDays(durationLabel) {
  return DURATION_MAP[durationLabel] ?? 1;
}

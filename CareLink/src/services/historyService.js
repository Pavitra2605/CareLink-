/**
 * CareLink — Chat, VLM & Symptom History Persistence (Supabase)
 *
 * Tables used:
 *   chat_sessions   – one row per conversation
 *   chat_messages   – each message in a session
 *   vlm_scans       – image analysis records
 *   symptom_checks  – triage results from symptom checker
 *   storage/medical-images – bucket for VLM photos
 */

import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────
// IMAGE UPLOAD
// ─────────────────────────────────────────────────────────────

/**
 * Upload a local image URI to Supabase Storage.
 * Returns the public URL or null on failure.
 */
export async function uploadMedicalImage(userId, localUri) {
  try {
    const ext = localUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${ext}`;
    const mimeType =
      ext === 'png' ? 'image/png' :
      ext === 'webp' ? 'image/webp' :
      'image/jpeg';

    // Fetch the local file as a blob
    const response = await fetch(localUri);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from('medical-images')
      .upload(fileName, blob, { contentType: mimeType, upsert: false });

    if (error) {
      console.warn('[historyService] image upload failed:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('medical-images')
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('[historyService] uploadMedicalImage error:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// CHAT SESSIONS & MESSAGES
// ─────────────────────────────────────────────────────────────

/** Create a new chat session. Returns { id, ... } or null. */
export async function createChatSession(userId, title = 'New Chat') {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single();
  if (error) console.warn('[historyService] createChatSession:', error.message);
  return data;
}

/** Update session title (uses first user message as title). */
export async function updateSessionTitle(sessionId, title) {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', sessionId);
  if (error) console.warn('[historyService] updateSessionTitle:', error.message);
}

/** Save a single chat message. */
export async function saveChatMessage(sessionId, userId, role, content, metadata = {}) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, user_id: userId, role, content, metadata })
    .select()
    .single();
  if (error) console.warn('[historyService] saveChatMessage:', error.message);
  return data;
}

/** Load all sessions for a user (newest first). */
export async function getChatSessions(userId) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) console.warn('[historyService] getChatSessions:', error.message);
  return data || [];
}

/** Load messages for a session. */
export async function getChatMessages(sessionId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) console.warn('[historyService] getChatMessages:', error.message);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// VLM SCANS
// ─────────────────────────────────────────────────────────────

/** Save a VLM scan result. Uploads image first if localUri provided. */
export async function saveVlmScan(userId, { localUri, question, analysis, findings, modelName, modelReady }) {
  let imageUrl = null;
  if (localUri) {
    imageUrl = await uploadMedicalImage(userId, localUri);
  }

  const { data, error } = await supabase
    .from('vlm_scans')
    .insert({
      user_id: userId,
      image_url: imageUrl,
      question,
      analysis,
      findings: findings || [],
      model_name: modelName,
      model_ready: modelReady,
    })
    .select()
    .single();
  if (error) console.warn('[historyService] saveVlmScan:', error.message);
  return data;
}

/** Load VLM scan history (newest first). */
export async function getVlmScans(userId, limit = 20) {
  const { data, error } = await supabase
    .from('vlm_scans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.warn('[historyService] getVlmScans:', error.message);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// SYMPTOM CHECKS
// ─────────────────────────────────────────────────────────────

/** Save a completed symptom triage result. */
export async function saveSymptomCheck(userId, {
  symptomsText,
  symptomsSelected = [],
  duration,
  answers = {},
  prediction,
  confidence,
  probabilities,
  rulesTriggered = [],
  explanation,
  emergencyFlag = false,
  escalated = false,
  modelVersion,
  requestId,
}) {
  const { data, error } = await supabase
    .from('symptom_checks')
    .insert({
      user_id: userId,
      symptoms_text: symptomsText,
      symptoms_selected: symptomsSelected,
      duration,
      answers,
      prediction,
      confidence,
      probabilities,
      rules_triggered: rulesTriggered,
      explanation,
      emergency_flag: emergencyFlag,
      escalated,
      model_version: modelVersion,
      request_id: requestId,
    })
    .select()
    .single();
  if (error) console.warn('[historyService] saveSymptomCheck:', error.message);
  return data;
}

/** Load symptom check history (newest first). */
export async function getSymptomChecks(userId, limit = 50) {
  const { data, error } = await supabase
    .from('symptom_checks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) console.warn('[historyService] getSymptomChecks:', error.message);
  return data || [];
}

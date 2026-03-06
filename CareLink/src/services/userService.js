import { supabase } from './supabase';

/**
 * Fetch the profile row for a given user ID.
 */
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

/**
 * Update specific fields on a profile.
 * Returns the updated row.
 */
export const updateProfile = async (userId, fields = {}) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

/**
 * Upsert a profile (creates if missing, updates otherwise).
 * Used as a fallback if the DB trigger didn't fire.
 */
export const upsertProfile = async (userId, fields = {}) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: fields.full_name ?? null,
        phone: fields.phone ?? null,
        age: fields.age ? parseInt(fields.age, 10) : null,
        gender: fields.gender ?? null,
      },
      { onConflict: 'id' }
    )
    .select()
    .single();
  return { data, error };
};

/**
 * Append an entry to the auth audit log.
 * event_type: 'signup' | 'login' | 'logout' | 'password_reset'
 */
export const logAuthEvent = async (userId, eventType, metadata = {}) => {
  const { error } = await supabase
    .from('auth_logs')
    .insert({ user_id: userId, event_type: eventType, metadata });
  if (error) console.warn('[authLog]', error.message);
};

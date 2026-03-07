import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getProfile, upsertProfile, logAuthEvent } from '../services/userService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [session, setSession]         = useState(null);
  const [profile, setProfile]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Load profile for a given user ──────────────────────────
  const loadProfile = useCallback(async (userId, userMetadata = {}) => {
    if (!userId) { setProfile(null); return; }
    setProfileLoading(true);
    const { data, error } = await getProfile(userId);
    if (error && error.code === 'PGRST116') {
      // Profile row missing (trigger may not have run yet) – create it using signup metadata
      const { data: created } = await upsertProfile(userId, {
        full_name: userMetadata?.full_name ?? null,
        phone:     userMetadata?.phone     ?? null,
        age:       userMetadata?.age       ?? null,
        gender:    userMetadata?.gender    ?? null,
      });
      setProfile(created ?? null);
    } else {
      setProfile(data ?? null);
    }
    setProfileLoading(false);
  }, []);

  // Expose so screens can refresh after editing the profile
  const refreshProfile = useCallback(() => {
    if (user?.id) loadProfile(user.id);
  }, [user, loadProfile]);

  // ── Auth state listener ────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      loadProfile(session?.user?.id ?? null, session?.user?.user_metadata);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        loadProfile(session?.user?.id ?? null, session?.user?.user_metadata);
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // ── Auth actions ───────────────────────────────────────────
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      await logAuthEvent(data.user.id, 'login');
    }
    return { data, error };
  };

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (!error && data.user) {
      // Try to log – may fail if RLS blocks unconfirmed users; that's fine
      await logAuthEvent(data.user.id, 'signup').catch(() => {});
    }
    return { data, error };
  };

  const signOut = async () => {
    if (user?.id) await logAuthEvent(user.id, 'logout').catch(() => {});
    const { error } = await supabase.auth.signOut();
    setProfile(null);
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (!error && user?.id) await logAuthEvent(user.id, 'password_reset').catch(() => {});
    return { data, error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        profileLoading,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

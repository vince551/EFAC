import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, metadata: Record<string, unknown> = {}) {
  if (!supabase) throw new Error('Supabase is not configured.');
  return supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

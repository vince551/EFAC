import { supabase } from './supabase';

export type ScholarProfile = {
  id: string;
  full_name: string;
  email: string;
  school: string | null;
  grade: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  published_at: string;
  author_id: string | null;
};

export async function getMyProfile(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as ScholarProfile | null;
}

export async function getAnnouncements(limit = 10) {
  if (!supabase) return [] as Announcement[];
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Announcement[];
}

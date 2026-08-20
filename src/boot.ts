import { supabase, isSupabaseConfigured } from './lib/supabase';

const setConnectionState = (connected: boolean) => {
  document.documentElement.dataset.backend = connected ? 'supabase' : 'demo';
};

setConnectionState(isSupabaseConfigured);

if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    window.dispatchEvent(new CustomEvent('efac:session', { detail: data.session }));
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    window.dispatchEvent(new CustomEvent('efac:session', { detail: session }));
  });
}

console.info(
  `[EFAC] Runtime: ${isSupabaseConfigured ? 'Supabase connected' : 'demo mode — configure .env.local'}`,
);

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './functional.css'
import './nav.css'

import { supabase, isSupabaseConfigured } from './lib/supabase'

document.documentElement.dataset.backend = isSupabaseConfigured ? 'supabase' : 'demo'

if (supabase) {
  supabase.auth.getSession().then(({ data }) => {
    window.dispatchEvent(new CustomEvent('efac:session', { detail: data.session }))
  })
  supabase.auth.onAuthStateChange((_event, session) => {
    window.dispatchEvent(new CustomEvent('efac:session', { detail: session }))
  })
}

document.body.innerHTML = '<div id="root"></div>'
createRoot(document.getElementById('root')!).render(React.createElement(App))

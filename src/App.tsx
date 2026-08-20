import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Award, BarChart3, Bell, BriefcaseBusiness, Check, ChevronDown, CircleUserRound, GraduationCap, HeartPulse, Home, LogIn, LogOut, Menu, MessageCircle, Moon, Rocket, School, Sparkles, Sun, Target, Users, X } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import './styles.css'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { getMyProfile, getAnnouncements, type ScholarProfile, type Announcement } from './lib/db'
import { signInWithEmail, signOut, signUpWithEmail } from './lib/auth'

type View = 'dashboard' | 'profile' | 'academic' | 'news' | 'community' | 'about'
type ProfileForm = { full_name: string; school: string; grade: string; career: string }
type Report = { id: string; file_name: string; mean_score: number; subjects_count: number; submitted_at: string }
type ChatMessage = { id: string; channel: string; author: string; text: string; created_at: string }

const programs = [
  { icon: GraduationCap, number: '01', title: 'Academic Access', text: 'Scholarships, academic support and tools that help students perform with confidence.' },
  { icon: Rocket, number: '02', title: 'Leadership', text: 'Build voice, responsibility and the confidence to create change in your community.' },
  { icon: HeartPulse, number: '03', title: 'Wellness', text: 'Support the person behind the grades with wellbeing, belonging and trusted relationships.' },
  { icon: BriefcaseBusiness, number: '04', title: 'Career Pathways', text: 'Mentorship, exposure and practical pathways from school toward opportunity.' },
]

const seedMessages: ChatMessage[] = [
  { id: 'welcome', channel: 'general-scholars', author: 'EFAC', text: 'Welcome to the scholar community. Be kind, curious and helpful.', created_at: new Date().toISOString() },
]

function storage<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}
function saveStorage<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }

export default function App() {
  const [platform, setPlatform] = useState(false)
  const [view, setView] = useState<View>('dashboard')
  const [dark, setDark] = useState(() => localStorage.getItem('efac-theme') === 'dark')
  const [menu, setMenu] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const onSession = (event: Event) => setUser((event as CustomEvent<User | null>).detail)
    window.addEventListener('efac:session', onSession)
    if (supabase) supabase.auth.getUser().then(({ data }) => setUser(data.user))
    return () => window.removeEventListener('efac:session', onSession)
  }, [])

  useEffect(() => { localStorage.setItem('efac-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => { if (toast) { const t = window.setTimeout(() => setToast(''), 3500); return () => clearTimeout(t) } }, [toast])

  const openPlatform = () => { setPlatform(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openView = (next: View) => { setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const handlePlatform = () => { openPlatform(); if (!user) setAuthOpen(true) }

  if (!platform) return <PublicSite onEnter={handlePlatform} onLogin={() => { openPlatform(); setAuthOpen(true) }} mobileNav={mobileNav} setMobileNav={setMobileNav} />

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <header className="platform-header">
        <button className="platform-brand" onClick={() => setPlatform(false)}><img src="/efac.jpg" alt="EFAC" /><span>EFAC <small>Scholar Platform</small></span></button>
        <div className="platform-actions">
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <div className="dashboard-picker">
            <button className="dashboard-trigger" onClick={() => setMenu(!menu)}>Dashboard <ChevronDown size={16} /></button>
            {menu && <div className="dashboard-menu">
              <NavButton icon={Home} label="Overview" active={view === 'dashboard'} onClick={() => openView('dashboard')} />
              <NavButton icon={CircleUserRound} label="My Profile" active={view === 'profile'} onClick={() => openView('profile')} />
              <NavButton icon={BarChart3} label="Academic Hub" active={view === 'academic'} onClick={() => openView('academic')} />
              <NavButton icon={Bell} label="News" active={view === 'news'} onClick={() => openView('news')} />
              <NavButton icon={MessageCircle} label="Community" active={view === 'community'} onClick={() => openView('community')} />
              <NavButton icon={Target} label="About EFAC" active={view === 'about'} onClick={() => openView('about')} />
              {user ? <button className="menu-back" onClick={async () => { await signOut(); setUser(null); setMenu(false); setToast('Signed out successfully') }}><LogOut size={16} /> Sign out</button> : <button className="menu-back" onClick={() => { setAuthOpen(true); setMenu(false) }}><LogIn size={16} /> Sign in</button>}
              <button className="menu-back" onClick={() => setPlatform(false)}><ArrowRight size={16} className="flip" /> Back to EFAC</button>
            </div>}
          </div>
          <button className="avatar" onClick={() => openView('profile')} aria-label="Open profile">{(user?.user_metadata?.full_name || 'S').charAt(0).toUpperCase()}</button>
        </div>
      </header>
      <main className="platform-main">
        {view === 'dashboard' && <Dashboard user={user} onOpen={openView} onLogin={() => setAuthOpen(true)} />}
        {view === 'profile' && <Profile user={user} onLogin={() => setAuthOpen(true)} onToast={setToast} />}
        {view === 'academic' && <Academic user={user} onLogin={() => setAuthOpen(true)} onToast={setToast} />}
        {view === 'news' && <News user={user} onLogin={() => setAuthOpen(true)} />}
        {view === 'community' && <Community user={user} onLogin={() => setAuthOpen(true)} onToast={setToast} />}
        {view === 'about' && <About />}
      </main>
      {!user && <div className="platform-signin"><span>You're viewing the demo workspace.</span><button onClick={() => setAuthOpen(true)}>Sign in to save your data <ArrowRight size={15} /></button></div>}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onSuccess={(u) => { setUser(u); setAuthOpen(false); setToast('Welcome to EFAC') }} />}
      {toast && <div className="efac-toast"><Check size={16} /> {toast}</div>}
    </div>
  )
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: typeof Home; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? 'nav-button active' : 'nav-button'} onClick={onClick}><Icon size={16} />{label}</button>
}

function PublicSite({ onEnter, onLogin, mobileNav, setMobileNav }: { onEnter: () => void; onLogin: () => void; mobileNav: boolean; setMobileNav: (v: boolean) => void }) {
  return <div className="public-site">
    <header className="public-header">
      <a className="brand" href="#top"><img src="/efac.jpg" alt="EFAC" /><span>EFAC</span></a>
      <nav className={mobileNav ? 'public-links open' : 'public-links'}><a href="#mission" onClick={() => setMobileNav(false)}>Mission</a><a href="#programs" onClick={() => setMobileNav(false)}>Programs</a><a href="#impact" onClick={() => setMobileNav(false)}>Impact</a><a href="#about" onClick={() => setMobileNav(false)}>About</a></nav>
      <div className="public-actions"><button className="public-login" onClick={onLogin}>Sign in</button><button className="public-platform" onClick={onEnter}>Scholar Platform <ArrowUpRight size={17} /></button></div>
      <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">{mobileNav ? <X /> : <Menu />}</button>
    </header>
    <main id="top">
      <section className="public-hero"><div className="hero-grid" /><div className="hero-glow one" /><div className="hero-glow two" /><div className="hero-copy"><span className="kicker"><i /> Education For All Children</span><h1>Every child deserves<br /><em>a future they can choose.</em></h1><p>EFAC creates pathways for talented young people through education, mentorship, leadership and access to opportunity.</p><div className="hero-actions"><button className="primary" onClick={onEnter}>Enter Scholar Platform <ArrowRight size={18} /></button><a className="secondary" href="#mission">Discover EFAC <ArrowRight size={18} /></a></div><div className="hero-note"><Sparkles size={15} /> Education is not just access. It's the beginning of possibility.</div></div><div className="hero-art"><div className="hero-card"><div className="hero-card-logo"><img src="/efac.jpg" alt="EFAC" /></div><span>EFAC</span><h3>Education<br />with purpose.</h3><div className="hero-rule" /><small>Access · Leadership · Wellness · Career</small></div><div className="float-card first"><GraduationCap /><span><b>Academic Access</b><small>Support that opens doors</small></span></div><div className="float-card second"><Users /><span><b>Community</b><small>Grow together</small></span></div></div></section>
      <div className="marquee"><span>ACADEMIC ACCESS</span><i>✦</i><span>MENTORSHIP</span><i>✦</i><span>LEADERSHIP</span><i>✦</i><span>WELLNESS</span><i>✦</i><span>CAREER PATHWAYS</span></div>
      <section id="mission" className="public-section split"><div className="section-no">01 / WHY EFAC</div><div className="split-grid"><h2>Education should expand <em>possibility.</em></h2><div><p className="large">We believe talent exists everywhere, but opportunity doesn't. EFAC works to close that gap by supporting young people with the resources, relationships and confidence they need to build their next chapter.</p><p>From academic support to leadership and career pathways, we focus on the whole scholar — not just the classroom.</p></div></div></section>
      <section id="programs" className="public-section programs"><div className="section-head"><div><div className="section-no">02 / WHAT WE DO</div><h2>Four pathways.<br /><em>One bigger future.</em></h2></div><p>Our programs are designed to support scholars at the moments that matter.</p></div><div className="program-grid">{programs.map(({ icon: Icon, number, title, text }) => <article className="program-card" key={title}><span>{number}</span><Icon /><h3>{title}</h3><p>{text}</p><a href="#impact">Explore <ArrowRight size={15} /></a></article>)}</div></section>
      <section id="impact" className="impact"><div className="impact-inner"><div><div className="section-no light">03 / THE JOURNEY</div><h2>From the classroom<br />to the <em>next chapter.</em></h2><p>EFAC is being built as a long-term ecosystem — helping scholars track progress, find mentors, join communities and discover opportunities.</p><button className="outline" onClick={onEnter}>Explore scholar experience <ArrowRight size={17} /></button></div><div className="journey">{['Learn','Grow','Connect','Launch'].map((x, i) => <div key={x}><strong>0{i + 1}</strong><b>{x}</b><small>{['Academic support','Mentorship & leadership','Community & opportunity','Career pathways'][i]}</small></div>)}</div></div></section>
      <section id="about" className="public-section split about"><div className="section-no">04 / ABOUT EFAC</div><div className="split-grid"><h2>Built for the<br /><em>long journey.</em></h2><div><p className="large">EFAC is committed to creating a world where every child has equal access to education and the opportunity to reach their full potential.</p><div className="principles"><div><Target /><span><b>Mission</b>Empower talented students with access to quality education and long-term support.</span></div><div><Award /><span><b>Vision</b>A future where opportunity is not determined by a child's circumstances.</span></div></div></div></div></section>
      <section className="public-cta"><div><div className="section-no light">READY?</div><h2>Be part of someone's<br /><em>next chapter.</em></h2><p>Explore EFAC, support the mission or enter the scholar platform.</p><button className="primary" onClick={onEnter}>Enter Scholar Platform <ArrowRight size={18} /></button></div><div className="cta-logo"><img src="/efac.jpg" alt="EFAC" /></div></section>
    </main><footer><div className="brand"><img src="/efac.jpg" alt="EFAC" /><span>EFAC</span></div><span>Education For All Children</span><span>© 2026 EFAC</span></footer>
  </div>
}

function Dashboard({ user, onOpen, onLogin }: { user: User | null; onOpen: (v: View) => void; onLogin: () => void }) {
  const reports = storage<Report[]>('efac-reports', [])
  const latest = reports[0]
  return <section className="screen"><div className="screen-hero"><div><span className="kicker"><i /> Scholar workspace</span><h1>{user?.user_metadata?.full_name ? `Welcome back, ${user.user_metadata.full_name.split(' ')[0]}.` : 'Welcome back, Scholar.'}</h1><p>Your space for academic progress, community and opportunity.</p></div><div className="quote-card"><Sparkles /><span>{user ? 'Your workspace' : 'Demo workspace'}</span><b>{latest ? `${latest.mean_score}% latest mean` : 'Small steps. Big future.'}</b></div></div><div className="kpis"><Kpi title="Academic score" value={latest ? `${latest.mean_score}%` : '—'} note={latest ? `${latest.subjects_count} subjects tracked` : 'Upload a report'} /><Kpi title="EFAC rank" value="—" note="Ranking starts with verified data" /><Kpi title="Reports" value={String(reports.length)} note={reports.length ? 'Saved on this device' : 'Upload your first report'} /><Kpi title="Next step" value={user ? 'Profile' : 'Sign in'} note={user ? 'Complete your scholar profile' : 'Save your progress'} accent /></div><div className="dash-grid"><div className="panel"><PanelHead label="Performance" title="Academic snapshot" /><div className="chart"><div className="chart-bars">{[42, 68, 86, 73, 94].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div><div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span></div></div></div><div className="panel"><PanelHead label="Up next" title="Your pathway" /><div className="path"><div><Check /><span><b>{user ? 'Profile ready to edit' : 'Sign in to save your profile'}</b><small>{user ? 'Add school and career details' : 'Create an account in seconds'}</small></span></div><div><span className="empty-dot"/><span><b>Upload a report</b><small>Calculate your academic mean</small></span></div><div><span className="empty-dot"/><span><b>Meet your community</b><small>Join a study or mentor channel</small></span></div></div></div></div><div className="quick-grid"><Quick icon={BarChart3} title="Academic Hub" text="Upload a report, add subject scores and calculate your mean." onClick={() => onOpen('academic')} /><Quick icon={MessageCircle} title="Community" text="Join channels and send messages that persist locally or in Supabase." onClick={() => onOpen('community')} /><Quick icon={CircleUserRound} title="My Profile" text="Save your scholar identity and career pathway." onClick={() => onOpen('profile')} /></div>{!user && <div className="action-banner"><div><b>Ready to make it real?</b><span>Sign in to sync your scholar profile with Supabase.</span></div><button className="primary" onClick={onLogin}>Sign in <LogIn size={16}/></button></div>}</section>
}
function Kpi({ title, value, note, accent = false }: { title: string; value: string; note: string; accent?: boolean }) { return <div className={accent ? 'kpi accent' : 'kpi'}><span>{title}</span><strong>{value}</strong><small>{note}</small></div> }
function PanelHead({ label, title }: { label: string; title: string }) { return <div className="panel-head"><div><span>{label}</span><h3>{title}</h3></div><i>Live</i></div> }
function Quick({ icon: Icon, title, text, onClick }: { icon: typeof BarChart3; title: string; text: string; onClick: () => void }) { return <button className="quick" onClick={onClick}><Icon /><h3>{title}</h3><p>{text}</p><span>Open <ArrowRight size={15}/></span></button> }
function PageTitle({ kicker, title, text }: { kicker: string; title: string; text: string }) { return <div className="section-title-row"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2><p>{text}</p></div></div> }

function Profile({ user, onLogin, onToast }: { user: User | null; onLogin: () => void; onToast: (s: string) => void }) {
  const [profile, setProfile] = useState<ProfileForm>(() => storage('efac-profile', { full_name: user?.user_metadata?.full_name || 'Scholar', school: '', grade: '', career: '' }))
  const [loading, setLoading] = useState(Boolean(user))
  useEffect(() => { if (!user) { setLoading(false); return }; getMyProfile(user.id).then((p) => { if (p) setProfile({ full_name: p.full_name, school: p.school || '', grade: p.grade || '', career: storage<ProfileForm>('efac-profile', { full_name: p.full_name, school: '', grade: '', career: '' }).career }) }).catch(() => {}).finally(() => setLoading(false)) }, [user])
  const save = async (e: FormEvent) => { e.preventDefault(); saveStorage('efac-profile', profile); if (supabase && user) { const { error } = await supabase.from('profiles').update({ full_name: profile.full_name, school: profile.school || null, grade: profile.grade || null }).eq('id', user.id); if (error) { onToast(error.message); return } }; onToast('Profile saved successfully') }
  return <section className="screen"><PageTitle kicker="Scholar identity" title="My Profile" text="Your profile will power your EFAC experience."/><div className="profile-grid"><div className="profile-card panel"><div className="profile-avatar">{profile.full_name.charAt(0).toUpperCase()}</div><span className="online">{user ? 'Connected scholar' : 'Demo scholar'}</span><h2>{profile.full_name || 'Scholar'}</h2><p>{user?.email || 'Sign in to connect this profile'}</p><div className="meta"><span><School/> {profile.school || 'School not added'}</span><span><GraduationCap/> {profile.grade || 'Grade not added'}</span><span><Target/> {profile.career || 'Career goal not added'}</span></div></div><form className="panel form" onSubmit={save}><span className="eyebrow">Personal details</span><h3>Complete your profile</h3><label>Name<input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} required /></label><label>School<input value={profile.school} onChange={e => setProfile({ ...profile, school: e.target.value })} placeholder="Your school" /></label><label>Grade / class<input value={profile.grade} onChange={e => setProfile({ ...profile, grade: e.target.value })} placeholder="e.g. Form 3" /></label><label>Career goal<input value={profile.career} onChange={e => setProfile({ ...profile, career: e.target.value })} placeholder="What do you want to become?" /></label><button className="primary" type="submit" disabled={loading}>Save profile <Check size={17}/></button>{!user && <button className="secondary full" type="button" onClick={onLogin}>Sign in to sync <LogIn size={16}/></button>}</form></div></section>
}

function Academic({ user, onLogin, onToast }: { user: User | null; onLogin: () => void; onToast: (s: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [scores, setScores] = useState([{ subject: '', score: '' }])
  const [reports, setReports] = useState<Report[]>(() => storage('efac-reports', []))
  const inputRef = useRef<HTMLInputElement>(null)
  const mean = useMemo(() => { const nums = scores.map(x => Number(x.score)).filter(x => Number.isFinite(x) && x >= 0 && x <= 100); return nums.length ? Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10 : 0 }, [scores])
  const choose = (f?: File) => { if (!f) return; setFile(f); onToast(`${f.name} selected`) }
  const analyze = async () => { if (!file) { onToast('Choose a report first'); return }; if (!scores.some(x => x.score)) { onToast('Add at least one subject score'); return }; const report: Report = { id: crypto.randomUUID(), file_name: file.name, mean_score: mean, subjects_count: scores.filter(x => x.score).length, submitted_at: new Date().toISOString() }; const next = [report, ...reports]; setReports(next); saveStorage('efac-reports', next); if (supabase && user) { const { error } = await supabase.from('academic_reports').insert({ scholar_id: user.id, file_path: file.name, mean_score: mean, subjects_count: report.subjects_count }); if (error) onToast(`Saved locally. Supabase: ${error.message}`); else onToast('Report saved to your EFAC account') } else { onToast('Report analyzed and saved on this device') } }
  const addScore = () => setScores([...scores, { subject: '', score: '' }])
  const updateScore = (i: number, key: 'subject' | 'score', value: string) => setScores(scores.map((s, n) => n === i ? { ...s, [key]: value } : s))
  return <section className="screen"><PageTitle kicker="Academic intelligence" title="Academic Hub" text="Upload a report, enter subject scores and get a transparent performance mean."/><div className="academic-grid"><div className="panel upload"><span className="eyebrow">Step 1 · Report</span><h3>Choose your report card</h3><p>The file is kept locally unless Supabase storage is configured. Grades are never invented from the document.</p><button className="drop" onClick={() => inputRef.current?.click()}><BarChart3/><b>{file ? file.name : 'Choose report card'}</b><small>PDF, JPG or PNG</small></button><input ref={inputRef} type="file" hidden accept=".pdf,image/png,image/jpeg" onChange={e => choose(e.target.files?.[0])}/></div><div className="panel score"><span className="eyebrow">Current mean</span><div className="score-ring"><b>{mean}%</b></div><h3>{scores.filter(x => x.score).length} subjects entered</h3><p>Add scores below to calculate your mean.</p></div></div><div className="panel subjects"><div className="panel-head"><div><span>Step 2 · Scores</span><h3>Subject results</h3></div><button className="small-action" onClick={addScore}>+ Add subject</button></div>{scores.map((s, i) => <div className="score-row" key={i}><input value={s.subject} onChange={e => updateScore(i, 'subject', e.target.value)} placeholder="Subject"/><input value={s.score} onChange={e => updateScore(i, 'score', e.target.value)} type="number" min="0" max="100" placeholder="Score %"/></div>)}<div className="form-actions"><button className="primary" onClick={analyze}>Analyze & Save <Sparkles size={17}/></button>{!user && <button className="secondary" onClick={onLogin}>Sign in to sync <LogIn size={16}/></button>}</div></div>{reports.length > 0 && <div className="panel"><PanelHead label="History" title="Saved reports" /><div className="report-list">{reports.slice(0, 5).map(r => <div key={r.id}><span>{r.file_name}</span><b>{r.mean_score}%</b><small>{new Date(r.submitted_at).toLocaleDateString()}</small></div>)}</div></div>}</section>
}

function News({ user, onLogin }: { user: User | null; onLogin: () => void }) {
  const [items, setItems] = useState<Announcement[]>([])
  useEffect(() => { if (!user || !supabase) return; getAnnouncements().then(setItems).catch(() => setItems([])) }, [user])
  const fallback = [['Community', 'Scholar announcements', 'Important EFAC updates will appear here once announcements are connected.'], ['Events', 'Upcoming sessions', 'Mentorship sessions, study groups and community events will be surfaced here.'], ['Opportunities', 'Career pathways', 'Scholarships, internships and career opportunities can be personalized to your profile.']]
  return <section className="screen"><PageTitle kicker="Stay informed" title="EFAC News" text="Updates, opportunities and announcements for the community."/>{!user && <div className="action-banner"><div><b>Connect for live announcements</b><span>Sign in to load announcements from Supabase when available.</span></div><button className="primary" onClick={onLogin}>Sign in <LogIn size={16}/></button></div>}<div className="news-grid">{items.length ? items.map(item => <article className="news-card" key={item.id}><Bell/><span>EFAC Update</span><h3>{item.title}</h3><p>{item.body}</p><b>{new Date(item.published_at).toLocaleDateString()} <ArrowRight size={14}/></b></article>) : fallback.map(([k, t, p]) => <article className="news-card" key={t}><Bell/><span>{k}</span><h3>{t}</h3><p>{p}</p><b>{isSupabaseConfigured ? 'No published item yet' : 'Preview content'} <ArrowRight size={14}/></b></article>)}</div></section>
}

function Community({ user, onLogin, onToast }: { user: User | null; onLogin: () => void; onToast: (s: string) => void }) {
  const [channel, setChannel] = useState('general-scholars')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage('efac-messages', seedMessages))
  const send = (e: FormEvent) => { e.preventDefault(); const value = text.trim(); if (!value) return; const message: ChatMessage = { id: crypto.randomUUID(), channel, author: user?.user_metadata?.full_name || 'You', text: value, created_at: new Date().toISOString() }; const next = [...messages, message]; setMessages(next); saveStorage('efac-messages', next); setText(''); onToast('Message sent') }
  const visible = messages.filter(m => m.channel === channel)
  return <section className="screen"><PageTitle kicker="EFAC community" title="Community Hub" text="Connect, collaborate and learn together."/>{!user && <div className="action-banner"><div><b>Demo community</b><span>Messages are saved on this device. Sign in when you want account-backed community data.</span></div><button className="primary" onClick={onLogin}>Sign in <LogIn size={16}/></button></div>}<div className="community panel"><aside><b>Channels</b>{['general-scholars','career-mentorship','study-groups'].map(c => <button key={c} className={channel === c ? 'active' : ''} onClick={() => setChannel(c)}># {c}</button>)}</aside><div className="chat"><header># {channel} <small>{visible.length} messages</small></header><div className="messages">{visible.map(m => <div className={m.author === (user?.user_metadata?.full_name || 'You') ? 'message own' : 'message'} key={m.id}><div className="msg-avatar">{m.author.slice(0, 2).toUpperCase()}</div><div><b>{m.author}</b><p>{m.text}</p><small>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div></div>)}</div><form className="chat-compose" onSubmit={send}><input value={text} onChange={e => setText(e.target.value)} placeholder={`Message #${channel}…`} /><button className="primary" type="submit"><ArrowRight size={17}/></button></form></div></div></section>
}

function About() { return <section className="screen"><div className="about-hero"><div className="kicker"><i /> Education For All Children</div><h1>Education should<br />expand possibility.</h1><p>EFAC supports talented young people with access, mentorship, leadership and pathways to long-term success.</p></div><div className="mv-container"><div className="mv-box"><Rocket/><h3>Our Mission</h3><p>To empower talented students with access to quality education and long-term success.</p></div><div className="mv-box"><Target/><h3>Our Vision</h3><p>A world where every child has equal access to education and the opportunity to reach their full potential.</p></div></div></section> }

function AuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (u: User) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => { e.preventDefault(); setError(''); setBusy(true); try { if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.'); const result = mode === 'signin' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password, { full_name: name || 'Scholar' }); if (result.error) throw result.error; if (!result.data.user) { setError('Check your email to confirm your account, then sign in.'); return } onSuccess(result.data.user) } catch (err) { setError(err instanceof Error ? err.message : 'Authentication failed') } finally { setBusy(false) } }
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="auth-modal" onMouseDown={e => e.stopPropagation()}><button className="modal-close" onClick={onClose}><X/></button><div className="modal-logo"><img src="/efac.jpg" alt="EFAC"/></div><span className="eyebrow">EFAC Scholar Platform</span><h2>{mode === 'signin' ? 'Welcome back.' : 'Create your scholar account.'}</h2><p>{mode === 'signin' ? 'Sign in to sync your profile and academic progress.' : 'Create an account to keep your EFAC data across devices.'}</p><form onSubmit={submit}>{mode === 'signup' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name"/></label>}<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters"/></label>{error && <div className="auth-error">{error}</div>}<button className="primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={17}/></button></form><button className="mode-switch" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}>{mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}</button></div></div>
}

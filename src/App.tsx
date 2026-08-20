import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Award, BarChart3, Bell, BriefcaseBusiness, Check, ChevronDown, CircleUserRound, GraduationCap, HeartPulse, Home, Menu, MessageCircle, Moon, Quote, Rocket, School, Sparkles, Sun, Target, Users, X } from 'lucide-react'
import './styles.css'

type View = 'dashboard' | 'profile' | 'academic' | 'news' | 'community' | 'about'

const programs = [
  { icon: GraduationCap, number: '01', title: 'Academic Access', text: 'Scholarships, academic support and tools that help students perform with confidence.' },
  { icon: Rocket, number: '02', title: 'Leadership', text: 'Build voice, responsibility and the confidence to create change in your community.' },
  { icon: HeartPulse, number: '03', title: 'Wellness', text: 'Support the person behind the grades with wellbeing, belonging and trusted relationships.' },
  { icon: BriefcaseBusiness, number: '04', title: 'Career Pathways', text: 'Mentorship, exposure and practical pathways from school toward opportunity.' },
]

export default function App() {
  const [platform, setPlatform] = useState(false)
  const [view, setView] = useState<View>('dashboard')
  const [dark, setDark] = useState(false)
  const [menu, setMenu] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)

  const openPlatform = () => { setPlatform(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openView = (next: View) => { setView(next); setMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  if (!platform) return <PublicSite onEnter={openPlatform} mobileNav={mobileNav} setMobileNav={setMobileNav} />

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
              <button className="menu-back" onClick={() => setPlatform(false)}><ArrowRight size={16} className="flip" /> Back to EFAC</button>
            </div>}
          </div>
          <div className="avatar">S</div>
        </div>
      </header>
      <main className="platform-main">
        {view === 'dashboard' && <Dashboard onOpen={openView} />}
        {view === 'profile' && <Profile />}
        {view === 'academic' && <Academic />}
        {view === 'news' && <News />}
        {view === 'community' && <Community />}
        {view === 'about' && <About />}
      </main>
    </div>
  )
}

function NavButton({ icon: Icon, label, active, onClick }: { icon: typeof Home; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? 'nav-button active' : 'nav-button'} onClick={onClick}><Icon size={16} />{label}</button>
}

function PublicSite({ onEnter, mobileNav, setMobileNav }: { onEnter: () => void; mobileNav: boolean; setMobileNav: (v: boolean) => void }) {
  return <div className="public-site">
    <header className="public-header">
      <a className="brand" href="#top"><img src="/efac.jpg" alt="EFAC" /><span>EFAC</span></a>
      <nav className={mobileNav ? 'public-links open' : 'public-links'}><a href="#mission" onClick={() => setMobileNav(false)}>Mission</a><a href="#programs" onClick={() => setMobileNav(false)}>Programs</a><a href="#impact" onClick={() => setMobileNav(false)}>Impact</a><a href="#about" onClick={() => setMobileNav(false)}>About</a></nav>
      <button className="public-platform" onClick={onEnter}>Scholar Platform <ArrowUpRight size={17} /></button>
      <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">{mobileNav ? <X /> : <Menu />}</button>
    </header>
    <main id="top">
      <section className="public-hero">
        <div className="hero-grid" /><div className="hero-glow one" /><div className="hero-glow two" />
        <div className="hero-copy"><span className="kicker"><i /> Education For All Children</span><h1>Every child deserves<br /><em>a future they can choose.</em></h1><p>EFAC creates pathways for talented young people through education, mentorship, leadership and access to opportunity.</p><div className="hero-actions"><button className="primary" onClick={onEnter}>Enter Scholar Platform <ArrowRight size={18} /></button><a className="secondary" href="#mission">Discover EFAC <ArrowRight size={18} /></a></div><div className="hero-note"><Sparkles size={15} /> Education is not just access. It's the beginning of possibility.</div></div>
        <div className="hero-art"><div className="hero-card"><div className="hero-card-logo"><img src="/efac.jpg" alt="EFAC" /></div><span>EFAC</span><h3>Education<br />with purpose.</h3><div className="hero-rule" /><small>Access · Leadership · Wellness · Career</small></div><div className="float-card first"><GraduationCap /><span><b>Academic Access</b><small>Support that opens doors</small></span></div><div className="float-card second"><Users /><span><b>Community</b><small>Grow together</small></span></div></div>
      </section>
      <div className="marquee"><span>ACADEMIC ACCESS</span><i>✦</i><span>MENTORSHIP</span><i>✦</i><span>LEADERSHIP</span><i>✦</i><span>WELLNESS</span><i>✦</i><span>CAREER PATHWAYS</span></div>
      <section id="mission" className="public-section split"><div className="section-no">01 / WHY EFAC</div><div className="split-grid"><h2>Education should expand <em>possibility.</em></h2><div><p className="large">We believe talent exists everywhere, but opportunity doesn't. EFAC works to close that gap by supporting young people with the resources, relationships and confidence they need to build their next chapter.</p><p>From academic support to leadership and career pathways, we focus on the whole scholar — not just the classroom.</p></div></div></section>
      <section id="programs" className="public-section programs"><div className="section-head"><div><div className="section-no">02 / WHAT WE DO</div><h2>Four pathways.<br /><em>One bigger future.</em></h2></div><p>Our programs are designed to support scholars at the moments that matter.</p></div><div className="program-grid">{programs.map(({ icon: Icon, number, title, text }) => <article className="program-card" key={title}><span>{number}</span><Icon /><h3>{title}</h3><p>{text}</p><a href="#impact">Explore <ArrowRight size={15} /></a></article>)}</div></section>
      <section id="impact" className="impact"><div className="impact-inner"><div><div className="section-no light">03 / THE JOURNEY</div><h2>From the classroom<br />to the <em>next chapter.</em></h2><p>EFAC is being built as a long-term ecosystem — helping scholars track progress, find mentors, join communities and discover opportunities.</p><button className="outline" onClick={onEnter}>Explore scholar experience <ArrowRight size={17} /></button></div><div className="journey">{['Learn','Grow','Connect','Launch'].map((x, i) => <div key={x}><strong>0{i + 1}</strong><b>{x}</b><small>{['Academic support','Mentorship & leadership','Community & opportunity','Career pathways'][i]}</small></div>)}</div></div></section>
      <section id="about" className="public-section split about"><div className="section-no">04 / ABOUT EFAC</div><div className="split-grid"><h2>Built for the<br /><em>long journey.</em></h2><div><p className="large">EFAC is committed to creating a world where every child has equal access to education and the opportunity to reach their full potential.</p><div className="principles"><div><Target /><span><b>Mission</b>Empower talented students with access to quality education and long-term support.</span></div><div><Award /><span><b>Vision</b>A future where opportunity is not determined by a child's circumstances.</span></div></div></div></div></section>
      <section className="public-cta"><div><div className="section-no light">READY?</div><h2>Be part of someone's<br /><em>next chapter.</em></h2><p>Explore EFAC, support the mission or enter the scholar platform.</p><button className="primary" onClick={onEnter}>Enter Scholar Platform <ArrowRight size={18} /></button></div><div className="cta-logo"><img src="/efac.jpg" alt="EFAC" /></div></section>
    </main><footer><div className="brand"><img src="/efac.jpg" alt="EFAC" /><span>EFAC</span></div><span>Education For All Children</span><span>© 2026 EFAC</span></footer>
  </div>
}

function Dashboard({ onOpen }: { onOpen: (v: View) => void }) { return <section className="screen"><div className="screen-hero"><div><span className="kicker"><i /> Scholar workspace</span><h1>Welcome back, Scholar.</h1><p>Your space for academic progress, community and opportunity.</p></div><div className="quote-card"><Sparkles /><span>Keep going</span><b>Small steps. Big future.</b></div></div><div className="kpis"><Kpi title="Academic score" value="88%" note="Demo until reports connect" /><Kpi title="EFAC rank" value="—" note="Verified data coming soon" /><Kpi title="Reports" value="0" note="Upload your first report" /><Kpi title="Next step" value="Profile" note="Complete your scholar profile" accent /></div><div className="dash-grid"><div className="panel"><PanelHead label="Performance" title="Academic snapshot" /><div className="chart"><div className="chart-bars"><i style={{height:'42%'}}/><i style={{height:'68%'}}/><i style={{height:'86%'}}/><i style={{height:'73%'}}/><i style={{height:'94%'}}/></div><div className="chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span></div></div></div><div className="panel"><PanelHead label="Up next" title="Your pathway" /><div className="path"><div><Check /><span><b>Create your profile</b><small>Add school and career details</small></span></div><div><span className="empty-dot"/><span><b>Upload a report</b><small>Unlock academic analytics</small></span></div><div><span className="empty-dot"/><span><b>Meet your community</b><small>Join a study or mentor channel</small></span></div></div></div></div><div className="quick-grid"><Quick icon={BarChart3} title="Academic Hub" text="Upload reports and understand your progress." onClick={() => onOpen('academic')} /><Quick icon={MessageCircle} title="Community" text="Connect with scholars, mentors and study groups." onClick={() => onOpen('community')} /><Quick icon={CircleUserRound} title="My Profile" text="Build your scholar identity and career pathway." onClick={() => onOpen('profile')} /></div></section> }
function Kpi({title,value,note,accent=false}:{title:string;value:string;note:string;accent?:boolean}) { return <div className={accent?'kpi accent':'kpi'}><span>{title}</span><strong>{value}</strong><small>{note}</small></div> }
function PanelHead({label,title}:{label:string;title:string}) { return <div className="panel-head"><div><span>{label}</span><h3>{title}</h3></div><i>Demo</i></div> }
function Quick({icon:Icon,title,text,onClick}:{icon:typeof BarChart3;title:string;text:string;onClick:()=>void}) { return <button className="quick" onClick={onClick}><Icon /><h3>{title}</h3><p>{text}</p><span>Open <ArrowRight size={15}/></span></button> }

function Profile(){return <section className="screen"><PageTitle kicker="Scholar identity" title="My Profile" text="Your profile will power your EFAC experience."/><div className="profile-grid"><div className="profile-card panel"><div className="profile-avatar">S</div><span className="online">Active scholar</span><h2>Scholar</h2><p>EFAC Scholar</p><div className="meta"><span><School/> School not added</span><span><GraduationCap/> Class not added</span><span><Target/> Career goal not added</span></div></div><div className="panel form"><span className="eyebrow">Personal details</span><h3>Complete your profile</h3><label>Name<input defaultValue="Scholar" /></label><label>School<input placeholder="Your school" /></label><label>Career goal<input placeholder="What do you want to become?" /></label><button className="primary">Save profile <Check size={17}/></button></div></div></section>}
function Academic(){return <section className="screen"><PageTitle kicker="Academic intelligence" title="Academic Hub" text="Understand your performance and make your next move."/><div className="academic-grid"><div className="panel upload"><span className="eyebrow">Secure upload</span><h3>Report Card</h3><p>Upload a PDF or image to prepare for real analytics.</p><div className="drop"><BarChart3/><b>Choose report card</b><small>PDF, JPG or PNG</small></div><button className="primary">Analyze & Rank <Sparkles size={17}/></button></div><div className="panel score"><span className="eyebrow">Current mean</span><div className="score-ring"><b>0%</b></div><h3>Subjects tracked: 0</h3><p>Upload a report to populate real data.</p></div></div></section>}
function News(){return <section className="screen"><PageTitle kicker="Stay informed" title="EFAC News" text="Updates, opportunities and announcements for the community."/><div className="news-grid">{[['Community','Scholar announcements','Important EFAC updates will appear here once announcements are connected to Supabase.',Bell],['Events','Upcoming sessions','Mentorship sessions, study groups and community events will be surfaced here.',Users],['Opportunities','Career pathways','Scholarships, internships and career opportunities will be personalized to your profile.',BriefcaseBusiness]].map(([k,t,p,I])=>{const Icon=I as typeof Bell;return <article className="news-card" key={t}><Icon/><span>{k}</span><h3>{t}</h3><p>{p}</p><b>Coming soon <ArrowRight size={14}/></b></article>})}</div></section>}
function Community(){return <section className="screen"><PageTitle kicker="EFAC community" title="Community Hub" text="Connect, collaborate and learn together."/><div className="community panel"><aside><b>Channels</b><button className="active"># general-scholars</button><button># career-mentorship</button><button># study-groups</button></aside><div className="chat"><header># general-scholars <small>3 members</small></header><div className="message"><div>EF</div><span><b>EFAC</b><p>Welcome to the scholar community. Be kind, curious and helpful.</p></span></div><div className="compose"><input placeholder="Message #general-scholars…"/><button><ArrowRight/></button></div></div></div></section>}
function About(){return <section className="screen"><div className="about-screen"><span className="kicker"><i/> Education For All Children</span><h1>Education should<br /><em>expand possibility.</em></h1><p>EFAC supports talented young people with access, mentorship, leadership and pathways to long-term success.</p><div className="about-cards"><div><Rocket/><h3>Our Mission</h3><p>Empower talented students with access to quality education and long-term support.</p></div><div><Target/><h3>Our Vision</h3><p>A world where every child has equal access to education and the opportunity to reach their full potential.</p></div></div><div className="quote"><Quote/><p>Education is the most powerful weapon which you can use to change the world.</p><small>Guiding principle</small></div></div></section>}
function PageTitle({kicker,title,text}:{kicker:string;title:string;text:string}){return <div className="page-title"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{text}</p></div>}

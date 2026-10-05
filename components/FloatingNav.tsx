"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Bootstrap } from '@/lib/types'
import { safeHref } from '@/lib/utils'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'

export default function FloatingNav({ data }: { data: Bootstrap }) {
  const [menuOpen,setMenuOpen]=useState(false)
  const links = [...data.navigation].filter(n => n.enabled !== false && String(n.enabled).toLowerCase()!=='false').sort((a,b) => Number(a.sort_order)-Number(b.sort_order))
  const showLogo=String(data.site.header_show_logo||'true').toLowerCase()!=='false'
  const showTheme=String(data.site.show_theme_toggle||'true').toLowerCase()!=='false'
  const showNotifications=String(data.site.enable_notifications||'true').toLowerCase()!=='false'

  useEffect(()=>{
    if(!menuOpen) return
    const close=(e:KeyboardEvent)=>{ if(e.key==='Escape') setMenuOpen(false) }
    window.addEventListener('keydown',close)
    document.body.classList.add('nav-open')
    return ()=>{ window.removeEventListener('keydown',close); document.body.classList.remove('nav-open') }
  },[menuOpen])

  return <>
    <nav className="floating-nav" aria-label="Primary navigation">
      <Link className="brand-mark" href="/" aria-label="Teshow and Ping Clover Notes home" onClick={()=>setMenuOpen(false)}>
        {showLogo?<img src="/teshow-ping-clover-notes-logo.png" alt="Teshow and Ping Clover Notes" />:<span>{data.site.site_name||'Teshow and Ping Clover Notes'}</span>}
      </Link>
      <div className="nav-scroll nav-desktop">{links.map(n=><Link key={n.nav_id} href={safeHref(n.href,'/')}>{n.label}</Link>)}</div>
      <div className="nav-tools">
        {showTheme&&<ThemeToggle label={data.site.theme_toggle_label||'Theme'}/>} {showNotifications&&<NotificationBell notifications={data.notifications} ui={data.ui}/>}
        <button className={`nav-menu-toggle ${menuOpen?'active':''}`} type="button" onClick={()=>setMenuOpen(v=>!v)} aria-expanded={menuOpen} aria-controls="mobile-site-menu" aria-label={menuOpen?'Close menu':'Open menu'}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div className={`mobile-nav-backdrop ${menuOpen?'show':''}`} onClick={()=>setMenuOpen(false)} aria-hidden="true" />
    <aside id="mobile-site-menu" className={`mobile-nav-sheet ${menuOpen?'show':''}`} aria-hidden={!menuOpen}>
      <div className="mobile-nav-head"><div><p className="eyebrow">Explore</p><strong>{data.site.site_name||"Teshow and Ping Clover Notes"}</strong></div><button onClick={()=>setMenuOpen(false)} aria-label="Close menu">×</button></div>
      <div className="mobile-nav-links">{links.map((n,i)=><Link key={n.nav_id} href={safeHref(n.href,'/')} onClick={()=>setMenuOpen(false)}><span>{String(i+1).padStart(2,'0')}</span><b>{n.label}</b><em>→</em></Link>)}</div>
      <p className="mobile-nav-note">{data.site.site_tagline||'Made by fans, for fans of Teshow & Ping.'}</p>
    </aside>
  </>
}

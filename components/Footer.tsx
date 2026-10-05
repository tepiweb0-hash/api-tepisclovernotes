import Link from 'next/link'
import type { Bootstrap } from '@/lib/types'
import { safeHref } from '@/lib/utils'

export default function Footer({ data }: { data: Bootstrap }) {
  const socials=data.socials.filter(s=>s.enabled!==false&&String(s.enabled).toLowerCase()!=='false'&&String(s.url||'').trim()).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
  const nav=data.navigation.filter(n=>n.enabled!==false&&String(n.enabled).toLowerCase()!=='false').sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
  return <footer className="site-footer">
    <div className="footer-glow" aria-hidden="true"></div>
    <div className="footer-brand"><img src="/teshow-ping-clover-notes-logo.png" alt="Teshow and Ping Clover Notes" className="footer-logo"/><p className="footer-kicker">Fan archive • Thailand</p><h2>{data.site.footer_title||"TePi's Clover Note 2026"}</h2><p>{data.site.official_disclaimer||'Fan-made website. Not officially affiliated with GMMTV.'}</p><small className="footer-copyright">{data.site.footer_copyright||'© 2026 TePi\'s Clover Note'}</small></div>
    <div className="footer-columns"><div><p className="footer-label">{data.site.footer_nav_heading||'Explore'}</p>{nav.map(n=><Link key={n.nav_id} href={safeHref(n.href,'/')}>{n.label}<span>↗</span></Link>)}</div>{socials.length>0&&<div><p className="footer-label">{data.site.footer_contact_heading||'Contact us through socials'}</p><Link href="/qr">All social links<span>→</span></Link>{socials.map(s=><a key={s.social_id} href={safeHref(s.url)} target="_blank" rel="noreferrer">{s.label}<span>↗</span></a>)}</div>}</div>
  </footer>
}

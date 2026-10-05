import Link from 'next/link'
import { getBootstrap, published } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import Calendar from '@/components/Calendar'
import { formatDate, formatTime12, timezoneLabel } from '@/lib/utils'

export default async function EventsPage(){
  const data=await getBootstrap(); if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>
  const events=published(data.events),eps=data.episodes.filter(e=>e.enabled!==false).map(e=>{const s=data.series.find(x=>x.series_id===e.series_id);return{...e,series_slug:s?.slug,series_title:s?.title}}),page=data.pages.find(p=>p.page_id==='page-events')
  const upcoming=[...events].filter(e=>String(e.start_date)>=new Date().toISOString().slice(0,10)).sort((a,b)=>String(a.start_date).localeCompare(String(b.start_date))).slice(0,4)
  return <SiteShell data={data}><section className="page-hero page-pad"><p className="eyebrow">{page?.hero_eyebrow||'Events'}</p><h1>{page?.hero_title||'Calendar & notifications'}</h1><p className="lede">{page?.hero_body||'Click any date to open its schedule, then explore quick info or the full event page.'}</p></section><section className="page-pad premium-section"><Calendar events={events} episodes={eps} labels={data.ui}/></section>{upcoming.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Coming up</p><h2>Dates worth keeping.</h2></div></div><div className="event-card-grid">{upcoming.map(e=><Link className="event-card" key={e.event_id} href={`/events/${e.slug}`}><p className="eyebrow">{formatDate(e.start_date)} {e.start_time&&`• ${formatTime12(e.start_time)}`}</p><h3>{e.title}</h3><p>{e.quick_info||e.short_info}</p>{e.start_time&&<small>{timezoneLabel(e.timezone||'Asia/Bangkok')}</small>}<b>View event →</b></Link>)}</div></section>}</SiteShell>
}

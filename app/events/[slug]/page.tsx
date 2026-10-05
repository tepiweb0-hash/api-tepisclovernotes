import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findMedia, getBootstrap } from '@/lib/content'
import { formatLongDate, formatTime12, timezoneLabel } from '@/lib/utils'
import SiteShell from '@/components/SiteShell'
import MediaImage from '@/components/MediaImage'
import MediaGallery from '@/components/MediaGallery'
import NewsGrid from '@/components/NewsGrid'

export default async function EventDetail({params}:{params:{slug:string}}){
  const data=await getBootstrap(),e=data.events.find(x=>x.slug===params.slug&&x.enabled!==false); if(!e)notFound(); const m=findMedia(data,e.featured_media_id)
  const gal=data.galleries.filter(g=>g.entity_type==='event'&&g.entity_id===e.event_id&&g.enabled!==false).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order)).map(g=>findMedia(data,g.media_id)).filter(Boolean) as any[]
  const relatedSeries=data.series.find(s=>s.series_id===e.related_series_id),news=data.news.filter(n=>n.status==='published'&&(n.related_series_id===e.related_series_id||n.related_artist_id===e.related_artist_id)).slice(0,3)
  return <SiteShell data={data}><section className="detail-page page-pad"><p className="eyebrow">{data.ui.event_label||'Event'} • {e.event_type}</p><h1>{e.title}</h1><p className="lede">{e.quick_info||e.short_info}</p>{m&&<MediaImage src={m.url} alt={m.alt_text||e.title} className="wide-media"/>}<div className="event-facts"><div><span>Date</span><strong>{formatLongDate(e.start_date)}</strong></div>{e.start_time&&<div><span>Time</span><strong>{formatTime12(e.start_time)} · {timezoneLabel(e.timezone||'Asia/Bangkok')}</strong></div>}{e.location&&<div><span>Location</span><strong>{e.location}</strong></div>}{relatedSeries&&<div><span>Related series</span><Link href={`/series/${relatedSeries.slug}`}>{relatedSeries.title} →</Link></div>}</div><div className="detail-copy prose"><p>{e.full_info||e.description}</p>{e.online_url&&<a className="button primary" href={e.online_url} target="_blank" rel="noreferrer">{data.ui.event_link||'Event link'} ↗</a>}</div></section>{gal.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Photos</p><h2>Event album.</h2></div></div><MediaGallery items={gal} mode="carousel"/></section>}{news.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Related</p><h2>News & updates.</h2></div></div><NewsGrid data={data} rows={news}/></section>}</SiteShell>
}

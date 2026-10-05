import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findMedia, getBootstrap } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import SiteShell from '@/components/SiteShell'
import MediaImage from '@/components/MediaImage'
import NewsGrid from '@/components/NewsGrid'
import SeriesCard from '@/components/SeriesCard'

export default async function NewsDetail({params}:{params:{slug:string}}){const data=await getBootstrap(),n=data.news.find(x=>x.slug===params.slug);if(!n)notFound();const m=findMedia(data,n.featured_media_id),series=data.series.find(s=>s.series_id===n.related_series_id),more=data.news.filter(x=>x.status==='published'&&x.news_id!==n.news_id&&(x.related_series_id===n.related_series_id||x.related_artist_id===n.related_artist_id)).slice(0,3);return <SiteShell data={data}><article className="detail-page page-pad"><p className="eyebrow">News • {formatDate(n.publish_date)}</p><h1>{n.title}</h1><p className="lede">{n.excerpt}</p>{m&&<MediaImage src={m.url} alt={m.alt_text||n.title} className="wide-media"/>}<div className="prose"><p>{n.body}</p>{n.source_url&&<p><a className="text-link" href={n.source_url} target="_blank" rel="noreferrer">{data.ui.original_source||'Original source'} ↗</a></p>}</div></article>{series&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Related series</p><h2>Continue from the story.</h2></div></div><div className="series-grid compact"><SeriesCard series={series} data={data}/></div></section>}{more.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">More updates</p><h2>Keep reading.</h2></div><Link className="text-link" href="/news">All news →</Link></div><NewsGrid data={data} rows={more}/></section>}</SiteShell>}

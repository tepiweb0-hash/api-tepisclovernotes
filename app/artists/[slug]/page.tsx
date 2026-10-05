import Link from 'next/link'
import { notFound } from 'next/navigation'
import { findMedia, getBootstrap } from '@/lib/content'
import { formatDate, relatedNews } from '@/lib/utils'
import SiteShell from '@/components/SiteShell'
import MediaImage from '@/components/MediaImage'
import MediaGallery from '@/components/MediaGallery'
import SeriesCard from '@/components/SeriesCard'
import NewsGrid from '@/components/NewsGrid'

export async function generateMetadata({params}:{params:{slug:string}}){const d=await getBootstrap();const a=d.artists.find(x=>x.slug===params.slug);return{title:a?.seo_title||a?.full_name||'Artist',description:a?.seo_description||a?.quick_info}}

export default async function ArtistDetail({params}:{params:{slug:string}}){
  const data=await getBootstrap(),artist=data.artists.find(a=>a.slug===params.slug); if(!artist)notFound()
  const media=findMedia(data,artist.hero_media_id||artist.profile_media_id),roles=data.seriesCast.filter(c=>c.artist_id===artist.artist_id&&c.enabled!==false).sort((a,b)=>Number(a.billing_order)-Number(b.billing_order)),series=roles.map(r=>data.series.find(s=>s.series_id===r.series_id)).filter(Boolean) as any[]
  const timeline=data.artistTimeline.filter(t=>t.artist_id===artist.artist_id&&t.enabled!==false).sort((a,b)=>String(a.date).localeCompare(String(b.date))),achievements=data.artistAchievements.filter(x=>x.artist_id===artist.artist_id&&x.enabled!==false).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
  const currentRole=roles.find(r=>{const s=data.series.find(x=>x.series_id===r.series_id);return s?.status==='airing'})||roles[roles.length-1],currentSeries=data.series.find(s=>s.series_id===currentRole?.series_id),currentPoster=findMedia(data,currentSeries?.poster_media_id)
  const galleries=data.galleries.filter(g=>g.entity_type==='artist'&&g.entity_id===artist.artist_id&&g.enabled!==false).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order)),galleryMedia=galleries.map(g=>findMedia(data,g.media_id)).filter(Boolean) as any[]
  const related=relatedNews(data.news,undefined,artist.artist_id,6); const inferred=data.news.filter(n=>n.status==='published'&&series.some(s=>s.series_id===n.related_series_id)); const news=Array.from(new Map([...related,...inferred].map(n=>[n.news_id,n])).values()).slice(0,3)
  const other=data.artists.filter(a=>a.artist_id!==artist.artist_id&&a.status==='published').slice(0,1)
  return <SiteShell data={data}>
    <section className="artist-detail-hero page-pad"><div className="artist-hero-copy"><p className="eyebrow">Artist profile</p><h1>{artist.full_name}</h1><p className="native-name">{artist.native_name}</p><div className="role-list">{roles.slice(0,4).map(r=>{const s=data.series.find(x=>x.series_id===r.series_id);return <p key={r.cast_id}><strong>{r.character_name}</strong><span>in {s?.title||'Series'}</span></p>})}</div><p className="lede small">{artist.bio}</p><div className="fact-pills"><span>Born {formatDate(artist.birth_date)}</span>{artist.agency&&<span>{artist.agency}</span>}{artist.height_cm&&<span>{artist.height_cm} cm</span>}{artist.nationality&&<span>{artist.nationality}</span>}</div></div><div className="artist-portrait-frame"><MediaImage src={media?.url} alt={media?.alt_text||artist.display_name} className="artist-hero-image" eager/><span className="portrait-badge">{artist.display_name}</span></div></section>

    {currentSeries&&<section className="page-pad premium-section"><div className="feature-strip"><div><p className="eyebrow">Current / featured project</p><h2>{currentSeries.title}</h2><p>{currentRole?.character_name&&<><strong>{artist.display_name}</strong> as <strong>{currentRole.character_name}</strong>. </>}{currentSeries.short_synopsis}</p><Link className="button primary" href={`/series/${currentSeries.slug}`}>Explore series</Link></div><MediaImage src={currentPoster?.url} alt={currentSeries.title} className="feature-strip-image"/></div></section>}

    <section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Journey</p><h2>{data.ui.timeline_label||'Timeline'}</h2></div></div><div className="timeline premium-timeline">{timeline.map((t,i)=><article key={t.timeline_id}><div className="timeline-marker"><span>{String(i+1).padStart(2,'0')}</span></div><div className="timeline-year">{t.year_label||formatDate(t.date)}</div><div className="timeline-content"><h3>{t.title}</h3><p>{t.description}</p></div></article>)}</div></section>

    <section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Milestones</p><h2>{data.ui.achievements_label||'Achievements'}</h2></div></div>{achievements.length?<div className="achievement-grid">{achievements.map(a=><article className="achievement-card" key={a.achievement_id}><p className="eyebrow">{a.organization||formatDate(a.date)}</p><h3>{a.title}</h3><p>{a.description}</p></article>)}</div>:<div className="empty-card"><h3>More milestones coming soon.</h3><p>Career highlights and recognitions will appear here as they are published.</p></div>}</section>

    <section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Filmography</p><h2>{data.ui.series_label||'Series'}</h2></div><Link className="text-link" href="/series">Explore all →</Link></div><div className="series-grid compact">{series.map(s=><SeriesCard key={s.series_id} series={s} data={data}/>)}</div></section>

    {galleryMedia.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Media</p><h2>Photo notes.</h2></div></div><MediaGallery items={galleryMedia} mode="carousel"/></section>}
    {news.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Related updates</p><h2>News around {artist.display_name}.</h2></div><Link className="text-link" href="/news">All news →</Link></div><NewsGrid data={data} rows={news}/></section>}
    {other.length>0&&<section className="page-pad premium-section closing-cta"><p className="eyebrow">Keep exploring</p><h2>There’s another side of TePi’s Clover Note.</h2><Link className="button primary" href={`/artists/${other[0].slug}`}>Meet {other[0].display_name}</Link></section>}
  </SiteShell>
}

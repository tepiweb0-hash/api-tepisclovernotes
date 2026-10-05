import Link from 'next/link'
import { getBootstrap, findMedia, published, sortRows } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import MediaImage from '@/components/MediaImage'
import NewsGrid from '@/components/NewsGrid'
import SeriesCard from '@/components/SeriesCard'

export default async function Home(){
  const data=await getBootstrap(); if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>
  const features=data.homeFeatures.filter(f=>f.enabled!==false&&String(f.enabled).toLowerCase()!=='false').sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
  const latestFeature=(slot:string)=>[...features].reverse().find(f=>f.slot===slot)
  const hero=latestFeature('hero'),current=latestFeature('current_series'),artistHeading=latestFeature('artist_heading'),newsHeading=latestFeature('news_heading'),homePage=data.pages.find(p=>p.page_id==='page-home')
  const configuredArtistFeatures=features.filter(f=>f.slot==='artist_showcase')
  const artistFeatures=configuredArtistFeatures.length>0?configuredArtistFeatures:sortRows(published(data.artists)).slice(0,2).map((a:any,i:number)=>({feature_id:`fallback-artist-${i}`,entity_id:a.artist_id,media_id_override:a.profile_media_id}))
  const currentSeries=data.series.find(s=>s.series_id===current?.entity_id)||sortRows(published(data.series)).find(s=>s.featured===true)||sortRows(published(data.series))[0]
  const currentMedia=findMedia(data,current?.media_id_override)||findMedia(data,currentSeries?.poster_media_id)
  const moreSeries=sortRows(published(data.series)).filter(s=>s.series_id!==currentSeries?.series_id).slice(0,4)
  return <SiteShell data={data}>
    <section className="home-hero page-pad"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-clover" aria-hidden="true">✦</div><p className="eyebrow">{homePage?.hero_eyebrow||'Fan-made archive'}</p><h1>{hero?.title_override||homePage?.hero_title||data.site.site_name||'Teshow and Ping Clover Notes'}</h1><p className="lede">{hero?.copy_override||homePage?.hero_body||data.site.site_tagline}</p><div className="hero-actions">{hero?.button_href&&<Link className="button primary" href={hero.button_href}>{hero.button_label||'Explore'}</Link>}<Link className="button ghost" href="/artists">Meet Teshow & Ping</Link></div><div className="hero-note"><span>01</span><p>Profiles</p><span>02</span><p>Series & episodes</p><span>03</span><p>Events & updates</p></div></section>

    {currentSeries&&<section className="current-series page-pad premium-section"><div className="section-heading centered"><div><p className="eyebrow">{current?.title_override||data.ui.current_series_label||'Now watching'}</p><h2>{currentSeries.title}</h2></div></div><div className="current-series-frame"><MediaImage src={currentMedia?.url} alt={currentMedia?.alt_text||currentSeries.title} className="current-series-image"/><div className="series-float-card"><p>{currentSeries.short_synopsis}</p><div className="card-actions"><Link className="button primary" href={`/series/${currentSeries.slug}`}>{current?.button_label||'View Series'}</Link>{currentSeries.trailer_url&&<a className="button ghost" href={currentSeries.trailer_url} target="_blank" rel="noreferrer">Trailer ↗</a>}</div></div></div></section>}

    <section className="page-pad artist-showcases premium-section"><div className="section-heading"><div><p className="eyebrow">{artistHeading?.title_override||'Artists'}</p><h2>{artistHeading?.copy_override||'Meet Teshow & Ping'}</h2></div><Link className="text-link" href={artistHeading?.button_href||'/artists'}>{artistHeading?.button_label||'All artist info'} →</Link></div>{artistFeatures.map((f,i)=>{const artist=data.artists.find(a=>a.artist_id===f.entity_id),media=findMedia(data,f.media_id_override||artist?.profile_media_id);if(!artist)return null;const roles=data.seriesCast.filter(c=>c.artist_id===artist.artist_id&&c.enabled!==false).slice(0,3);return <article className={`split-showcase ${i%2===1?'reverse':''}`} key={f.feature_id}><div className="split-copy"><p className="eyebrow">Artist {String(i+1).padStart(2,'0')}</p><h2>{artist.display_name}</h2><div className="role-chips">{roles.map(r=>{const s=data.series.find(x=>x.series_id===r.series_id);return <span key={r.cast_id}>{r.character_name} · {s?.title}</span>})}</div><p className="lede small">{artist.quick_info}</p><p className="muted-copy">{artist.bio}</p><Link className="button primary" href={`/artists/${artist.slug}`}>Explore {artist.display_name}</Link></div><div className="split-media"><MediaImage src={media?.url} alt={media?.alt_text||artist.display_name} className="split-image"/><span className="image-index">0{i+1}</span></div></article>})}</section>

    {moreSeries.length>0&&<section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">Shared & solo work</p><h2>More stories to explore.</h2></div><Link className="text-link" href="/series">All series →</Link></div><div className="series-grid home-series-grid">{moreSeries.map(s=><SeriesCard key={s.series_id} series={s} data={data}/>)}</div></section>}

    <section className="page-pad premium-section"><div className="section-heading"><div><p className="eyebrow">{newsHeading?.title_override||'Updates'}</p><h2>{newsHeading?.copy_override||'News'}</h2></div><Link className="text-link" href={newsHeading?.button_href||'/news'}>{newsHeading?.button_label||'See all'} →</Link></div><NewsGrid data={data}/></section>
  </SiteShell>
}

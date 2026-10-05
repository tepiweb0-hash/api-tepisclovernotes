import Link from 'next/link'
import type { Bootstrap } from '@/lib/types'
import { findMedia } from '@/lib/content'
import MediaImage from './MediaImage'
import QuickInfo from './QuickInfo'

export default function SeriesCard({ series, data }: { series: any, data: Bootstrap }) {
  const poster = findMedia(data, series.poster_media_id)
  const cast = data.seriesCast.filter(c => c.series_id === series.series_id && c.enabled !== false).sort((a,b)=>Number(a.billing_order)-Number(b.billing_order)).slice(0,4)
  const lines = cast.map(c => {
    const artist = data.artists.find(a => a.artist_id === c.artist_id)
    return artist ? `${artist.display_name} — ${c.character_name}` : c.character_name
  })
  return <article className="series-card">
    <div className="series-poster-wrap"><MediaImage src={poster?.url} alt={poster?.alt_text || series.title} className="series-poster" /></div>
    <div className="series-card-copy"><p className="eyebrow">{series.year || ''} {series.status ? `• ${series.status}` : ''}</p><h2>{series.title}</h2><p>{series.short_synopsis}</p>
      <div className="card-actions"><QuickInfo title={series.title} subtitle={series.short_synopsis} image={poster?.url} alt={poster?.alt_text} lines={lines} href={`/series/${series.slug}`} label={data.ui.view_series || 'View Series'} /><Link className="button primary" href={`/series/${series.slug}`}>{data.ui.view_series || 'View Series'}</Link></div>
    </div>
  </article>
}

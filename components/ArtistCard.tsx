import Link from 'next/link'
import type { Bootstrap } from '@/lib/types'
import { findMedia } from '@/lib/content'
import MediaImage from './MediaImage'
import QuickInfo from './QuickInfo'

export default function ArtistCard({ artist, data }: { artist: any, data: Bootstrap }) {
  const image = findMedia(data, artist.profile_media_id)
  const roles = data.seriesCast.filter(c => c.artist_id === artist.artist_id && c.enabled !== false).slice(0,3)
  const roleLines = roles.map(r => {
    const s = data.series.find(x => x.series_id === r.series_id)
    return s ? `${r.character_name} in ${s.title}` : r.character_name
  })
  return <article className="portrait-card">
    <MediaImage src={image?.url} alt={image?.alt_text || artist.display_name} className="portrait-image" />
    <div className="portrait-copy"><p className="eyebrow">{data.ui.artist_label || 'Artist'}</p><h2>{artist.display_name}</h2><p>{artist.quick_info}</p>
      <div className="card-actions"><QuickInfo title={artist.full_name} subtitle={artist.quick_info} image={image?.url} alt={image?.alt_text} lines={roleLines} href={`/artists/${artist.slug}`} label={data.ui.full_info || 'Full Info'} /><Link className="button primary" href={`/artists/${artist.slug}`}>{data.ui.full_info || 'Full Info'}</Link></div>
    </div>
  </article>
}

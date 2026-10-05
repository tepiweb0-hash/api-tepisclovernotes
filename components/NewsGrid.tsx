import Link from 'next/link'
import type { Bootstrap } from '@/lib/types'
import { findMedia } from '@/lib/content'
import MediaImage from './MediaImage'
import { formatDate, pickNews } from '@/lib/utils'

export default function NewsGrid({ data, rows }: { data: Bootstrap, rows?: any[] }) {
  const items = rows || pickNews(data.news, data.site.home_news_mode)
  return <div className="news-grid">{items.map((n) => {
    const m = findMedia(data, n.featured_media_id)
    return <article className="news-card" key={n.news_id}>
      <MediaImage src={m?.url} alt={m?.alt_text || n.title} className="news-image" />
      <div className="news-copy"><p className="eyebrow">{n.hot ? 'Hot • ' : ''}{formatDate(n.publish_date)}</p><h3>{n.title}</h3><p>{n.excerpt}</p><Link href={`/news/${n.slug}`}>{data.ui.read_story || 'Read story'} →</Link></div>
    </article>
  })}</div>
}

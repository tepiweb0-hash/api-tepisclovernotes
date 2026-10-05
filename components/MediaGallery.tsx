"use client"
import { useEffect, useState } from 'react'
import MediaImage from './MediaImage'

export default function MediaGallery({ items, mode='carousel', interval=4500 }: { items: any[], mode?: string, interval?: number }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!['fade','crossfade'].includes(mode) || items.length < 2) return
    const id = window.setInterval(() => setIndex(i => (i+1)%items.length), interval)
    return () => window.clearInterval(id)
  }, [mode, items.length, interval])
  if (!items.length) return null
  if (mode === 'single') return <MediaImage src={items[0].url} alt={items[0].alt_text} className="gallery-single" />
  if (['fade','crossfade'].includes(mode)) return <div className="fade-gallery">{items.map((m,i)=><MediaImage key={m.media_id} src={m.url} alt={m.alt_text} className={`fade-image ${i===index?'active':''}`} />)}</div>
  return <div className="carousel-gallery">{items.map(m=><figure key={m.media_id}><MediaImage src={m.url} alt={m.alt_text} className="gallery-slide" />{m.caption && <figcaption>{m.caption}</figcaption>}</figure>)}</div>
}

import Link from 'next/link'
import type { Bootstrap } from '@/lib/types'
import { findMedia } from '@/lib/content'
import MediaImage from './MediaImage'
import MediaGallery from './MediaGallery'

export default function DynamicSections({ data, pageId }: { data: Bootstrap, pageId: string }) {
  const sections = data.sections.filter(s => s.page_id === pageId && s.enabled !== false).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
  return <>{sections.map(section => {
    const media=findMedia(data, section.media_id)
    const items=data.sectionItems.filter(i=>i.section_id===section.section_id && i.enabled!==false).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))
    if(section.template_key==='hero') return <section className="generic-hero page-pad" key={section.section_id}><p className="eyebrow">{section.eyebrow}</p><h1>{section.title}</h1><p className="lede">{section.body}</p>{media && <MediaImage src={media.url} alt={media.alt_text} className="wide-media" />}</section>
    if(section.template_key==='split') return <section className={`split-showcase page-pad ${section.alignment==='right'?'reverse':''}`} key={section.section_id}><div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2><p>{section.body}</p></div><MediaImage src={media?.url} alt={media?.alt_text} className="split-image" /></section>
    if(section.template_key==='showcase' || section.template_key==='card_grid') return <section className="page-pad" key={section.section_id}><div className="section-heading"><div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2><p>{section.body}</p></div></div><div className="generic-grid">{items.map(item => { const m=findMedia(data,item.media_id); return <article className="generic-card" key={item.item_id}><MediaImage src={m?.url} alt={m?.alt_text||item.title} className="generic-card-image"/><h3>{item.title}</h3><p>{item.subtitle||item.body}</p>{item.href && <Link href={item.href}>{item.button_label||'View'} →</Link>}</article> })}</div></section>
    if(section.template_key==='media_gallery') { const gallery=items.map(i=>findMedia(data,i.media_id)).filter(Boolean); return <section className="page-pad" key={section.section_id}><div className="section-heading"><div><p className="eyebrow">{section.eyebrow}</p><h2>{section.title}</h2><p>{section.body}</p></div></div><MediaGallery items={gallery} mode={section.display_mode||'carousel'} /></section> }
    return null
  })}</>
}

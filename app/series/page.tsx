import { getBootstrap, published, sortRows } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import SeriesCard from '@/components/SeriesCard'

export default async function SeriesPage(){const data=await getBootstrap();if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>;const rows=sortRows(published(data.series)),page=data.pages.find(p=>p.page_id==='page-series');return <SiteShell data={data}><section className="page-hero page-pad"><p className="eyebrow">{page?.hero_eyebrow||'Series'}</p><h1>{page?.hero_title||'Shared stories. Solo stories.'}</h1><p className="lede">{page?.hero_body||'Every Teshow or Ping project belongs here — whether they appear together or separately.'}</p></section><section className="series-grid page-pad premium-section">{rows.map(s=><SeriesCard key={s.series_id} series={s} data={data}/>)}</section></SiteShell>}

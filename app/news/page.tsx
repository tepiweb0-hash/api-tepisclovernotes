import { getBootstrap } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import NewsGrid from '@/components/NewsGrid'

export default async function NewsPage(){ const data=await getBootstrap(); if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>; const rows=data.news.filter(n=>n.status==='published').sort((a,b)=>String(b.publish_date).localeCompare(String(a.publish_date))); const page=data.pages.find(p=>p.page_id==='page-news'); return <SiteShell data={data}><section className="page-hero page-pad"><p className="eyebrow">{page?.hero_eyebrow||page?.nav_label||'News'}</p><h1>{page?.hero_title||page?.title||'News'}</h1><p className="lede">{page?.hero_body||page?.seo_description}</p></section><section className="page-pad"><NewsGrid data={data} rows={rows}/></section></SiteShell> }

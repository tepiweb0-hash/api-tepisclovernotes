import { getBootstrap, published, sortRows } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import ArtistCard from '@/components/ArtistCard'

export default async function ArtistsPage(){
  const data=await getBootstrap(); if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>
  const artists=sortRows(published(data.artists)); const page=data.pages.find(p=>p.page_id==='page-artists')
  return <SiteShell data={data}><section className="page-hero page-pad"><p className="eyebrow">{page?.hero_eyebrow||page?.nav_label||'Artists'}</p><h1>{page?.hero_title||page?.title||'Artists'}</h1><p className="lede">{page?.hero_body||page?.seo_description}</p></section><section className="artist-grid page-pad">{artists.map(a=><ArtistCard key={a.artist_id} artist={a} data={data}/>)}</section></SiteShell>
}

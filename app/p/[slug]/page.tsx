import { notFound } from 'next/navigation'
import { getBootstrap } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import DynamicSections from '@/components/DynamicSections'

export default async function CustomPage({params}:{params:{slug:string}}){ const data=await getBootstrap(); const p=data.pages.find(x=>x.slug===params.slug&&x.status==='published'); if(!p)notFound(); return <SiteShell data={data}><DynamicSections data={data} pageId={p.page_id}/></SiteShell> }

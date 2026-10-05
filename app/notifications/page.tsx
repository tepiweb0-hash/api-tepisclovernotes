import { getBootstrap } from '@/lib/content'
import SiteShell from '@/components/SiteShell'
import ConnectionNotice from '@/components/ConnectionNotice'
import NotificationArchive from '@/components/NotificationArchive'

export default async function NotificationPage(){const data=await getBootstrap();if(!data.ok)return <SiteShell data={data}><ConnectionNotice message={data.error}/></SiteShell>;const rows=data.notifications.filter(n=>n.status==='published'&&n.enabled!==false).sort((a,b)=>String(b.publish_at||b.published_at).localeCompare(String(a.publish_at||a.published_at)));return <SiteShell data={data}><section className="page-hero page-pad"><p className="eyebrow">Notifications</p><h1>Release, event & site notices.</h1><p className="lede">Quick info first. Open any notice for the full context or jump directly to the related episode, event or news story.</p></section><section className="page-pad premium-section"><NotificationArchive rows={rows}/></section></SiteShell>}

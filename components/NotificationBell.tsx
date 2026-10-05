"use client"
import { useRef } from 'react'
import Link from 'next/link'
import { formatDate, safeHref } from '@/lib/utils'

export default function NotificationBell({ notifications, ui }: { notifications:any[], ui:Record<string,string> }) {
  const ref=useRef<HTMLDialogElement>(null)
  const rows=notifications.filter(n=>n.status==='published'&&n.enabled!==false).sort((a,b)=>String(b.publish_at||b.published_at).localeCompare(String(a.publish_at||a.published_at))).slice(0,8)
  return <>
    <button className="nav-bell" type="button" onClick={()=>ref.current?.showModal()} aria-label="Open notifications"><span className="bell-icon">✦</span>{rows.length>0&&<span className="bell-dot">{Math.min(rows.length,9)}</span>}</button>
    <dialog ref={ref} className="notification-dialog" onClick={e=>{if(e.currentTarget===e.target)ref.current?.close()}}>
      <div className="notification-panel">
        <div className="panel-head"><div><p className="eyebrow">{ui.notification_center||'Notification center'}</p><h2>{ui.latest_notices||'Latest notices'}</h2></div><button className="dialog-close" onClick={()=>ref.current?.close()} aria-label="Close">×</button></div>
        <div className="notice-stack">{rows.length?rows.map(n=><details className="notice-item" key={n.notification_id}><summary><div><span>{n.type||'Update'}</span><strong>{n.title}</strong><small>{formatDate(String(n.publish_at||n.published_at||'').slice(0,10))}</small></div><b>＋</b></summary><div className="notice-detail"><p>{n.quick_info||n.message}</p>{n.full_info&&<p className="muted-copy">{n.full_info}</p>}<div className="card-actions">{n.link_url&&<Link className="button primary" href={safeHref(n.link_url,'/notifications')} onClick={()=>ref.current?.close()}>{n.cta_label||ui.open_label||'View full info'}</Link>}<Link className="button ghost" href="/notifications" onClick={()=>ref.current?.close()}>All notifications</Link></div></div></details>):<div className="empty-card"><p>No published notifications yet.</p></div>}</div>
      </div>
    </dialog>
  </>
}

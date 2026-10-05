"use client"
import { useRef, useState } from 'react'
import Link from 'next/link'
import { formatDate, safeHref } from '@/lib/utils'

export default function NotificationArchive({rows}:{rows:any[]}){
  const [active,setActive]=useState<any|null>(null); const ref=useRef<HTMLDialogElement>(null)
  function open(n:any){setActive(n);ref.current?.showModal()}
  return <><div className="notification-grid">{rows.map(n=><button key={n.notification_id} className="notification-card" onClick={()=>open(n)}><span>{n.type||'Update'}</span><h3>{n.title}</h3><p>{n.quick_info||n.message}</p><small>{formatDate(String(n.publish_at||n.published_at||'').slice(0,10))}</small><b>Quick Info →</b></button>)}</div><dialog ref={ref} className="quick-dialog" onClick={e=>{if(e.currentTarget===e.target)ref.current?.close()}}>{active&&<div className="quick-card text-only"><button className="dialog-close" onClick={()=>ref.current?.close()}>×</button><div className="quick-copy"><p className="eyebrow">{active.type||'Notification'}</p><h2>{active.title}</h2><p className="lede small">{active.quick_info||active.message}</p>{active.full_info&&<p className="muted-copy">{active.full_info}</p>}{active.link_url&&<Link className="button primary" href={safeHref(active.link_url,'/')} onClick={()=>ref.current?.close()}>{active.cta_label||'View Full Information'}</Link>}</div></div>}</dialog></>
}

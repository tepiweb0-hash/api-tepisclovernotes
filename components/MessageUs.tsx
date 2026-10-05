"use client"
import { useEffect, useRef, useState } from 'react'
import type { Bootstrap } from '@/lib/types'
import { safeHref } from '@/lib/utils'

export default function MessageUs({ data }: { data: Bootstrap }) {
  const [open,setOpen]=useState(false)
  const root=useRef<HTMLDivElement>(null)
  const enabled=String(data.site.enable_message_us||'true').toLowerCase()!=='false'
  const links=data.messageLinks.filter(x=>x.enabled!==false&&String(x.enabled).toLowerCase()!=='false'&&String(x.url||'').trim()).sort((a,b)=>Number(a.sort_order)-Number(b.sort_order))

  useEffect(()=>{
    const close=(e:MouseEvent)=>{ if(open && root.current && !root.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown',close)
    return ()=>document.removeEventListener('mousedown',close)
  },[open])

  if (!enabled) return null
  return <div ref={root} className={`message-us ${open?'open':''}`}>
    {open&&<div className="message-menu" role="menu"><p className="eyebrow">{data.site.message_us_label||'Message us'}</p><h3>Say hello.</h3><p className="message-intro">Choose where you want to reach the fan page.</p>{links.length?links.map(l=><a role="menuitem" key={l.link_id} href={safeHref(l.url)} target="_blank" rel="noreferrer" onClick={()=>setOpen(false)}><span>{l.label}</span><b>↗</b></a>):<p className="message-empty">Social links are being updated.</p>}</div>}
    <button className="message-fab" type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span aria-hidden="true">{open?'×':'✦'}</span><b>{data.site.message_us_label||'Message Us'}</b></button>
  </div>
}

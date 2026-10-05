"use client"
import { useRef } from 'react'
import Link from 'next/link'
import MediaImage from './MediaImage'

export default function QuickInfo({ title, subtitle, image, alt, lines = [], href, label = 'View' }: any) {
  const ref = useRef<HTMLDialogElement>(null)
  return <>
    <button className="button ghost" type="button" onClick={() => ref.current?.showModal()}>Quick Info</button>
    <dialog className="quick-dialog" ref={ref} onClick={(e) => { if (e.currentTarget === e.target) ref.current?.close() }}>
      <div className="quick-card">
        <button className="dialog-close" aria-label="Close" onClick={() => ref.current?.close()}>×</button>
        <MediaImage src={image} alt={alt || title} className="quick-image" />
        <div className="quick-copy">
          <p className="eyebrow">Quick info</p>
          <h2>{title}</h2>
          {subtitle && <p className="lede small">{subtitle}</p>}
          <div className="quick-lines">{lines.filter(Boolean).map((line: string, i: number) => <p key={i}>{line}</p>)}</div>
          {href && <Link className="button primary" href={href}>{label}</Link>}
        </div>
      </div>
    </dialog>
  </>
}

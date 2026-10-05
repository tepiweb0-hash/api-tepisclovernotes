"use client"
import { useState } from 'react'

export default function MediaImage({ src, alt, className = '', eager = false }: { src?: string, alt?: string, className?: string, eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return <div className={`image-fallback ${className}`} aria-label={alt || 'Image placeholder'}><span>✦</span></div>
  }
  return <img className={className} src={src} alt={alt || ''} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />
}

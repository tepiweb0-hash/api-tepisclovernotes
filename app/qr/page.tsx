import type { Metadata } from 'next'
import Link from 'next/link'
import { safeHref } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Social Links',
  description: 'Official Teshow & Ping PH social links in one place.',
  robots: { index: true, follow: true }
}

type LinkItem = {
  id: string
  label: string
  url: string
  platform: 'instagram' | 'x' | 'website'
  helper: string
}

const links: LinkItem[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/teshowpingph',
    platform: 'instagram',
    helper: '@teshowpingph'
  },
  {
    id: 'x',
    label: 'X / Twitter',
    url: 'https://x.com/teshowpingph_',
    platform: 'x',
    helper: '@teshowpingph_'
  },
  {
    id: 'website',
    label: 'Official Website',
    url: 'https://tepisclovernotes.vercel.app',
    platform: 'website',
    helper: 'tepisclovernotes.vercel.app'
  }
]

function platformMark(platform: LinkItem['platform']) {
  if (platform === 'instagram') return '◎'
  if (platform === 'x') return '𝕏'
  return '⌂'
}

export default function QrLandingPage() {
  return (
    <main className="qr-landing">
      <div className="qr-landing-orb qr-orb-one" aria-hidden="true" />
      <div className="qr-landing-orb qr-orb-two" aria-hidden="true" />

      <section className="qr-linktree-card" aria-labelledby="qr-title">
        <Link href="/" className="qr-logo-link" aria-label="Teshow & Ping PH home">
          <img src="/teshow-ping-clover-notes-logo.png" alt="Teshow & Ping PH" className="qr-brand-logo" />
        </Link>
        <p className="qr-kicker">Teshow &amp; Ping PH</p>
        <h1 id="qr-title">Find us everywhere.</h1>
        <p className="qr-intro">All our official links in one place.</p>

        <div className="qr-links" aria-label="Official links">
          {links.map((item) => (
            <a
              key={item.id}
              href={safeHref(item.url)}
              target="_blank"
              rel="noreferrer"
              className="qr-social-link"
            >
              <span className="qr-social-icon" aria-hidden="true">{platformMark(item.platform)}</span>
              <span className="qr-social-copy"><b>{item.label}</b><small>{item.helper}</small></span>
              <span className="qr-social-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <div className="qr-permanent-card">
          <div className="qr-code-frame">
            <img src="/qr/teshow-ping-socials-qr.png" alt="Permanent QR code for the Teshow and Ping PH links page" />
          </div>
          <div className="qr-permanent-copy">
            <p className="qr-kicker">One permanent QR</p>
            <h2>Print it once. Keep using the same QR.</h2>
            <p>The QR always opens this <strong>/qr</strong> page. If a social account changes later, we only update this landing page — the printed QR stays the same.</p>
            <div className="qr-download-actions">
              <a className="button primary" href="/qr/teshow-ping-socials-qr.png" download>Download PNG</a>
              <a className="button ghost" href="/qr/teshow-ping-socials-qr.svg" download>Download SVG</a>
            </div>
          </div>
        </div>

        <p className="qr-footnote">Permanent destination: tepisclovernotes.vercel.app/qr</p>
      </section>
    </main>
  )
}

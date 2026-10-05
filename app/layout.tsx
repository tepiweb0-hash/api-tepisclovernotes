import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Teshow and Ping Clover Notes', template: '%s | Teshow and Ping Clover Notes' },
  applicationName: 'Teshow and Ping Clover Notes',
  description: 'A fan-made Teshow & Ping archive and update hub.',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    title: 'Teshow and Ping Clover Notes',
    siteName: 'Teshow and Ping Clover Notes',
    description: 'A fan-made Teshow & Ping archive and update hub.',
    type: 'website',
    images: ['/logo.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teshow and Ping Clover Notes',
    description: 'A fan-made Teshow & Ping archive and update hub.',
    images: ['/logo.png']
  }
}

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>
}

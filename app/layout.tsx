import type { Metadata } from 'next'
import { Geist, Geist_Mono, Manrope } from 'next/font/google'
import './globals.css'
import ConvexClerkProvider from '../providers/ConvexClerkProvider'
import AudioProvider from '@/providers/AudioProvider'

const manrope = Manrope({ subsets: ['latin'] })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Podcastr',
  description: 'Generated your podcasts using AI',
  icons: {
    icon: '/icons/logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={manrope.className}>{children}</body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  )
}

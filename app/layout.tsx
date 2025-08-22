import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/print.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Endotoxin Limit Calculator',
  description: 'Calculate endotoxin limits for preclinical research based on Malyala and Singh (2007)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Machine Locker',
  description: 'Innovative Solutions for the Safety and Security of Your Goods. With a combination of advanced technology and elegant design, SmartLocker provides maximum protection for your valuables, from electronic devices to important documents. Locker location in University Of Indonesia. With any size you can use right now',
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

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flashify.ai',
  description: 'Created flashcards with Flashify.ai',
  generator: 'Flashify.ai',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  )
}

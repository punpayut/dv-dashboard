import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Family Violence Dashboard — THackle',
  description: 'ข้อมูลเหตุความรุนแรงในครอบครัว ประเทศไทย',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}

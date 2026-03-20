import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Family Violence Dashboard | THackle',
  description: 'Dashboard วิเคราะห์ข้อมูลความรุนแรงในครอบครัวจากชุดข้อมูล VCIS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}

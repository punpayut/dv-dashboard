'use client'
import clsx from 'clsx'

type Props = {
  label: string
  value: string | number
  sub?: string
  accent?: 'offender' | 'victim' | 'accent' | 'amber'
}

const accentColors: Record<string, string> = {
  offender: '#E24B4A',
  victim: '#378ADD',
  accent: '#0F6E56',
  amber: '#BA7517',
}

export default function KpiCard({ label, value, sub, accent }: Props) {
  const color = accent ? accentColors[accent] : '#1A1916'
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-1"
      style={{ border: '1px solid var(--clr-border)' }}
    >
      <span className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--clr-muted)' }}>
        {label}
      </span>
      <span
        className="text-3xl font-semibold leading-none mt-1"
        style={{ fontFamily: 'var(--font-display)', color }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs mt-1" style={{ color: 'var(--clr-muted)' }}>
          {sub}
        </span>
      )}
    </div>
  )
}

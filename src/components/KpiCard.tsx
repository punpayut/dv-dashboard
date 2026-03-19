'use client'

type Props = {
  label: string
  value: string | number
  sub?: string
  accent?: 'offender' | 'victim' | 'accent' | 'amber'
  animDelay?: string
}

const accentMap: Record<string, { color: string; bg: string; border: string }> = {
  offender: { color: 'var(--clr-offender)', bg: 'var(--clr-offender-light)', border: 'var(--clr-offender)' },
  victim:   { color: 'var(--clr-victim)',   bg: 'var(--clr-victim-light)',   border: 'var(--clr-victim)'   },
  accent:   { color: 'var(--clr-accent)',   bg: 'var(--clr-accent-light)',   border: 'var(--clr-accent)'   },
  amber:    { color: 'var(--clr-amber)',    bg: 'var(--clr-amber-light)',    border: 'var(--clr-amber)'    },
}

export default function KpiCard({ label, value, sub, accent, animDelay }: Props) {
  const a = accent ? accentMap[accent] : null

  return (
    <div
      className="dash-card fade-up flex flex-col gap-1 p-5 relative overflow-hidden"
      style={{
        background: a ? a.bg : 'var(--clr-surface)',
        borderLeft: a ? `3px solid ${a.border}` : undefined,
        animationDelay: animDelay,
      }}
    >
      <span
        className="section-label"
        style={{ color: a ? a.color : 'var(--clr-muted)', opacity: 0.8 }}
      >
        {label}
      </span>
      <span
        className="leading-none mt-1 font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          color: a ? a.color : 'var(--clr-text)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs mt-0.5" style={{ color: a ? a.color : 'var(--clr-muted)', opacity: 0.75 }}>
          {sub}
        </span>
      )}
    </div>
  )
}

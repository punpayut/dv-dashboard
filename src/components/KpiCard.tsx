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
  victim: { color: 'var(--clr-victim)', bg: 'var(--clr-victim-light)', border: 'var(--clr-victim)' },
  accent: { color: 'var(--clr-accent)', bg: 'var(--clr-accent-light)', border: 'var(--clr-accent)' },
  amber: { color: 'var(--clr-amber)', bg: 'var(--clr-amber-light)', border: 'var(--clr-amber)' },
}

export default function KpiCard({ label, value, sub, accent, animDelay }: Props) {
  const theme = accent ? accentMap[accent] : null

  return (
    <div
      className="dash-card fade-up"
      style={{
        background: theme ? theme.bg : 'rgba(255, 255, 255, 0.9)',
        borderLeft: theme ? `4px solid ${theme.border}` : undefined,
        animationDelay: animDelay,
        padding: 22,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -24,
          top: -28,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: theme ? `${theme.border}16` : 'rgba(24, 22, 15, 0.05)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span className="section-label" style={{ color: theme ? theme.color : 'var(--clr-muted)', opacity: 0.92 }}>
          {label}
        </span>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 1.5rem + 1.2vw, 3rem)',
            color: theme ? theme.color : 'var(--clr-text)',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            marginTop: 14,
            marginBottom: 8,
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '0.96rem', color: theme ? theme.color : 'var(--clr-muted)', opacity: 0.78 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

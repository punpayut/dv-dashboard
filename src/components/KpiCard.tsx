'use client'

type Props = {
  label: string
  value: string | number
  sub?: string
  accent?: 'offender' | 'victim' | 'accent' | 'amber'
  animDelay?: string
}

const accentMap: Record<string, { gradient: string; shadow: string }> = {
  offender: {
    gradient: 'linear-gradient(135deg, #f34d8f 0%, #8c55f2 100%)',
    shadow: '0 22px 42px rgba(173, 68, 151, 0.24)',
  },
  victim: {
    gradient: 'linear-gradient(135deg, #39c9ff 0%, #3a73ff 100%)',
    shadow: '0 22px 42px rgba(66, 145, 255, 0.22)',
  },
  accent: {
    gradient: 'linear-gradient(135deg, #7b61ff 0%, #4ab6ff 100%)',
    shadow: '0 22px 42px rgba(104, 102, 245, 0.24)',
  },
  amber: {
    gradient: 'linear-gradient(135deg, #ffb11f 0%, #ff7a45 100%)',
    shadow: '0 22px 42px rgba(255, 151, 54, 0.24)',
  },
}

export default function KpiCard({ label, value, sub, accent = 'accent', animDelay }: Props) {
  const theme = accentMap[accent]

  return (
    <div
      className="fade-up"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        padding: 22,
        animationDelay: animDelay,
        background: theme.gradient,
        boxShadow: theme.shadow,
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 132,
          height: 132,
          top: -42,
          right: -28,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.16)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 74,
          height: 74,
          bottom: -16,
          left: -12,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.82)',
            marginBottom: 14,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.1rem, 1.6rem + 1vw, 3.1rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            marginBottom: 10,
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.82)', maxWidth: 240 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}

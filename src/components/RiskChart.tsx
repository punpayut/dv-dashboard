'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

type Row = { factor: string; offPct: number; vicPct: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontSize: 12, marginBottom: 3 }}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function RiskChart({ data }: { data: Row[] }) {
  const sorted = [...data].sort((a, b) => a.offPct - b.offPct)

  return (
    <div className="dash-card fade-up" style={{ padding: '20px 20px 14px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--clr-text)', lineHeight: 1.2, marginBottom: 5 }}>
            ปัจจัยเสี่ยง
          </div>
          <div style={{ fontSize: 12, color: 'var(--clr-muted)' }}>
            ร้อยละของกลุ่มที่มีปัจจัยนั้น
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {[{ color: '#D94040', label: 'ผู้กระทำ' }, { color: '#2A7ACC', label: 'ผู้ถูกกระทำ' }].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--clr-muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tinted chart area */}
      <div style={{ background: '#FAFAF7', borderRadius: 10, border: '1px solid var(--clr-border)', padding: '12px 4px 4px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sorted} layout="vertical"
            barGap={3} barCategoryGap="22%"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis
              type="number" tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#888680', fontFamily: 'var(--font-body)' }}
              axisLine={{ stroke: '#E4E1DA' }} tickLine={false}
            />
            <YAxis
              type="category" dataKey="factor" width={96}
              tick={{ fontSize: 12, fill: '#2C2A24', fontWeight: 500, fontFamily: 'var(--font-body)' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.035)' }} />
            <Bar dataKey="offPct" name="ผู้กระทำ"     fill="#D94040" radius={[0,4,4,0]} maxBarSize={14} />
            <Bar dataKey="vicPct" name="ผู้ถูกกระทำ" fill="#2A7ACC" radius={[0,4,4,0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

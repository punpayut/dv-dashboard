'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts'

type Row = {
  age: string
  offMale: number
  offFemale: number
  vicMale: number
  vicFemale: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>{label} ปี</p>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontSize: 12, marginBottom: 3 }}>
          <span style={{ color: p.fill }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{Math.abs(p.value).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

const fmt = (v: number) => `${Math.abs(v).toFixed(0)}%`

export default function ButterflyChart({ data }: { data: Row[] }) {
  const max = Math.max(...data.flatMap(d => [Math.abs(d.offMale), d.vicFemale])) + 5

  return (
    <div className="dash-card fade-up" style={{ padding: '20px 20px 14px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--clr-text)', lineHeight: 1.2, marginBottom: 5 }}>
            โครงสร้างอายุ–เพศ
          </div>
          <div style={{ fontSize: 12, color: 'var(--clr-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 3, background: 'var(--clr-offender)', display: 'inline-block', borderRadius: 2 }} />
            ← ผู้กระทำ
            <span style={{ width: 18, height: 3, background: 'var(--clr-victim)', display: 'inline-block', borderRadius: 2, marginLeft: 8 }} />
            ผู้ถูกกระทำ →
          </div>
        </div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--clr-subtle)', color: 'var(--clr-muted)', border: '1px solid var(--clr-border)' }}>
          % ภายในกลุ่ม
        </span>
      </div>

      {/* Tinted chart area */}
      <div style={{ background: '#FAFAF7', borderRadius: 10, border: '1px solid var(--clr-border)', padding: '12px 4px 4px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" barGap={1} barCategoryGap="18%" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis
              type="number" domain={[-max, max]} tickFormatter={fmt}
              tick={{ fontSize: 11, fill: '#888680', fontFamily: 'var(--font-body)' }}
              axisLine={{ stroke: '#E4E1DA' }} tickLine={false} tickCount={7}
            />
            <YAxis
              type="category" dataKey="age" width={42}
              tick={{ fontSize: 12, fill: '#2C2A24', fontWeight: 500, fontFamily: 'var(--font-body)' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.035)' }} />
            <ReferenceLine x={0} stroke="#A8A49C" strokeWidth={1.5} />
            <Bar dataKey="offMale"   name="ผู้กระทำ ชาย"     fill="#D94040" radius={[0,3,3,0]} maxBarSize={18} />
            <Bar dataKey="offFemale" name="ผู้กระทำ หญิง"    fill="#F09595" radius={[0,3,3,0]} maxBarSize={18} />
            <Bar dataKey="vicMale"   name="ผู้ถูกกระทำ ชาย"  fill="#85B7EB" radius={[3,0,0,3]} maxBarSize={18} />
            <Bar dataKey="vicFemale" name="ผู้ถูกกระทำ หญิง" fill="#2A7ACC" radius={[3,0,0,3]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12, paddingLeft: 2 }}>
        {[
          { color: '#D94040', label: 'ผู้กระทำ ชาย' },
          { color: '#F09595', label: 'ผู้กระทำ หญิง' },
          { color: '#85B7EB', label: 'ผู้ถูกกระทำ ชาย' },
          { color: '#2A7ACC', label: 'ผู้ถูกกระทำ หญิง' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--clr-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

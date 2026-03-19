'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

type Row = { factor: string; offPct: number; vicPct: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="font-medium mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-6 text-xs">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-medium">{p.value.toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

export default function RiskChart({ data }: { data: Row[] }) {
  const sorted = [...data].sort((a, b) => a.offPct - b.offPct)
  return (
    <div className="dash-card fade-up p-5">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>ปัจจัยเสี่ยง</span>
        <span style={{ fontSize: 11, color: 'var(--clr-muted)' }}>ผู้กระทำ vs ผู้ถูกกระทำ</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--clr-muted)', marginBottom: 16 }}>ร้อยละของกลุ่มที่มีปัจจัยนั้น</div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={sorted} layout="vertical" barGap={4} barCategoryGap="30%">
          <CartesianGrid horizontal={false} stroke="#E8E5DF" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={v => `${v}%`}
            tick={{ fontSize: 11, fill: '#6B6860' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="factor"
            width={90}
            tick={{ fontSize: 11, fill: '#6B6860' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: '#6B6860' }}>{v}</span>}
          />
          <Bar dataKey="offPct" name="ผู้กระทำ"      fill="#E24B4A" radius={[0,4,4,0]} />
          <Bar dataKey="vicPct" name="ผู้ถูกกระทำ"  fill="#378ADD" radius={[0,4,4,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

'use client'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
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
      <p className="font-medium mb-2">{label} ปี</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-6 text-xs">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-medium">{Math.abs(p.value).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  )
}

const fmt = (v: number) => `${Math.abs(v).toFixed(1)}%`

export default function ButterflyChart({ data }: { data: Row[] }) {
  const max = Math.max(...data.flatMap(d => [Math.abs(d.offMale), d.vicFemale])) + 5

  return (
    <div className="dash-card fade-up p-5">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>โครงสร้างอายุ–เพศ</span>
        <span style={{ fontSize: 11, color: 'var(--clr-muted)' }}>% ภายในกลุ่ม</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--clr-muted)', marginBottom: 16 }}>← ผู้กระทำ &nbsp;|&nbsp; ผู้ถูกกระทำ →</div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} layout="vertical" barGap={2} barCategoryGap="25%">
          <CartesianGrid horizontal={false} stroke="#E8E5DF" strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[-max, max]}
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: '#6B6860' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="age"
            tick={{ fontSize: 11, fill: '#6B6860' }}
            width={38}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#D1CEC7" strokeWidth={1.5} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v) => <span style={{ fontSize: 11, color: '#6B6860' }}>{v}</span>}
          />
          <Bar dataKey="offMale"   name="ผู้กระทำ ชาย"      fill="#E24B4A" radius={[0,3,3,0]} />
          <Bar dataKey="offFemale" name="ผู้กระทำ หญิง"     fill="#F09595" radius={[0,3,3,0]} />
          <Bar dataKey="vicMale"   name="ผู้ถูกกระทำ ชาย"   fill="#85B7EB" radius={[3,0,0,3]} />
          <Bar dataKey="vicFemale" name="ผู้ถูกกระทำ หญิง"  fill="#378ADD" radius={[3,0,0,3]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

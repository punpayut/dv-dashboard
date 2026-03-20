'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ButterflyRow } from '@/lib/data'

const formatPercent = (value: number) => `${Math.abs(value).toFixed(0)}%`

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: string
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 700, marginBottom: 8 }}>{label}</p>
      {payload.map((item) => (
        <div
          key={item.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 24,
            fontSize: 13,
            marginBottom: 4,
          }}
        >
          <span style={{ color: item.fill }}>{item.name}</span>
          <strong>{Math.abs(item.value).toFixed(1)}%</strong>
        </div>
      ))}
    </div>
  )
}

export default function ButterflyChart({ data }: { data: ButterflyRow[] }) {
  const max = Math.max(...data.flatMap((row) => [Math.abs(row.offMale), Math.abs(row.offFemale), row.vicMale, row.vicFemale]), 10) + 4

  return (
    <div className="dash-card fade-up" style={{ padding: '22px 22px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.05, marginBottom: 6 }}>
            โครงสร้างอายุ-เพศของทั้งสองบทบาท
          </div>
          <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
            ฝั่งซ้ายคือผู้กระทำ ฝั่งขวาคือผู้ถูกกระทำ คิดเป็นสัดส่วนภายในแต่ละกลุ่ม
          </div>
        </div>
        <span
          className="soft-pill"
          style={{ whiteSpace: 'nowrap', background: 'var(--clr-subtle)' }}
        >
          เปรียบเทียบในภาพเดียว
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14, color: 'var(--clr-muted)', fontSize: 13 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 4, borderRadius: 999, background: '#D94040' }} />
          ผู้กระทำชาย
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 4, borderRadius: 999, background: '#F29B9B' }} />
          ผู้กระทำหญิง
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 4, borderRadius: 999, background: '#8CC0F0' }} />
          ผู้ถูกกระทำชาย
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 4, borderRadius: 999, background: '#2A7ACC' }} />
          ผู้ถูกกระทำหญิง
        </span>
      </div>

      <div style={{ background: '#FAFAF7', borderRadius: 16, border: '1px solid var(--clr-border)', padding: '12px 6px 6px' }}>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} layout="vertical" barGap={2} barCategoryGap="16%" margin={{ top: 0, right: 18, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis
              type="number"
              domain={[-max, max]}
              tickFormatter={formatPercent}
              tick={{ fontSize: 12, fill: '#7A7568', fontFamily: 'var(--font-body)' }}
              axisLine={{ stroke: '#E4E1DA' }}
              tickLine={false}
              tickCount={7}
            />
            <YAxis
              type="category"
              dataKey="age"
              width={54}
              tick={{ fontSize: 13, fill: '#2C2A24', fontWeight: 600, fontFamily: 'var(--font-body)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(24,22,15,0.04)' }} />
            <ReferenceLine x={0} stroke="#9E9788" strokeWidth={1.4} />
            <Bar dataKey="offMale" name="ผู้กระทำชาย" fill="#D94040" radius={[0, 4, 4, 0]} maxBarSize={18} />
            <Bar dataKey="offFemale" name="ผู้กระทำหญิง" fill="#F29B9B" radius={[0, 4, 4, 0]} maxBarSize={18} />
            <Bar dataKey="vicMale" name="ผู้ถูกกระทำชาย" fill="#8CC0F0" radius={[4, 0, 0, 4]} maxBarSize={18} />
            <Bar dataKey="vicFemale" name="ผู้ถูกกระทำหญิง" fill="#2A7ACC" radius={[4, 0, 0, 4]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

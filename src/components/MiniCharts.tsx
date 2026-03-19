'use client'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

type PeriodRow = { period: string; count: number }
type RegionRow = { region: string; count: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p className="text-xs font-medium">{label}</p>
      <p className="text-xs mt-1">{payload[0].value} เหตุ</p>
    </div>
  )
}

export function PeriodChart({ data }: { data: PeriodRow[] }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--clr-border)' }}>
      <div className="mb-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        ช่วงเวลาที่เกิดเหตุ
      </div>
      <div className="text-xs mb-4" style={{ color: 'var(--clr-muted)' }}>
        จำนวนเหตุแยกตามช่วงเวลา
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#6B6860' }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4,4,0,0]}>
            {data.map(d => (
              <Cell key={d.period} fill={d.count === max ? '#E24B4A' : '#B5D4F4'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RegionChart({ data }: { data: RegionRow[] }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--clr-border)' }}>
      <div className="mb-1 text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        เหตุแยกตามภูมิภาค
      </div>
      <div className="text-xs mb-4" style={{ color: 'var(--clr-muted)' }}>
        จำนวนเหตุที่รายงาน
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" barCategoryGap="30%">
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="region"
            width={130}
            tick={{ fontSize: 11, fill: '#6B6860' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#534AB7" radius={[0,4,4,0]}>
            {data.map((d, i) => (
              <Cell key={d.region} fill={i === 0 ? '#534AB7' : '#AFA9EC'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

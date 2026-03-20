'use client'

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type PeriodRow = { period: string; count: number }
type RegionRow = { region: string; count: number }

const TooltipCard = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 13, color: 'var(--clr-muted)' }}>{payload[0].value.toLocaleString()} เหตุ</p>
    </div>
  )
}

function ChartHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1.05, marginBottom: 6 }}>{title}</div>
        <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>{subtitle}</div>
      </div>
      {badge && (
        <span className="soft-pill" style={{ whiteSpace: 'nowrap', background: 'var(--clr-subtle)' }}>
          {badge}
        </span>
      )}
    </div>
  )
}

export function PeriodChart({ data }: { data: PeriodRow[] }) {
  const max = Math.max(...data.map((row) => row.count), 1)

  return (
    <div className="dash-card fade-up" style={{ padding: '22px 22px 16px' }}>
      <ChartHeader title="ช่วงเวลาที่เกิดเหตุ" subtitle="จำนวนเหตุทั้งหมดในแต่ละช่วงเวลา" badge="4 ช่วงเวลา" />
      <div style={{ background: 'var(--clr-panel-soft)', borderRadius: 16, border: '1px solid var(--clr-border)', padding: '14px 8px 4px' }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barCategoryGap="28%" margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#7A7568', fontFamily: 'var(--font-body)' }}
              axisLine={{ stroke: '#E4E1DA' }}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<TooltipCard />} cursor={{ fill: 'rgba(24,22,15,0.04)' }} />
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
              label={{ position: 'top', fontSize: 12, fill: '#6A6659', fontFamily: 'var(--font-body)' }}
            >
              {data.map((row) => (
                <Cell key={row.period} fill={row.count === max ? '#D94040' : '#C9DEF4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function RegionChart({ data }: { data: RegionRow[] }) {
  return (
    <div className="dash-card fade-up" style={{ padding: '22px 22px 16px' }}>
      <ChartHeader title="การกระจายตามภูมิภาค" subtitle="จำนวนเหตุที่รายงานในแต่ละภูมิภาค" />
      <div style={{ background: 'var(--clr-panel-soft)', borderRadius: 16, border: '1px solid var(--clr-border)', padding: '14px 8px 4px' }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" barCategoryGap="24%" margin={{ top: 0, right: 40, bottom: 0, left: 18 }}>
            <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="region"
              width={150}
              tick={{ fontSize: 13, fill: '#2C2A24', fontWeight: 600, fontFamily: 'var(--font-body)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<TooltipCard />} cursor={{ fill: 'rgba(24,22,15,0.04)' }} />
            <Bar
              dataKey="count"
              radius={[0, 8, 8, 0]}
              maxBarSize={24}
              label={{ position: 'right', fontSize: 12, fill: '#6A6659', fontFamily: 'var(--font-body)' }}
            >
              {data.map((row, index) => (
                <Cell key={row.region} fill={index === 0 ? '#0C6147' : '#BFDCCE'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

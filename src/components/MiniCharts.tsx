'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type PeriodRow = { period: string; count: number }
type RegionRow = { region: string; count: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: 'var(--clr-muted)' }}>{payload[0].value.toLocaleString()} เหตุ</p>
    </div>
  )
}

function ChartHeader({ title, subtitle, badge }: { title: string; subtitle: string; badge?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--clr-text)', lineHeight: 1.2, marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--clr-muted)' }}>{subtitle}</div>
      </div>
      {badge && (
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--clr-subtle)', color: 'var(--clr-muted)', border: '1px solid var(--clr-border)', whiteSpace: 'nowrap' }}>
          {badge}
        </span>
      )}
    </div>
  )
}

export function PeriodChart({ data }: { data: PeriodRow[] }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="dash-card fade-up" style={{ padding: '20px 20px 14px' }}>
      <ChartHeader title="ช่วงเวลาที่เกิดเหตุ" subtitle="จำนวนเหตุแยกตามช่วงเวลา" badge="4 ช่วง" />
      <div style={{ background: '#FAFAF7', borderRadius: 10, border: '1px solid var(--clr-border)', padding: '12px 4px 4px' }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barCategoryGap="30%" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 10, fill: '#888680', fontFamily: 'var(--font-body)' }}
              axisLine={{ stroke: '#E4E1DA' }} tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.035)' }} />
            <Bar dataKey="count" radius={[5,5,0,0]} maxBarSize={52} label={{ position: 'top', fontSize: 11, fill: '#6A6659', fontFamily: 'var(--font-body)' }}>
              {data.map(d => (
                <Cell key={d.period} fill={d.count === max ? '#D94040' : '#B5D4F4'} />
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
    <div className="dash-card fade-up" style={{ padding: '20px 20px 14px' }}>
      <ChartHeader title="เหตุแยกตามภูมิภาค" subtitle="จำนวนเหตุที่รายงาน" />
      <div style={{ background: '#FAFAF7', borderRadius: 10, border: '1px solid var(--clr-border)', padding: '12px 4px 4px' }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" barCategoryGap="28%" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
            <XAxis type="number" hide />
            <YAxis
              type="category" dataKey="region" width={138}
              tick={{ fontSize: 12, fill: '#2C2A24', fontWeight: 500, fontFamily: 'var(--font-body)' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.035)' }} />
            <Bar dataKey="count" radius={[0,5,5,0]} maxBarSize={22}
              label={{ position: 'right', fontSize: 11, fill: '#6A6659', fontFamily: 'var(--font-body)' }}
            >
              {data.map((d, i) => (
                <Cell key={d.region} fill={i === 0 ? '#534AB7' : '#CECBF6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

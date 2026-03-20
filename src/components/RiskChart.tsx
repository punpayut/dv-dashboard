'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RiskPriorityRow, RiskProfileRow } from '@/lib/data'

type RiskSummary = {
  multiFactorCount: number
  multiFactorPct: number
  highRiskCount: number
  highRiskPct: number
  noRiskCount: number
  noRiskPct: number
  topProfile: RiskProfileRow | null
  topProfiles: RiskProfileRow[]
}

const formatPercent = (value: number) => `${value.toFixed(0)}%`

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ dataKey: string; value: number; payload: RiskPriorityRow }>
  label?: string
}) => {
  if (!active || !payload?.length) return null

  const row = payload[0].payload

  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 700, marginBottom: 8 }}>{label}</p>
      <div style={{ fontSize: 13, display: 'grid', gap: 4 }}>
        <div>รวม {row.count} ราย ({row.pct.toFixed(1)}%)</div>
        <div>ปัจจัยเดี่ยว {row.singleCount} ราย ({row.singlePct.toFixed(1)}%)</div>
        <div>พ่วงหลายปัจจัย {row.multiCount} ราย ({row.multiPct.toFixed(1)}%)</div>
        <div>ในเคสของปัจจัยนี้ มีการพ่วงหลายปัจจัย {row.multiShare.toFixed(1)}%</div>
      </div>
    </div>
  )
}

function SummaryBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 16, background: 'var(--clr-panel-soft)', border: '1px solid var(--clr-border)' }}>
      <div className="section-label" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 0.95, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--clr-muted)', lineHeight: 1.5 }}>{sub}</div>
    </div>
  )
}

export default function RiskChart({ data, summary }: { data: RiskPriorityRow[]; summary: RiskSummary }) {
  const topFactor = data[0]
  const actionableProfiles = summary.topProfiles.filter((profile) => !profile.profile.includes('ไม่มีปัจจัย')).slice(0, 5)

  return (
    <div className="dash-card fade-up" style={{ padding: '22px 22px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.05, marginBottom: 6 }}>
            ลำดับความสำคัญของปัจจัยเสี่ยง
          </div>
          <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
            เรียงตามสัดส่วนผู้กระทำที่มีปัจจัยนั้น โดยแยกว่าเป็นปัจจัยเดี่ยวหรือพ่วงกับปัจจัยอื่น
          </div>
        </div>
        <span className="soft-pill" style={{ whiteSpace: 'nowrap', background: 'var(--clr-subtle)' }}>
          มองเห็น priority ชัดขึ้น
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 14, color: 'var(--clr-muted)', fontSize: 13 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 8, borderRadius: 999, background: '#F6D49A' }} />
          ปัจจัยเดี่ยว
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 16, height: 8, borderRadius: 999, background: '#C96A1B' }} />
          พ่วงหลายปัจจัย
        </span>
      </div>

      <div className="dashboard-grid-split">
        <div style={{ background: 'var(--clr-panel-soft)', borderRadius: 16, border: '1px solid var(--clr-border)', padding: '14px 8px 10px' }}>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 8 }}>
              <CartesianGrid horizontal={false} stroke="#E4E1DA" strokeDasharray="4 4" strokeWidth={0.8} />
              <XAxis
                type="number"
                tickFormatter={formatPercent}
                tick={{ fontSize: 12, fill: '#7A7568', fontFamily: 'var(--font-body)' }}
                axisLine={{ stroke: '#E4E1DA' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="factor"
                width={150}
                tick={{ fontSize: 13, fill: '#2C2A24', fontWeight: 600, fontFamily: 'var(--font-body)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(24,22,15,0.04)' }} />
              <Bar dataKey="singlePct" stackId="risk" name="ปัจจัยเดี่ยว" fill="#F6D49A" radius={[0, 0, 0, 0]} maxBarSize={22} />
              <Bar dataKey="multiPct" stackId="risk" name="พ่วงหลายปัจจัย" fill="#C96A1B" radius={[0, 8, 8, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <SummaryBox
            label="อันดับ 1 ที่ต้องจับตา"
            value={topFactor ? `${topFactor.pct.toFixed(1)}%` : '-'}
            sub={
              topFactor
                ? `${topFactor.factor} พบ ${topFactor.count} ราย และ ${topFactor.multiShare.toFixed(0)}% ของเคสปัจจัยนี้เกิดร่วมกับปัจจัยอื่น`
                : 'ไม่มีข้อมูล'
            }
          />
          <SummaryBox
            label="มี 2 ปัจจัยขึ้นไป"
            value={`${summary.multiFactorPct.toFixed(1)}%`}
            sub={`${summary.multiFactorCount.toLocaleString()} ราย มีความเสี่ยงซ้อนมากกว่าหนึ่งปัจจัย`}
          />
          <SummaryBox
            label="มี 3 ปัจจัยขึ้นไป"
            value={`${summary.highRiskPct.toFixed(1)}%`}
            sub={`${summary.highRiskCount.toLocaleString()} ราย อยู่ในกลุ่มที่ควรเฝ้าระวังเข้มข้น`}
          />
          <div style={{ padding: '14px 16px', borderRadius: 16, background: 'rgba(255,255,255,0.92)', border: '1px solid var(--clr-border)' }}>
            <div className="section-label" style={{ marginBottom: 10 }}>
              รูปแบบที่พบมาก
            </div>
            {actionableProfiles.length > 0 ? (
              <div style={{ display: 'grid', gap: 10 }}>
                {actionableProfiles.map((profile) => (
                  <div key={profile.profile} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--clr-text)', flex: 1 }}>{profile.profile}</div>
                    <div style={{ fontSize: 13, color: 'var(--clr-muted)', whiteSpace: 'nowrap' }}>
                      {profile.count} ราย · {profile.pct.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--clr-muted)' }}>ไม่มี profile เชิงความเสี่ยงที่อยู่ในตัวกรองนี้</div>
            )}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--clr-border)', fontSize: 13, color: 'var(--clr-muted)', lineHeight: 1.5 }}>
              เคสที่ไม่พบปัจจัยหลัก 3 ตัวแรกมี {summary.noRiskCount.toLocaleString()} ราย ({summary.noRiskPct.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

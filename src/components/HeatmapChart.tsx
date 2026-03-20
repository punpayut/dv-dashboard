'use client'

import { PERIODS } from '@/lib/constants'
import type { HeatmapRow } from '@/lib/data'

function getColor(value: number, max: number) {
  const ratio = max > 0 ? value / max : 0
  const red = Math.round(247 - ratio * (247 - 217))
  const green = Math.round(244 - ratio * (244 - 64))
  const blue = Math.round(238 - ratio * (238 - 64))

  return ratio < 0.12 ? '#F7F4EE' : `rgb(${red}, ${green}, ${blue})`
}

const shortPeriod = (period: string) => period.replace(' – ', '–').replace(':00', '')

export default function HeatmapChart({ data }: { data: HeatmapRow[] }) {
  if (!data.length) {
    return (
      <div className="dash-card fade-up" style={{ padding: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 6 }}>Hotspot จังหวัด × ช่วงเวลา</div>
        <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>ไม่มีข้อมูลเหตุการณ์สำหรับตัวกรองนี้</div>
      </div>
    )
  }

  const allValues = data.flatMap((row) => PERIODS.map((period) => Number(row[period] ?? 0)))
  const maxValue = Math.max(...allValues, 1)

  return (
    <div className="dash-card fade-up" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.05, marginBottom: 6 }}>
            Hotspot จังหวัด × ช่วงเวลา
          </div>
          <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
            สีเข้มหมายถึงจำนวนเหตุสูง ช่วยเห็นทั้งจังหวัดที่กระจุกตัวและช่วงเวลาที่พุ่งขึ้นพร้อมกัน
          </div>
        </div>
        <span className="soft-pill" style={{ whiteSpace: 'nowrap', background: 'var(--clr-subtle)' }}>
          Top 10 จังหวัด
        </span>
      </div>

      <div style={{ background: '#FAFAF7', borderRadius: 16, border: '1px solid var(--clr-border)', padding: '14px 14px 10px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 4 }}>
          <thead>
            <tr>
              <th style={{ color: 'var(--clr-muted)', fontWeight: 600, fontSize: 12, textAlign: 'left', paddingBottom: 8 }}>อันดับ</th>
              <th style={{ color: 'var(--clr-muted)', fontWeight: 600, fontSize: 12, textAlign: 'left', paddingBottom: 8, whiteSpace: 'nowrap' }}>
                จังหวัด
              </th>
              {PERIODS.map((period) => (
                <th
                  key={period}
                  style={{
                    color: 'var(--clr-muted)',
                    fontWeight: 600,
                    fontSize: 12,
                    textAlign: 'center',
                    paddingBottom: 8,
                    minWidth: 84,
                  }}
                >
                  {shortPeriod(period)}
                </th>
              ))}
              <th style={{ color: 'var(--clr-muted)', fontWeight: 600, fontSize: 12, textAlign: 'right', paddingBottom: 8 }}>รวม</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.province}>
                <td style={{ color: 'var(--clr-muted)', fontSize: 13, fontWeight: 700 }}>{index + 1}</td>
                <td style={{ color: 'var(--clr-text)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' }}>{row.province}</td>
                {PERIODS.map((period) => {
                  const value = Number(row[period] ?? 0)
                  const background = getColor(value, maxValue)
                  const textColor = value / maxValue > 0.52 ? '#fff' : 'var(--clr-text)'

                  return (
                    <td
                      key={period}
                      style={{
                        background,
                        color: textColor,
                        borderRadius: 8,
                        minWidth: 56,
                        textAlign: 'center',
                        padding: '8px 10px',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {value}
                    </td>
                  )
                })}
                <td style={{ color: 'var(--clr-muted)', fontSize: 14, fontWeight: 700, textAlign: 'right' }}>{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, color: 'var(--clr-muted)', fontSize: 13 }}>
        <span>ต่ำ</span>
        <div style={{ flex: 1, height: 10, borderRadius: 999, background: 'linear-gradient(to right, #F7F4EE, #D94040)' }} />
        <span>สูง</span>
      </div>
    </div>
  )
}

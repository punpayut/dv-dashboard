'use client'
import { PERIODS } from '@/lib/constants'

type Row = Record<string, string | number>

function getColor(value: number, max: number) {
  const t = max > 0 ? value / max : 0
  const r = Math.round(255 - t * (255 - 226))
  const g = Math.round(255 - t * (255 - 75))
  const b = Math.round(255 - t * (255 - 74))
  return t < 0.15 ? '#F7F6F3' : `rgb(${r},${g},${b})`
}

export default function HeatmapChart({ data }: { data: Row[] }) {
  const allVals = data.flatMap(row => PERIODS.map(p => Number(row[p] ?? 0)))
  const maxVal = Math.max(...allVals, 1)
  const shortPeriod = (p: string) => p.replace(' – ', '–').replace(':00', '')

  return (
    <div className="dash-card fade-up p-5">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--clr-text)', lineHeight: 1.2, marginBottom: 4 }}>
            Hotspot จังหวัด × ช่วงเวลา
          </div>
          <div style={{ fontSize: 12, color: 'var(--clr-muted)' }}>
            Top 10 จังหวัดที่มีเหตุสูงสุด — สีเข้ม = จำนวนมาก
          </div>
        </div>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--clr-subtle)', color: 'var(--clr-muted)', border: '1px solid var(--clr-border)' }}>Top 10</span>
      </div>
      <div style={{ background: '#FAFAF7', borderRadius: 10, border: '1px solid var(--clr-border)', padding: '14px 14px 8px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="text-left text-xs pb-2 pr-3" style={{ color: 'var(--clr-muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                จังหวัด
              </th>
              {PERIODS.map(p => (
                <th key={p} className="text-center text-xs pb-2 px-1" style={{ color: 'var(--clr-muted)', fontWeight: 500, minWidth: 70 }}>
                  {shortPeriod(p)}
                </th>
              ))}
              <th className="text-right text-xs pb-2 pl-3" style={{ color: 'var(--clr-muted)', fontWeight: 500 }}>
                รวม
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={String(row.province)}>
                <td className="text-xs pr-3 py-0.5" style={{ whiteSpace: 'nowrap', color: 'var(--clr-text)' }}>
                  {String(row.province)}
                </td>
                {PERIODS.map(p => {
                  const val = Number(row[p] ?? 0)
                  const bg = getColor(val, maxVal)
                  const textColor = val / maxVal > 0.5 ? 'white' : 'var(--clr-text)'
                  return (
                    <td
                      key={p}
                      className="text-center text-xs font-medium py-1.5"
                      style={{
                        background: bg,
                        color: textColor,
                        borderRadius: 6,
                        minWidth: 52,
                      }}
                    >
                      {val}
                    </td>
                  )
                })}
                <td className="text-right text-xs font-semibold pl-3" style={{ color: 'var(--clr-muted)' }}>
                  {Number(row.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <span className="text-xs" style={{ color: 'var(--clr-muted)' }}>น้อย</span>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(to right, #F7F6F3, #E24B4A)' }} />
        <span className="text-xs" style={{ color: 'var(--clr-muted)' }}>มาก</span>
      </div>
    </div>
  )
}

'use client'

import { GENDERS, PERIODS, REGIONS } from '@/lib/constants'

type Filters = { region: string; period: string; gender: string }
type Props = { filters: Filters; onChange: (filters: Filters) => void }

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label className="section-label">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="filter-select">
        <option value="">ทั้งหมด</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function FilterBar({ filters, onChange }: Props) {
  const update = (key: keyof Filters) => (value: string) => onChange({ ...filters, [key]: value })
  const activeCount = [filters.region, filters.period, filters.gender].filter(Boolean).length

  return (
    <div className="dash-card fade-up" style={{ padding: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 18 }}>
        <Select label="ภูมิภาค" value={filters.region} options={REGIONS} onChange={update('region')} />
        <Select label="ช่วงเวลา" value={filters.period} options={PERIODS} onChange={update('period')} />
        <Select label="เพศ" value={filters.gender} options={GENDERS} onChange={update('gender')} />

        {activeCount > 0 && (
          <button
            onClick={() => onChange({ region: '', period: '', gender: '' })}
            style={{
              height: 49,
              padding: '0 16px',
              borderRadius: 14,
              border: '1px solid var(--clr-border)',
              background: 'rgba(255,255,255,0.72)',
              color: 'var(--clr-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--clr-amber)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeCount}
            </span>
            ล้างตัวกรอง
          </button>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTop: '1px dashed var(--clr-border)',
          fontSize: 14,
          color: 'var(--clr-muted)',
        }}
      >
        ภูมิภาคใช้ได้ทุกข้อ · ช่วงเวลาใช้กับคำถามข้อ 2 · เพศใช้กับคำถามข้อ 1 และข้อ 3
      </div>
    </div>
  )
}

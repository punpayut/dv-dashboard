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
    <div className="dash-card fade-up" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="section-label" style={{ marginBottom: 8 }}>
            Control Center
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.02, marginBottom: 6 }}>
            ปรับขอบเขตข้อมูลที่ต้องการอ่าน
          </div>
          <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
            ภูมิภาคใช้ได้ทุกคำถาม · ช่วงเวลาเน้นข้อ 2 · เพศใช้เปรียบเทียบข้อ 1 และข้อ 3
          </div>
        </div>

        <span className="soft-pill" style={{ background: 'rgba(123, 97, 255, 0.08)', color: '#7b61ff' }}>
          ใช้งานตัวกรอง {activeCount} รายการ
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 18 }}>
        <Select label="ภูมิภาค" value={filters.region} options={REGIONS} onChange={update('region')} />
        <Select label="ช่วงเวลา" value={filters.period} options={PERIODS} onChange={update('period')} />
        <Select label="เพศ" value={filters.gender} options={GENDERS} onChange={update('gender')} />

        {activeCount > 0 && (
          <button
            onClick={() => onChange({ region: '', period: '', gender: '' })}
            style={{
              height: 51,
              padding: '0 18px',
              borderRadius: 16,
              border: '1px solid rgba(236, 230, 249, 0.92)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5efff 100%)',
              color: 'var(--clr-text)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 14px 26px rgba(118, 81, 161, 0.08)',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f34d8f 0%, #8c55f2 100%)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {activeCount}
            </span>
            ล้างตัวกรอง
          </button>
        )}
      </div>
    </div>
  )
}

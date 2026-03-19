'use client'
import { GENDERS, PERIODS, REGIONS } from '@/lib/constants'

type Filters = { region: string; period: string; gender: string }
type Props   = { filters: Filters; onChange: (f: Filters) => void }

function Select({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="section-label">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="filter-select"
      >
        <option value="">ทั้งหมด</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

export default function FilterBar({ filters, onChange }: Props) {
  const update = (key: keyof Filters) => (v: string) => onChange({ ...filters, [key]: v })
  const hasFilter = filters.region || filters.period || filters.gender
  const activeCount = [filters.region, filters.period, filters.gender].filter(Boolean).length

  return (
    <div
      className="dash-card fade-up flex flex-wrap items-end gap-5 px-5 py-4"
    >
      <Select label="ภูมิภาค"   value={filters.region} options={REGIONS} onChange={update('region')} />
      <Select label="ช่วงเวลา"  value={filters.period} options={PERIODS} onChange={update('period')} />
      <Select label="เพศ"       value={filters.gender} options={GENDERS} onChange={update('gender')} />

      {hasFilter && (
        <div className="flex flex-col gap-1.5">
          <label className="section-label opacity-0">_</label>
          <button
            onClick={() => onChange({ region: '', period: '', gender: '' })}
            style={{
              fontSize: 12,
              padding: '8px 14px',
              borderRadius: 10,
              border: '1px solid var(--clr-border)',
              background: 'transparent',
              color: 'var(--clr-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--clr-border-strong)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--clr-border)')}
          >
            <span
              style={{
                background: 'var(--clr-amber)',
                color: 'white',
                fontSize: 10,
                fontWeight: 600,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeCount}
            </span>
            ล้าง filter
          </button>
        </div>
      )}
    </div>
  )
}

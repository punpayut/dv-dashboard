'use client'
import { GENDERS, PERIODS, REGIONS } from '@/lib/constants'

type Filters = {
  region: string
  period: string
  gender: string
}

type Props = {
  filters: Filters
  onChange: (f: Filters) => void
}

function Select({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--clr-muted)' }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
        style={{
          border: '1px solid var(--clr-border)',
          background: 'white',
          color: 'var(--clr-text)',
          minWidth: 160,
        }}
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

  return (
    <div
      className="flex flex-wrap items-end gap-4 rounded-2xl p-4"
      style={{ background: 'white', border: '1px solid var(--clr-border)' }}
    >
      <Select label="ภูมิภาค" value={filters.region} options={REGIONS} onChange={update('region')} />
      <Select label="ช่วงเวลา" value={filters.period} options={PERIODS} onChange={update('period')} />
      <Select label="เพศ" value={filters.gender} options={GENDERS} onChange={update('gender')} />

      {hasFilter && (
        <button
          onClick={() => onChange({ region: '', period: '', gender: '' })}
          className="text-xs px-3 py-2 rounded-lg transition-colors"
          style={{
            border: '1px solid var(--clr-border)',
            color: 'var(--clr-muted)',
            background: 'transparent',
            cursor: 'pointer',
            marginBottom: 1,
          }}
        >
          ล้าง filter
        </button>
      )}
    </div>
  )
}

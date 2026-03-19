import Papa from 'papaparse'
import type { IncidentRow, OffenderRow, VictimRow } from './constants'
import { AGE_ORDER, AGE_SHORT, PERIODS, RISK_COLS, RISK_LABEL } from './constants'

export async function loadCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(path)
  const text = await res.text()
  const result = Papa.parse<T>(text, { header: true, skipEmptyLines: true })
  return result.data
}

// ── KPIs ──────────────────────────────────────────────────────────────
export function computeKPIs(
  incident: IncidentRow[],
  offender: OffenderRow[],
  victim: VictimRow[]
) {
  const total = incident.length
  const homePct = Math.round(
    (incident.filter(r => r.Locale === 'สถานที่ส่วนบุคคล').length / total) * 100
  )
  const vicFemalePct = Math.round(
    (victim.filter(r => r.Gender === 'หญิง').length / victim.length) * 100
  )
  const offMalePct = Math.round(
    (offender.filter(r => r.Gender === 'ชาย').length / offender.length) * 100
  )
  const childLabels = ['วัยเด็กเล็กแรกเกิด - 6 ปี', 'วัยเด็กตอนกลาง 7 - 12 ปี']
  const childN = victim.filter(r => childLabels.includes(r['Age Range'])).length

  return { total, homePct, vicFemalePct, offMalePct, childN }
}

// ── Butterfly ─────────────────────────────────────────────────────────
export function computeButterfly(offender: OffenderRow[], victim: VictimRow[]) {
  const groups = AGE_ORDER.map(age => {
    const offM = offender.filter(r => r['Age Range'] === age && r.Gender === 'ชาย').length
    const offF = offender.filter(r => r['Age Range'] === age && r.Gender === 'หญิง').length
    const vicM = victim.filter(r => r['Age Range'] === age && r.Gender === 'ชาย').length
    const vicF = victim.filter(r => r['Age Range'] === age && r.Gender === 'หญิง').length
    const offTotal = offender.length || 1
    const vicTotal = victim.length || 1
    return {
      age: AGE_SHORT[age] ?? age,
      fullAge: age,
      offMale: -parseFloat(((offM / offTotal) * 100).toFixed(1)),
      offFemale: -parseFloat(((offF / offTotal) * 100).toFixed(1)),
      vicMale: parseFloat(((vicM / vicTotal) * 100).toFixed(1)),
      vicFemale: parseFloat(((vicF / vicTotal) * 100).toFixed(1)),
    }
  })
  return groups
}

// ── Heatmap province × period ─────────────────────────────────────────
export function computeHeatmap(incident: IncidentRow[]) {
  const provCounts: Record<string, number> = {}
  incident.forEach(r => { provCounts[r.Province] = (provCounts[r.Province] ?? 0) + 1 })
  const top10 = Object.entries(provCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(e => e[0])

  return top10.map(prov => {
    const row: Record<string, string | number> = { province: prov }
    PERIODS.forEach(p => {
      row[p] = incident.filter(r => r.Province === prov && r.Period === p).length
    })
    row.total = incident.filter(r => r.Province === prov).length
    return row
  }).sort((a, b) => (b.total as number) - (a.total as number))
}

// ── Risk factors ──────────────────────────────────────────────────────
export function computeRisk(offender: OffenderRow[], victim: VictimRow[]) {
  return RISK_COLS.map(col => {
    const offYes = offender.filter(r => r[col] === 'ใช่').length
    const vicYes = victim.filter(r => r[col] === 'ใช่').length
    const offPct = parseFloat(((offYes / (offender.length || 1)) * 100).toFixed(1))
    const vicPct = parseFloat(((vicYes / (victim.length || 1)) * 100).toFixed(1))
    return { factor: RISK_LABEL[col] ?? col, offPct, vicPct, offYes, vicYes }
  }).sort((a, b) => b.offPct - a.offPct)
}

// ── Period distribution ───────────────────────────────────────────────
export function computePeriod(incident: IncidentRow[]) {
  return PERIODS.map(p => ({
    period: p.replace(' – ', '–'),
    count: incident.filter(r => r.Period === p).length,
  }))
}

// ── Region distribution ───────────────────────────────────────────────
export function computeRegion(incident: IncidentRow[]) {
  const counts: Record<string, number> = {}
  incident.forEach(r => { counts[r.Regional] = (counts[r.Regional] ?? 0) + 1 })
  return Object.entries(counts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
}

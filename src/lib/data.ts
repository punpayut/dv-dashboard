import Papa from 'papaparse'
import type { IncidentRow, OffenderRow, RiskColumn, VictimRow } from './constants'
import {
  AGE_ORDER,
  AGE_SHORT,
  NO_RISK_PROFILE,
  PERIODS,
  PRIVATE_LOCATION,
  RISK_COLS,
  RISK_LABEL,
  YES,
} from './constants'

export type AgeGenderPeak = {
  gender: string
  ageRange: string
  ageShort: string
  count: number
  pct: number
  label: string
}

export type GenderLeader = {
  gender: string
  count: number
  pct: number
}

export type ButterflyRow = {
  age: string
  fullAge: string
  offMale: number
  offFemale: number
  vicMale: number
  vicFemale: number
}

export type HeatmapRow = {
  province: string
  total: number
  [period: string]: string | number
}

export type RiskPriorityRow = {
  factorKey: RiskColumn
  factor: string
  count: number
  pct: number
  singleCount: number
  singlePct: number
  multiCount: number
  multiPct: number
  multiShare: number
}

export type RiskProfileRow = {
  profile: string
  count: number
  pct: number
}

export async function loadCSV<T>(path: string): Promise<T[]> {
  const res = await fetch(path)
  const text = await res.text()
  const result = Papa.parse<T>(text, { header: true, skipEmptyLines: true })
  return result.data
}

const pct = (count: number, total: number, digits = 1) =>
  Number(((count / (total || 1)) * 100).toFixed(digits))

const normalizePeriod = (period: string) => period.replace(' – ', '–')

function getTopAgeGenderGroup(rows: Array<{ Gender: string; 'Age Range': string }>): AgeGenderPeak | null {
  if (!rows.length) return null

  const grouped = new Map<string, AgeGenderPeak>()

  rows.forEach((row) => {
    const key = `${row.Gender}__${row['Age Range']}`
    const current = grouped.get(key)

    if (current) {
      current.count += 1
      current.pct = pct(current.count, rows.length)
      return
    }

    grouped.set(key, {
      gender: row.Gender,
      ageRange: row['Age Range'],
      ageShort: AGE_SHORT[row['Age Range']] ?? row['Age Range'],
      count: 1,
      pct: pct(1, rows.length),
      label: `${row.Gender} · ${row['Age Range']}`,
    })
  })

  return mapValues(grouped).sort((a, b) => b.count - a.count)[0] ?? null
}

function getDominantGender(rows: Array<{ Gender: string }>): GenderLeader | null {
  if (!rows.length) return null

  const counts = mapEntries(getCounts(rows, (row) => row.Gender)).sort((a, b) => b[1] - a[1])
  const [gender, count = 0] = counts[0] ?? ['', 0]

  return {
    gender,
    count,
    pct: pct(count, rows.length),
  }
}

function getCounts<T>(rows: T[], getKey: (row: T) => string) {
  const counts = new Map<string, number>()

  rows.forEach((row) => {
    const key = getKey(row)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  return counts
}

function mapEntries<K, V>(map: Map<K, V>) {
  const entries: Array<[K, V]> = []
  map.forEach((value, key) => {
    entries.push([key, value])
  })
  return entries
}

function mapValues<V>(map: Map<unknown, V>) {
  const values: V[] = []
  map.forEach((value) => {
    values.push(value)
  })
  return values
}

export function computeKPIs(incident: IncidentRow[], offender: OffenderRow[], victim: VictimRow[]) {
  const childRanges = AGE_ORDER.slice(0, 2)

  return {
    total: incident.length,
    privatePct: pct(
      incident.filter((row) => row.Locale === PRIVATE_LOCATION).length,
      incident.length,
      0
    ),
    vicFemalePct: pct(victim.filter((row) => row.Gender === 'หญิง').length, victim.length),
    offMalePct: pct(offender.filter((row) => row.Gender === 'ชาย').length, offender.length),
    childVictimCount: victim.filter((row) => childRanges.includes(row['Age Range'])).length,
  }
}

export function computeWhoSummary(offender: OffenderRow[], victim: VictimRow[]) {
  return {
    offenderPeak: getTopAgeGenderGroup(offender),
    victimPeak: getTopAgeGenderGroup(victim),
    offenderLeader: getDominantGender(offender),
    victimLeader: getDominantGender(victim),
    offenderMalePct: pct(offender.filter((row) => row.Gender === 'ชาย').length, offender.length),
    victimFemalePct: pct(victim.filter((row) => row.Gender === 'หญิง').length, victim.length),
  }
}

export function computeButterfly(offender: OffenderRow[], victim: VictimRow[]): ButterflyRow[] {
  const offenderTotal = offender.length || 1
  const victimTotal = victim.length || 1

  return AGE_ORDER.map((ageRange) => {
    const offMale = offender.filter((row) => row['Age Range'] === ageRange && row.Gender === 'ชาย').length
    const offFemale = offender.filter((row) => row['Age Range'] === ageRange && row.Gender === 'หญิง').length
    const vicMale = victim.filter((row) => row['Age Range'] === ageRange && row.Gender === 'ชาย').length
    const vicFemale = victim.filter((row) => row['Age Range'] === ageRange && row.Gender === 'หญิง').length

    return {
      age: AGE_SHORT[ageRange] ?? ageRange,
      fullAge: ageRange,
      offMale: -Number(((offMale / offenderTotal) * 100).toFixed(1)),
      offFemale: -Number(((offFemale / offenderTotal) * 100).toFixed(1)),
      vicMale: Number(((vicMale / victimTotal) * 100).toFixed(1)),
      vicFemale: Number(((vicFemale / victimTotal) * 100).toFixed(1)),
    }
  })
}

export function computeHeatmap(incident: IncidentRow[]): HeatmapRow[] {
  if (!incident.length) return []

  const provinceTotals = getCounts(incident, (row) => row.Province)
  const topProvinces = mapEntries(provinceTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([province]) => province)

  const provincePeriodCounts = getCounts(incident, (row) => `${row.Province}__${row.Period}`)

  return topProvinces
    .map((province) => {
      const row: HeatmapRow = { province, total: provinceTotals.get(province) ?? 0 }

      PERIODS.forEach((period) => {
        row[period] = provincePeriodCounts.get(`${province}__${period}`) ?? 0
      })

      return row
    })
    .sort((a, b) => b.total - a.total)
}

export function computeHotspotSummary(incident: IncidentRow[]) {
  const provinceCounts = mapEntries(getCounts(incident, (row) => row.Province)).sort((a, b) => b[1] - a[1])
  const periodCounts = mapEntries(getCounts(incident, (row) => row.Period)).sort((a, b) => b[1] - a[1])
  const localeCounts = mapEntries(getCounts(incident, (row) => row.Locale)).sort((a, b) => b[1] - a[1])
  const provincePeriodCounts = mapEntries(getCounts(incident, (row) => `${row.Province}__${row.Period}`)).sort(
    (a, b) => b[1] - a[1]
  )

  const [topProvince, topProvinceCount = 0] = provinceCounts[0] ?? ['', 0]
  const [topPeriod, topPeriodCount = 0] = periodCounts[0] ?? ['', 0]
  const [topLocale, topLocaleCount = 0] = localeCounts[0] ?? ['', 0]
  const [topProvincePeriodKey, topProvincePeriodCount = 0] = provincePeriodCounts[0] ?? ['', 0]
  const [hotspotProvince = '', hotspotPeriod = ''] = topProvincePeriodKey.split('__')

  return {
    topProvince: {
      label: topProvince,
      count: topProvinceCount,
      pct: pct(topProvinceCount, incident.length),
    },
    topPeriod: {
      label: topPeriod,
      shortLabel: normalizePeriod(topPeriod),
      count: topPeriodCount,
      pct: pct(topPeriodCount, incident.length),
    },
    topLocale: {
      label: topLocale,
      count: topLocaleCount,
      pct: pct(topLocaleCount, incident.length),
    },
    topProvincePeriod: {
      province: hotspotProvince,
      period: hotspotPeriod,
      shortPeriod: normalizePeriod(hotspotPeriod),
      count: topProvincePeriodCount,
    },
  }
}

export function computeRiskPriority(offender: OffenderRow[]): RiskPriorityRow[] {
  const total = offender.length || 1

  return RISK_COLS.map((column) => {
    const factorRows = offender.filter((row) => row[column] === YES)
    const multiFactorRows = factorRows.filter((row) => Number(row.risk_count || 0) >= 2)
    const singleCount = factorRows.length - multiFactorRows.length

    return {
      factorKey: column,
      factor: RISK_LABEL[column],
      count: factorRows.length,
      pct: pct(factorRows.length, total),
      singleCount,
      singlePct: pct(singleCount, total),
      multiCount: multiFactorRows.length,
      multiPct: pct(multiFactorRows.length, total),
      multiShare: pct(multiFactorRows.length, factorRows.length || 1),
    }
  }).sort((a, b) => b.count - a.count)
}

export function computeRiskProfiles(offender: OffenderRow[]) {
  const total = offender.length || 1
  const profileCounts = mapEntries(getCounts(offender, (row) => row.risk_profile)).sort((a, b) => b[1] - a[1])
  const topProfile = profileCounts.find(([profile]) => profile !== NO_RISK_PROFILE)
  const noRiskCount = profileCounts.find(([profile]) => profile === NO_RISK_PROFILE)?.[1] ?? 0
  const multiFactorCount = offender.filter((row) => Number(row.risk_count || 0) >= 2).length
  const highRiskCount = offender.filter((row) => Number(row.risk_count || 0) >= 3).length

  return {
    noRiskCount,
    noRiskPct: pct(noRiskCount, total),
    multiFactorCount,
    multiFactorPct: pct(multiFactorCount, total),
    highRiskCount,
    highRiskPct: pct(highRiskCount, total),
    topProfile:
      topProfile && topProfile[0] !== NO_RISK_PROFILE
        ? {
            profile: topProfile[0],
            count: topProfile[1],
            pct: pct(topProfile[1], total),
          }
        : null,
    topProfiles: profileCounts.slice(0, 6).map(([profile, count]) => ({
      profile,
      count,
      pct: pct(count, total),
    })) satisfies RiskProfileRow[],
  }
}

export function computePeriod(incident: IncidentRow[]) {
  const counts = getCounts(incident, (row) => row.Period)

  return PERIODS.map((period) => ({
    period: normalizePeriod(period),
    count: counts.get(period) ?? 0,
  }))
}

export function computeRegion(incident: IncidentRow[]) {
  return mapEntries(getCounts(incident, (row) => row.Regional))
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
}

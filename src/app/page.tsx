'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  loadCSV, computeKPIs, computeButterfly,
  computeHeatmap, computeRisk, computePeriod, computeRegion,
} from '@/lib/data'
import type { IncidentRow, OffenderRow, VictimRow } from '@/lib/constants'
import KpiCard from '@/components/KpiCard'
import FilterBar from '@/components/FilterBar'
import ButterflyChart from '@/components/ButterflyChart'
import HeatmapChart from '@/components/HeatmapChart'
import RiskChart from '@/components/RiskChart'
import { PeriodChart, RegionChart } from '@/components/MiniCharts'

type Filters = { region: string; period: string; gender: string }

export default function Dashboard() {
  const [incident, setIncident] = useState<IncidentRow[]>([])
  const [offender, setOffender] = useState<OffenderRow[]>([])
  const [victim, setVictim] = useState<VictimRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({ region: '', period: '', gender: '' })

  useEffect(() => {
    Promise.all([
      loadCSV<IncidentRow>('/data/incident_clean.csv'),
      loadCSV<OffenderRow>('/data/offender_clean.csv'),
      loadCSV<VictimRow>('/data/victim_clean.csv'),
    ]).then(([inc, off, vic]) => {
      setIncident(inc)
      setOffender(off)
      setVictim(vic)
      setLoading(false)
    })
  }, [])

  // Apply filters
  const filteredIncident = useMemo(() => {
    let d = incident
    if (filters.region) d = d.filter(r => r.Regional === filters.region)
    if (filters.period) d = d.filter(r => r.Period === filters.period)
    return d
  }, [incident, filters])

  const filteredOffender = useMemo(() => {
    let d = offender
    if (filters.gender) d = d.filter(r => r.Gender === filters.gender)
    return d
  }, [offender, filters])

  const filteredVictim = useMemo(() => {
    let d = victim
    if (filters.gender) d = d.filter(r => r.Gender === filters.gender)
    return d
  }, [victim, filters])

  const kpis    = useMemo(() => computeKPIs(filteredIncident, filteredOffender, filteredVictim), [filteredIncident, filteredOffender, filteredVictim])
  const butterfly = useMemo(() => computeButterfly(filteredOffender, filteredVictim), [filteredOffender, filteredVictim])
  const heatmap = useMemo(() => computeHeatmap(filteredIncident), [filteredIncident])
  const risk    = useMemo(() => computeRisk(filteredOffender, filteredVictim), [filteredOffender, filteredVictim])
  const period  = useMemo(() => computePeriod(filteredIncident), [filteredIncident])
  const region  = useMemo(() => computeRegion(filteredIncident), [filteredIncident])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ color: 'var(--clr-muted)' }}>
        <div className="text-center">
          <div className="text-2xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>กำลังโหลดข้อมูล…</div>
          <div className="text-sm">โปรดรอสักครู่</div>
        </div>
      </div>
    )
  }

  const hasFilter = filters.region || filters.period || filters.gender

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100vh' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'white', borderBottom: '1px solid var(--clr-border)' }}
      >
        <div>
          <h1
            className="text-xl leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-text)' }}
          >
            Family Violence Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--clr-muted)' }}>
            ข้อมูลเหตุความรุนแรงในครอบครัว — VCIS กระทรวงพัฒนาสังคม
          </p>
        </div>
        {hasFilter && (
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', color: 'var(--clr-amber)' }}
          >
            กำลัง filter อยู่
          </span>
        )}
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        {/* Filter Bar */}
        <div className="mb-6">
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          <KpiCard label="เหตุการณ์ทั้งหมด"    value={kpis.total.toLocaleString()} />
          <KpiCard label="เกิดในบ้าน"            value={`${kpis.homePct}%`}         accent="accent" />
          <KpiCard label="ผู้ถูกกระทำเป็นหญิง"  value={`${kpis.vicFemalePct}%`}    accent="victim" />
          <KpiCard label="ผู้กระทำเป็นชาย"      value={`${kpis.offMalePct}%`}      accent="offender" />
          <KpiCard label="เด็ก < 12 ปี"          value={kpis.childN}                accent="amber" sub="ราย ที่ถูกกระทำ" />
        </div>

        {/* Row 1: Butterfly + Risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ButterflyChart data={butterfly} />
          <RiskChart data={risk} />
        </div>

        {/* Row 2: Heatmap full width */}
        <div className="mb-4">
          <HeatmapChart data={heatmap} />
        </div>

        {/* Row 3: Period + Region */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <PeriodChart data={period} />
          <RegionChart data={region} />
        </div>

        {/* Footer */}
        <footer className="text-center text-xs py-4" style={{ color: 'var(--clr-muted)', borderTop: '1px solid var(--clr-border)' }}>
          THackle DataViz Challenge — ข้อมูลสาธารณะ VCIS · สร้างด้วย Next.js + Recharts
        </footer>
      </main>
    </div>
  )
}

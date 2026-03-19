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
  const [victim,   setVictim]   = useState<VictimRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filters,  setFilters]  = useState<Filters>({ region: '', period: '', gender: '' })

  useEffect(() => {
    Promise.all([
      loadCSV<IncidentRow>('/data/incident_clean.csv'),
      loadCSV<OffenderRow>('/data/offender_clean.csv'),
      loadCSV<VictimRow>('/data/victim_clean.csv'),
    ]).then(([inc, off, vic]) => {
      setIncident(inc); setOffender(off); setVictim(vic); setLoading(false)
    })
  }, [])

  const filteredIncident = useMemo(() => {
    let d = incident
    if (filters.region) d = d.filter(r => r.Regional === filters.region)
    if (filters.period) d = d.filter(r => r.Period   === filters.period)
    return d
  }, [incident, filters])

  const filteredOffender = useMemo(() =>
    filters.gender ? offender.filter(r => r.Gender === filters.gender) : offender
  , [offender, filters.gender])

  const filteredVictim = useMemo(() =>
    filters.gender ? victim.filter(r => r.Gender === filters.gender) : victim
  , [victim, filters.gender])

  const kpis      = useMemo(() => computeKPIs(filteredIncident, filteredOffender, filteredVictim), [filteredIncident, filteredOffender, filteredVictim])
  const butterfly = useMemo(() => computeButterfly(filteredOffender, filteredVictim),              [filteredOffender, filteredVictim])
  const heatmap   = useMemo(() => computeHeatmap(filteredIncident),                                [filteredIncident])
  const risk      = useMemo(() => computeRisk(filteredOffender, filteredVictim),                   [filteredOffender, filteredVictim])
  const period    = useMemo(() => computePeriod(filteredIncident),                                 [filteredIncident])
  const region    = useMemo(() => computeRegion(filteredIncident),                                 [filteredIncident])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: ['var(--clr-offender)','var(--clr-victim)','var(--clr-accent)'][i],
              animation: 'fadeUp 0.6s ease infinite alternate',
              animationDelay: `${i * 0.15}s`,
            }} />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--clr-text)' }}>
            กำลังโหลดข้อมูล
          </p>
          <p style={{ fontSize: 13, color: 'var(--clr-muted)', marginTop: 4 }}>
            incident · offender · victim
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[140, 100, 120].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 14 }} />
          ))}
        </div>
      </div>
    )
  }

  const activeFilters = [
    filters.region && `ภูมิภาค: ${filters.region}`,
    filters.period && `เวลา: ${filters.period}`,
    filters.gender && `เพศ: ${filters.gender}`,
  ].filter(Boolean)

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100vh' }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--clr-border)', position: 'sticky', top: 0, zIndex: 20 }}>
        {/* accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(to right, var(--clr-offender) 0%, var(--clr-victim) 50%, var(--clr-accent) 100%)' }} />
        <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--clr-text)', lineHeight: 1.2 }}>
              Family Violence Dashboard
            </h1>
            <p style={{ fontSize: 12, color: 'var(--clr-muted)', marginTop: 3 }}>
              ข้อมูลเหตุความรุนแรงในครอบครัว — VCIS กระทรวงพัฒนาสังคมและความมั่นคงของมนุษย์
            </p>
          </div>

          {/* active filter pills */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {activeFilters.map(f => (
                <span key={f} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: 'var(--clr-amber-light)', color: 'var(--clr-amber)',
                  border: '1px solid #E9CFA0', fontWeight: 500,
                }}>
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>

        {/* Filter */}
        <div style={{ marginBottom: 20 }}>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        {/* KPI row */}
        <p className="section-label fade-up" style={{ marginBottom: 10 }}>ภาพรวม</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 12, marginBottom: 24 }}>
          <KpiCard label="เหตุการณ์ทั้งหมด"   value={kpis.total.toLocaleString()} animDelay="0.05s" />
          <KpiCard label="เกิดในบ้าน"           value={`${kpis.homePct}%`}         accent="accent"   animDelay="0.10s" />
          <KpiCard label="ผู้ถูกกระทำเป็นหญิง" value={`${kpis.vicFemalePct}%`}    accent="victim"   animDelay="0.15s" />
          <KpiCard label="ผู้กระทำเป็นชาย"     value={`${kpis.offMalePct}%`}      accent="offender" animDelay="0.20s" />
          <KpiCard label="เด็ก < 12 ปี"         value={kpis.childN}                accent="amber"    animDelay="0.25s" sub="ราย ที่ถูกกระทำ" />
        </div>

        {/* Q1: Who */}
        <p className="section-label fade-up fade-up-3" style={{ marginBottom: 10 }}>Q1 — ใครเสี่ยงที่สุด?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <ButterflyChart data={butterfly} />
          <RiskChart data={risk} />
        </div>

        {/* Q2: Where & When */}
        <p className="section-label fade-up fade-up-4" style={{ marginBottom: 10 }}>Q2 — เกิดที่ไหน เมื่อไหร่?</p>
        <div style={{ marginBottom: 16 }}>
          <HeatmapChart data={heatmap} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
          <PeriodChart data={period} />
          <RegionChart data={region} />
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center', fontSize: 12, paddingTop: 16,
          borderTop: '1px solid var(--clr-border)', color: 'var(--clr-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <span style={{ display: 'flex', gap: 4 }}>
            {['var(--clr-offender)','var(--clr-victim)','var(--clr-accent)'].map((c,i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: c, display: 'inline-block' }} />
            ))}
          </span>
          THackle DataViz Challenge — ข้อมูลสาธารณะ VCIS · Next.js + Recharts
        </footer>
      </main>
    </div>
  )
}

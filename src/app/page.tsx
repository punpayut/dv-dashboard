'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  loadCSV,
  computeKPIs,
  computeButterfly,
  computeHeatmap,
  computeRisk,
  computePeriod,
  computeRegion,
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

  const filteredIncident = useMemo(() => {
    let data = incident
    if (filters.region) data = data.filter((row) => row.Regional === filters.region)
    if (filters.period) data = data.filter((row) => row.Period === filters.period)
    return data
  }, [incident, filters])

  const filteredOffender = useMemo(
    () => (filters.gender ? offender.filter((row) => row.Gender === filters.gender) : offender),
    [offender, filters.gender]
  )

  const filteredVictim = useMemo(
    () => (filters.gender ? victim.filter((row) => row.Gender === filters.gender) : victim),
    [victim, filters.gender]
  )

  const kpis = useMemo(
    () => computeKPIs(filteredIncident, filteredOffender, filteredVictim),
    [filteredIncident, filteredOffender, filteredVictim]
  )
  const butterfly = useMemo(
    () => computeButterfly(filteredOffender, filteredVictim),
    [filteredOffender, filteredVictim]
  )
  const heatmap = useMemo(() => computeHeatmap(filteredIncident), [filteredIncident])
  const risk = useMemo(() => computeRisk(filteredOffender, filteredVictim), [filteredOffender, filteredVictim])
  const period = useMemo(() => computePeriod(filteredIncident), [filteredIncident])
  const region = useMemo(() => computeRegion(filteredIncident), [filteredIncident])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: ['var(--clr-offender)', 'var(--clr-victim)', 'var(--clr-accent)'][i],
                animation: 'fadeUp 0.6s ease infinite alternate',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--clr-text)' }}>
            กำลังโหลดข้อมูล
          </p>
          <p style={{ fontSize: 15, color: 'var(--clr-muted)', marginTop: 6 }}>
            incident · offender · victim
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[160, 120, 140].map((w, i) => (
            <div key={i} className="skeleton" style={{ width: w, height: 16 }} />
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
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(14px)',
          background: 'rgba(245, 243, 239, 0.72)',
          borderBottom: '1px solid rgba(228, 224, 216, 0.92)',
        }}
      >
        <div
          style={{
            height: 3,
            background:
              'linear-gradient(to right, var(--clr-offender) 0%, var(--clr-victim) 50%, var(--clr-accent) 100%)',
          }}
        />
        <div
          className="dashboard-shell"
          style={{
            paddingTop: 12,
            paddingBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: 4 }}>
              THackle Dataviz Challenge
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 1.2rem + 1vw, 2.25rem)',
                color: 'var(--clr-text)',
                lineHeight: 1.1,
              }}
            >
              Family Violence Dashboard
            </h1>
          </div>

          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="soft-pill"
                  style={{
                    background: 'var(--clr-amber-light)',
                    color: 'var(--clr-amber)',
                    borderColor: '#e9cfa0',
                  }}
                >
                  {filter}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-shell">
        <div style={{ marginBottom: 20 }}>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>

        <section style={{ marginBottom: 28 }}>
          <div className="section-head fade-up">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Overview
              </p>
              <h3 className="section-title">ตัวเลขสำคัญที่หยิบอ่านได้ทันที</h3>
            </div>
            <p className="section-copy">
              เพิ่มขนาดข้อความหลักและแยกสีตามความหมายของข้อมูล เพื่อให้กวาดสายตาแล้วเข้าใจเร็วขึ้น
            </p>
          </div>
          <div className="dashboard-grid-kpi">
            <KpiCard label="เหตุการณ์ทั้งหมด" value={kpis.total.toLocaleString()} animDelay="0.05s" />
            <KpiCard label="เกิดในบ้าน" value={`${kpis.homePct}%`} accent="accent" animDelay="0.10s" />
            <KpiCard label="ผู้ถูกกระทำเป็นหญิง" value={`${kpis.vicFemalePct}%`} accent="victim" animDelay="0.15s" />
            <KpiCard label="ผู้กระทำเป็นชาย" value={`${kpis.offMalePct}%`} accent="offender" animDelay="0.20s" />
            <KpiCard label="เด็ก < 12 ปี" value={kpis.childN} accent="amber" animDelay="0.25s" sub="รายที่ถูกกระทำ" />
          </div>
        </section>

        <section style={{ marginBottom: 24 }}>
          <div className="section-head fade-up fade-up-3">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Q1
              </p>
              <h3 className="section-title">ใครเสี่ยงที่สุด</h3>
            </div>
            <p className="section-copy">
              วางสองกราฟคู่กันเพื่อเปรียบเทียบโครงสร้างอายุ-เพศและปัจจัยเสี่ยงในมุมเดียวกัน
            </p>
          </div>
          <div className="dashboard-grid-two">
            <ButterflyChart data={butterfly} />
            <RiskChart data={risk} />
          </div>
        </section>

        <section style={{ marginBottom: 28 }}>
          <div className="section-head fade-up fade-up-4">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Q2
              </p>
              <h3 className="section-title">เกิดที่ไหน และเกิดเมื่อไร</h3>
            </div>
            <p className="section-copy">
              ใช้ heatmap เป็นภาพหลัก แล้วเสริมด้วยกราฟย่อยที่อ่านจำนวนเหตุในแต่ละช่วงเวลาและภูมิภาคได้ชัดขึ้น
            </p>
          </div>
          <div style={{ marginBottom: 18 }}>
            <HeatmapChart data={heatmap} />
          </div>
          <div className="dashboard-grid-two-compact">
            <PeriodChart data={period} />
            <RegionChart data={region} />
          </div>
        </section>

        <footer
          style={{
            borderTop: '1px solid rgba(228, 224, 216, 0.92)',
            paddingTop: 18,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            color: 'var(--clr-muted)',
            fontSize: '0.95rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'flex', gap: 5 }}>
              {['var(--clr-offender)', 'var(--clr-victim)', 'var(--clr-accent)'].map((color, index) => (
                <span
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: color,
                    display: 'inline-block',
                  }}
                />
              ))}
            </span>
            THackle DataViz Challenge
          </div>
          <div>ข้อมูลสาธารณะ VCIS · Next.js + Recharts</div>
        </footer>
      </main>
    </div>
  )
}

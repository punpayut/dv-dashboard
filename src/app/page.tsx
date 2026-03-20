'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  computeButterfly,
  computeHeatmap,
  computeHotspotSummary,
  computeKPIs,
  computePeriod,
  computeRegion,
  computeRiskPriority,
  computeRiskProfiles,
  computeWhoSummary,
  loadCSV,
} from '@/lib/data'
import type { IncidentRow, OffenderRow, VictimRow } from '@/lib/constants'
import ButterflyChart from '@/components/ButterflyChart'
import FilterBar from '@/components/FilterBar'
import HeatmapChart from '@/components/HeatmapChart'
import KpiCard from '@/components/KpiCard'
import { PeriodChart, RegionChart } from '@/components/MiniCharts'
import RiskChart from '@/components/RiskChart'

type Filters = { region: string; period: string; gender: string }

const formatPercent = (value?: number | null) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '-'
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}%`
}

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
    ]).then(([incidentRows, offenderRows, victimRows]) => {
      setIncident(incidentRows)
      setOffender(offenderRows)
      setVictim(victimRows)
      setLoading(false)
    })
  }, [])

  const filteredIncident = useMemo(() => {
    let rows = incident
    if (filters.region) rows = rows.filter((row) => row.Regional === filters.region)
    if (filters.period) rows = rows.filter((row) => row.Period === filters.period)
    return rows
  }, [incident, filters.period, filters.region])

  const filteredOffender = useMemo(() => {
    let rows = offender
    if (filters.region) rows = rows.filter((row) => row.Regional === filters.region)
    if (filters.gender) rows = rows.filter((row) => row.Gender === filters.gender)
    return rows
  }, [offender, filters.gender, filters.region])

  const filteredVictim = useMemo(() => {
    let rows = victim
    if (filters.region) rows = rows.filter((row) => row.Regional === filters.region)
    if (filters.gender) rows = rows.filter((row) => row.Gender === filters.gender)
    return rows
  }, [victim, filters.gender, filters.region])

  const overview = useMemo(
    () => computeKPIs(filteredIncident, filteredOffender, filteredVictim),
    [filteredIncident, filteredOffender, filteredVictim]
  )
  const who = useMemo(() => computeWhoSummary(filteredOffender, filteredVictim), [filteredOffender, filteredVictim])
  const butterfly = useMemo(() => computeButterfly(filteredOffender, filteredVictim), [filteredOffender, filteredVictim])
  const heatmap = useMemo(() => computeHeatmap(filteredIncident), [filteredIncident])
  const hotspot = useMemo(() => computeHotspotSummary(filteredIncident), [filteredIncident])
  const period = useMemo(() => computePeriod(filteredIncident), [filteredIncident])
  const region = useMemo(() => computeRegion(filteredIncident), [filteredIncident])
  const riskPriority = useMemo(() => computeRiskPriority(filteredOffender), [filteredOffender])
  const riskProfiles = useMemo(() => computeRiskProfiles(filteredOffender), [filteredOffender])

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
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: ['var(--clr-offender)', 'var(--clr-victim)', 'var(--clr-accent)'][index],
                animation: 'fadeUp 0.6s ease infinite alternate',
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--clr-text)' }}>กำลังโหลดข้อมูล</p>
          <p style={{ fontSize: 15, color: 'var(--clr-muted)', marginTop: 6 }}>incident · offender · victim</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[160, 120, 140].map((width, index) => (
            <div key={index} className="skeleton" style={{ width, height: 16 }} />
          ))}
        </div>
      </div>
    )
  }

  const activeFilters = [
    filters.region && `ภูมิภาค: ${filters.region}`,
    filters.period && `ช่วงเวลา: ${filters.period}`,
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
                marginBottom: 4,
              }}
            >
              Family Violence Dashboard
            </h1>
            <p style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
              ตอบ 3 คำถามหลักจากข้อมูลเหตุการณ์ ผู้กระทำ และผู้ถูกกระทำในครอบครัว
            </p>
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

        <div className="dashboard-grid-kpi" style={{ marginBottom: 30 }}>
          <KpiCard label="เหตุที่รายงาน" value={overview.total.toLocaleString()} accent="accent" sub="ชุดข้อมูลเหตุการณ์ที่อยู่ในตัวกรองนี้" />
          <KpiCard
            label="เกิดในสถานที่ส่วนบุคคล"
            value={formatPercent(overview.privatePct)}
            accent="amber"
            sub={`${filteredIncident.filter((row) => row.Locale === 'สถานที่ส่วนบุคคล').length.toLocaleString()} เหตุ`}
          />
          <KpiCard
            label="ผู้กระทำเป็นชาย"
            value={formatPercent(overview.offMalePct)}
            accent="offender"
            sub={`${filteredOffender.filter((row) => row.Gender === 'ชาย').length.toLocaleString()} ราย`}
          />
          <KpiCard
            label="ผู้ถูกกระทำเป็นหญิง"
            value={formatPercent(overview.vicFemalePct)}
            accent="victim"
            sub={`${filteredVictim.filter((row) => row.Gender === 'หญิง').length.toLocaleString()} ราย`}
          />
          <KpiCard
            label="เด็กอายุต่ำกว่า 12 ปี"
            value={overview.childVictimCount.toLocaleString()}
            accent="amber"
            sub="ในฝั่งผู้ถูกกระทำ"
          />
        </div>

        <section style={{ marginBottom: 30 }}>
          <div className="section-head fade-up">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Q1
              </p>
              <h2 className="section-title">ใครเสี่ยงที่สุด?</h2>
            </div>
            <p className="section-copy">
              ดูโครงสร้างอายุและเพศของผู้กระทำกับผู้ถูกกระทำในภาพเดียว เพื่อเห็นทันทีว่ากลุ่มเสี่ยงสูงสุดของแต่ละบทบาทต่างกันอย่างไร
            </p>
          </div>

          <div className="dashboard-grid-kpi" style={{ marginBottom: 18 }}>
            <KpiCard
              label="ผู้กระทำที่พบบ่อยสุด"
              value={formatPercent(who.offenderPeak?.pct)}
              accent="offender"
              sub={
                who.offenderPeak
                  ? `${who.offenderPeak.gender} · ${who.offenderPeak.ageShort} · ${who.offenderPeak.count.toLocaleString()} ราย`
                  : 'ไม่มีข้อมูล'
              }
            />
            <KpiCard
              label="เพศเด่นฝั่งผู้กระทำ"
              value={formatPercent(who.offenderLeader?.pct)}
              accent="offender"
              sub={
                who.offenderLeader
                  ? `${who.offenderLeader.gender} · ${who.offenderLeader.count.toLocaleString()} ราย`
                  : 'ไม่มีข้อมูล'
              }
            />
            <KpiCard
              label="ผู้ถูกกระทำที่พบบ่อยสุด"
              value={formatPercent(who.victimPeak?.pct)}
              accent="victim"
              sub={
                who.victimPeak
                  ? `${who.victimPeak.gender} · ${who.victimPeak.ageShort} · ${who.victimPeak.count.toLocaleString()} ราย`
                  : 'ไม่มีข้อมูล'
              }
            />
            <KpiCard
              label="เพศเด่นฝั่งผู้ถูกกระทำ"
              value={formatPercent(who.victimLeader?.pct)}
              accent="victim"
              sub={
                who.victimLeader
                  ? `${who.victimLeader.gender} · ${who.victimLeader.count.toLocaleString()} ราย`
                  : 'ไม่มีข้อมูล'
              }
            />
          </div>

          <ButterflyChart data={butterfly} />
        </section>

        <section style={{ marginBottom: 30 }}>
          <div className="section-head fade-up fade-up-3">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Q2
              </p>
              <h2 className="section-title">เกิดที่ไหน เมื่อไหร่?</h2>
            </div>
            <p className="section-copy">
              มองหา hotspot ของเหตุการณ์จากทั้งพื้นที่และช่วงเวลา เพื่อเห็นจุดที่อาจต้องจัดทรัพยากรเฝ้าระวังหรือป้องกันเพิ่ม
            </p>
          </div>

          <div className="dashboard-grid-kpi" style={{ marginBottom: 18 }}>
            <KpiCard
              label="จังหวัดที่พบมากสุด"
              value={formatPercent(hotspot.topProvince.pct)}
              accent="accent"
              sub={`${hotspot.topProvince.label || 'ไม่มีข้อมูล'} · ${hotspot.topProvince.count.toLocaleString()} เหตุ`}
            />
            <KpiCard
              label="ช่วงเวลาที่พบบ่อยสุด"
              value={formatPercent(hotspot.topPeriod.pct)}
              accent="amber"
              sub={`${hotspot.topPeriod.shortLabel || 'ไม่มีข้อมูล'} · ${hotspot.topPeriod.count.toLocaleString()} เหตุ`}
            />
            <KpiCard
              label="เกิดในสถานที่ส่วนบุคคล"
              value={formatPercent(overview.privatePct)}
              accent="amber"
              sub={`${filteredIncident.filter((row) => row.Locale === 'สถานที่ส่วนบุคคล').length.toLocaleString()} เหตุ`}
            />
            <KpiCard
              label="Hotspot สูงสุด"
              value={hotspot.topProvincePeriod.count.toLocaleString()}
              accent="offender"
              sub={`${hotspot.topProvincePeriod.province || 'ไม่มีข้อมูล'} · ${hotspot.topProvincePeriod.shortPeriod || '-'}`}
            />
          </div>

          <div style={{ marginBottom: 18 }}>
            <HeatmapChart data={heatmap} />
          </div>

          <div className="dashboard-grid-two-compact">
            <PeriodChart data={period} />
            <RegionChart data={region} />
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <div className="section-head fade-up fade-up-4">
            <div>
              <p className="section-label" style={{ marginBottom: 4 }}>
                Q3
              </p>
              <h2 className="section-title">อะไรคือสัญญาณเตือน?</h2>
            </div>
            <p className="section-copy">
              จัดลำดับปัจจัยเสี่ยงของผู้กระทำ โดยดูทั้งความถี่และการเกิดร่วมกับปัจจัยอื่น เพื่อบอกว่าควรเริ่มป้องกันจากจุดใดก่อน
            </p>
          </div>

          <div className="dashboard-grid-kpi" style={{ marginBottom: 18 }}>
            <KpiCard
              label="อันดับ 1"
              value={formatPercent(riskPriority[0]?.pct)}
              accent="amber"
              sub={riskPriority[0] ? `${riskPriority[0].factor} · ${riskPriority[0].count.toLocaleString()} ราย` : 'ไม่มีข้อมูล'}
            />
            <KpiCard
              label="อันดับ 2"
              value={formatPercent(riskPriority[1]?.pct)}
              accent="amber"
              sub={riskPriority[1] ? `${riskPriority[1].factor} · ${riskPriority[1].count.toLocaleString()} ราย` : 'ไม่มีข้อมูล'}
            />
            <KpiCard
              label="อันดับ 3"
              value={formatPercent(riskPriority[2]?.pct)}
              accent="amber"
              sub={riskPriority[2] ? `${riskPriority[2].factor} · ${riskPriority[2].count.toLocaleString()} ราย` : 'ไม่มีข้อมูล'}
            />
            <KpiCard
              label="มี 2 ปัจจัยขึ้นไป"
              value={formatPercent(riskProfiles.multiFactorPct)}
              accent="offender"
              sub={`${riskProfiles.multiFactorCount.toLocaleString()} ราย`}
            />
          </div>

          <RiskChart data={riskPriority} summary={riskProfiles} />
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
            วิเคราะห์จากไฟล์ใน `public/data/*.csv`
          </div>
          <div>Next.js + Recharts · THackle DataViz Challenge</div>
        </footer>
      </main>
    </div>
  )
}

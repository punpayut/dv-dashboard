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
        <div style={{ display: 'flex', gap: 10 }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: ['#f34d8f', '#7b61ff', '#48b8ff'][index],
                animation: 'fadeUp 0.6s ease infinite alternate',
                animationDelay: `${index * 0.15}s`,
              }}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--clr-text)' }}>กำลังโหลดข้อมูล dashboard</p>
          <p style={{ fontSize: 15, color: 'var(--clr-muted)', marginTop: 6 }}>incident · offender · victim</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[170, 120, 150].map((width, index) => (
            <div key={index} className="skeleton" style={{ width, height: 18 }} />
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

  const scopeText = activeFilters.length > 0 ? activeFilters.join(' · ') : 'ประเทศไทยทั้งหมด · ทุกช่วงเวลา · ทุกเพศ'
  const topRisk = riskPriority[0]

  const heroStats = [
    {
      label: 'เหตุที่รายงาน',
      value: overview.total.toLocaleString(),
      copy: 'เคสทั้งหมดภายใต้ตัวกรองปัจจุบัน',
      gradient: 'linear-gradient(135deg, #f34d8f 0%, #8c55f2 100%)',
    },
    {
      label: 'Hotspot สูงสุด',
      value: hotspot.topProvincePeriod.count.toLocaleString(),
      copy: hotspot.topProvincePeriod.province
        ? `${hotspot.topProvincePeriod.province} · ${hotspot.topProvincePeriod.shortPeriod}`
        : 'ยังไม่พบ hotspot',
      gradient: 'linear-gradient(135deg, #7b61ff 0%, #46b8ff 100%)',
    },
    {
      label: 'กลุ่มเสี่ยงฝั่งผู้กระทำ',
      value: formatPercent(who.offenderPeak?.pct),
      copy: who.offenderPeak ? `${who.offenderPeak.gender} · ${who.offenderPeak.ageShort}` : 'ไม่มีข้อมูล',
      gradient: 'linear-gradient(135deg, #6a5cff 0%, #9b59ff 100%)',
    },
    {
      label: 'Trigger อันดับ 1',
      value: formatPercent(topRisk?.pct),
      copy: topRisk ? topRisk.factor : 'ไม่มีข้อมูล',
      gradient: 'linear-gradient(135deg, #ffb11f 0%, #ff7a45 100%)',
    },
  ]

  const q1Insights = [
    who.offenderPeak
      ? `ฝั่งผู้กระทำกระจุกสูงสุดที่ ${who.offenderPeak.gender} วัย ${who.offenderPeak.ageShort} คิดเป็น ${formatPercent(who.offenderPeak.pct)} ของผู้กระทำทั้งหมด`
      : 'ไม่พบกลุ่มเด่นฝั่งผู้กระทำ',
    who.victimPeak
      ? `ฝั่งผู้ถูกกระทำเด่นสุดที่ ${who.victimPeak.gender} วัย ${who.victimPeak.ageShort} คิดเป็น ${formatPercent(who.victimPeak.pct)} ของผู้ถูกกระทำทั้งหมด`
      : 'ไม่พบกลุ่มเด่นฝั่งผู้ถูกกระทำ',
    'กราฟเดียวช่วยให้เห็นทันทีว่าโครงสร้างของผู้กระทำและผู้ถูกกระทำไม่ได้กระจายตัวแบบเดียวกัน',
  ]

  const q2Insights = [
    hotspot.topProvince.label
      ? `${hotspot.topProvince.label} เป็นจังหวัดที่พบเหตุสูงสุด ${formatPercent(hotspot.topProvince.pct)} ของเหตุทั้งหมดในขอบเขตนี้`
      : 'ไม่พบจังหวัดเด่น',
    hotspot.topPeriod.shortLabel
      ? `ช่วง ${hotspot.topPeriod.shortLabel} มีเหตุสูงสุด ${hotspot.topPeriod.count.toLocaleString()} เหตุ`
      : 'ไม่พบช่วงเวลาเด่น',
    hotspot.topLocale.label
      ? `${hotspot.topLocale.label} เป็นบริบทหลักของเหตุการณ์ ${formatPercent(hotspot.topLocale.pct)}`
      : 'ไม่พบบริบทสถานที่เด่น',
  ]

  return (
    <main className="dashboard-shell">
      <div className="admin-shell">
        <section className="admin-main">
          <div className="admin-topbar">
            <div>
              <div className="topbar-eyebrow">Analytics Workspace</div>
              <div className="topbar-title">Family Violence Dashboard</div>
            </div>

            <div className="topbar-actions">
              <span className="topbar-chip">Public VCIS Dataset</span>
              <span className="topbar-chip">3 Key Questions</span>
              <div className="topbar-icon" />
              <div className="topbar-icon" />
              <div className="topbar-icon" />
            </div>
          </div>

          <div className="admin-content">
            <section className="hero-banner fade-up">
              <div className="hero-summary">
                <div className="section-label" style={{ marginBottom: 8 }}>
                  Dashboard Overview
                </div>
                {activeFilters.length > 0 && (
                  <div className="hero-pill-row">
                    <span className="soft-pill">{scopeText}</span>
                  </div>
                )}
              </div>

              <div className="hero-stats-grid">
                {heroStats.map((item) => (
                  <div key={item.label} className="hero-mini-card" style={{ background: item.gradient }}>
                    <div className="hero-mini-label">{item.label}</div>
                    <div className="hero-mini-value">{item.value}</div>
                    <div className="hero-mini-copy">{item.copy}</div>
                  </div>
                ))}
              </div>
            </section>

            <FilterBar filters={filters} onChange={setFilters} />

            <div className="dashboard-grid-kpi">
              <KpiCard label="เหตุที่รายงาน" value={overview.total.toLocaleString()} accent="accent" sub="เหตุทั้งหมดภายใต้ขอบเขตที่เลือก" />
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
            </div>

            <section>
              <div className="section-head fade-up">
                <div>
                  <p className="section-label" style={{ marginBottom: 4 }}>
                    Q1
                  </p>
                  <h2 className="section-title">ใครเสี่ยงที่สุด?</h2>
                </div>
                <p className="section-copy">
                  ใช้โครงสร้างอายุและเพศของผู้กระทำกับผู้ถูกกระทำในภาพเดียว เพื่อให้ pattern ของแต่ละบทบาทแยกจากกันชัดและเทียบได้ตรง ๆ
                </p>
              </div>

              <div className="dashboard-grid-split">
                <ButterflyChart data={butterfly} />

                <div className="insight-stack">
                  <div className="dash-card insight-card">
                    <div className="section-label">Key Read</div>
                    <div className="insight-card-title">โครงสร้างความเสี่ยงของสองบทบาทไม่เหมือนกัน</div>
                    <div style={{ color: 'var(--clr-muted)', fontSize: 14 }}>
                      ฝั่งผู้กระทำมีความเข้มข้นในผู้ชายวัยทำงานสูงกว่า ขณะที่ฝั่งผู้ถูกกระทำกระจายไปยังผู้หญิงหลายช่วงวัยมากกว่า
                    </div>
                    <div className="insight-list">
                      {q1Insights.map((item) => (
                        <div key={item} className="insight-list-row">
                          <span className="insight-bullet" />
                          <div style={{ fontSize: 14, color: 'var(--clr-text)' }}>{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dash-card insight-card">
                    <div className="section-label">Role Summary</div>
                    <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                      <div className="panel-soft" style={{ padding: 14 }}>
                        <div style={{ fontSize: 13, color: 'var(--clr-muted)', marginBottom: 6 }}>ผู้กระทำที่พบบ่อยสุด</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 0.95, marginBottom: 8 }}>
                          {formatPercent(who.offenderPeak?.pct)}
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--clr-text)' }}>
                          {who.offenderPeak ? `${who.offenderPeak.gender} · วัย ${who.offenderPeak.ageShort}` : 'ไม่มีข้อมูล'}
                        </div>
                      </div>
                      <div className="panel-soft" style={{ padding: 14 }}>
                        <div style={{ fontSize: 13, color: 'var(--clr-muted)', marginBottom: 6 }}>ผู้ถูกกระทำที่พบบ่อยสุด</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 0.95, marginBottom: 8 }}>
                          {formatPercent(who.victimPeak?.pct)}
                        </div>
                        <div style={{ fontSize: 14, color: 'var(--clr-text)' }}>
                          {who.victimPeak ? `${who.victimPeak.gender} · วัย ${who.victimPeak.ageShort}` : 'ไม่มีข้อมูล'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="section-head fade-up fade-up-3">
                <div>
                  <p className="section-label" style={{ marginBottom: 4 }}>
                    Q2
                  </p>
                  <h2 className="section-title">เกิดที่ไหน เมื่อไหร่?</h2>
                </div>
              </div>

              <div className="dashboard-grid-split">
                <HeatmapChart data={heatmap} />

                <div className="insight-stack">
                  <div className="dash-card insight-card">
                    <div className="section-label">Hotspot Signals</div>
                    <div className="insight-card-title">พื้นที่และเวลาที่ควรจับตาเป็นพิเศษ</div>
                    <div className="insight-list">
                      {q2Insights.map((item) => (
                        <div key={item} className="insight-list-row">
                          <span className="insight-bullet" />
                          <div style={{ fontSize: 14, color: 'var(--clr-text)' }}>{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <PeriodChart data={period} />
                  <RegionChart data={region} />
                </div>
              </div>
            </section>

            <section>
              <div className="section-head fade-up fade-up-4">
                <div>
                  <p className="section-label" style={{ marginBottom: 4 }}>
                    Q3
                  </p>
                  <h2 className="section-title">อะไรคือสัญญาณเตือน?</h2>
                </div>
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
                  accent="accent"
                  sub={riskPriority[1] ? `${riskPriority[1].factor} · ${riskPriority[1].count.toLocaleString()} ราย` : 'ไม่มีข้อมูล'}
                />
                <KpiCard
                  label="อันดับ 3"
                  value={formatPercent(riskPriority[2]?.pct)}
                  accent="victim"
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
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: '1px solid rgba(236, 230, 249, 0.9)',
                paddingTop: 18,
                color: 'var(--clr-muted)',
                fontSize: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ display: 'flex', gap: 5 }}>
                  {['#f34d8f', '#7b61ff', '#48b8ff'].map((color, index) => (
                    <span
                      key={index}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: color,
                        display: 'inline-block',
                      }}
                    />
                  ))}
                </span>
                Visual layout inspired by modern admin dashboards
              </div>
              <div>วิเคราะห์จากไฟล์ `public/data/*.csv` · Next.js + Recharts</div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  )
}

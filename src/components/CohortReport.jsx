import { useRef, useState } from 'react'
import { DqiGauge } from './reportCharts.jsx'
import { CohortDqiBandBar, CohortCapacityRow, CohortOrientationBar } from './cohortReportCharts.jsx'
import { downloadElementAsPdf } from '../lib/pdf.js'

// Organisation/cohort-level aggregate report — UVAA_Cohort_Report_Spec_v1_1.docx.
// Shared between OrgAdminDashboard.jsx (the buyer's HR administrator, via
// GET /org-admin/cohort-report) and AdminOrganisationDetail.jsx (the
// facilitator/Super Admin, via GET /admin/organisations/:id/cohort-report —
// `data.patternGrid` is simply absent on the buyer's payload; see
// uvaa-api's lib/cohortReport.js for why). Six fixed sections in a fixed
// order, same as the individual report (Report.jsx) — no tabs, no
// reordering, and (per the cohort spec) never an individual named or
// picked out: everything here is a mean, a count, or "fewer than 5".
const DQI_BAND_TITLE = { ANCHORED: 'Anchored', DEVELOPING: 'Developing', AT_RISK: 'At risk' }
const CAPACITY_DISPLAY_ORDER = ['UPEKSHA', 'VIVEKA', 'ANUVIGNA', 'ANASAKTI'] // mirrors uvaa-api's lib/cohortReport.js

// "{n1} people are {label1}, {n2} are {label2} and {n3} are {label3}." — used
// for the DQI band-count sentence (full view). Kept in the same order as
// the chart it sits under (At risk, Developing, Anchored — see
// lib/cohortReport.js) rather than the cohort spec's own illustrative
// example order (Anchored first), so the chart and the sentence never
// disagree about how the same merged/suppressed buckets are grouped.
function peopleAreSentence(buckets) {
  const parts = buckets.map((b, i) => `${b.display} ${i === 0 ? 'people ' : ''}are ${b.label}`)
  if (parts.length === 1) return `${parts[0]}.`
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}.`
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}.`
}

export default function CohortReport({ data }) {
  const contentRef = useRef(null)
  const [pdfState, setPdfState] = useState('idle')

  async function handleDownloadPdf() {
    if (!contentRef.current || pdfState === 'generating') return
    setPdfState('generating')
    try {
      await downloadElementAsPdf(contentRef.current, 'UVAA-Cohort-Report.pdf')
      setPdfState('idle')
    } catch {
      setPdfState('error')
    }
  }

  if (data.view === 'LOCKED') {
    return (
      <div className="cohort-report-locked">
        <p>{data.completedN} of {data.groupSize} people have completed the assessment.</p>
        <p className="admin-note">Results appear when 8 people have completed.</p>
      </div>
    )
  }

  const isFull = data.view === 'FULL'
  const capacityByDim = Object.fromEntries(data.capacities.map((c) => [c.dimension, c]))

  return (
    <div className="uvaa-report cohort-report">
      <div className="print-actions">
        <button type="button" className="btn btn-ghost" onClick={() => window.print()}>Print / Save as PDF</button>
        <button type="button" className="btn btn-primary" onClick={handleDownloadPdf} disabled={pdfState === 'generating'}>
          {pdfState === 'generating' ? 'Generating PDF…' : 'Download PDF'}
        </button>
      </div>
      {pdfState === 'error' && (
        <div className="status-msg error" style={{ display: 'block' }} role="alert">
          Could not generate the PDF. Please try again, or use Print / Save as PDF instead.
        </div>
      )}

      <div ref={contentRef} className="uvaa-report-content">
        {/* Section 1 — About this report. Fixed text, prints on every report. */}
        <section className="report-section">
          <h2 className="report-section-title">1. About this report</h2>
          <p>
            This report describes your group, not any individual in it. It combines the responses of
            everyone who completed the UVAA assessment and shows how the group responds to pressure.
            No one is named, and no one can be picked out.
          </p>
          <p>
            UVAA informs leadership development, onboarding and role-transition conversations. It is
            not to be used for hiring, promotion or termination decisions.
          </p>
          <p>
            The numbers describe the group on the day it took the assessment. They are a starting
            point for a conversation and not a verdict on the group or on anyone in it.
          </p>
        </section>

        {/* Section 2 — Who took part. */}
        <section className="report-section">
          <h2 className="report-section-title">2. Who took part</h2>
          <p>
            {data.completedN} of {data.groupSize} people completed the assessment between{' '}
            {data.startDate} and {data.endDate}.
            {isFull && ` This is a completion rate of ${data.completionRate}%.`}
            {' '}
            {data.mixedBands
              ? 'The group took the situations for more than one leadership level, so the results below combine them and are not compared by level.'
              : `The group took the ${data.bandsTaken[0]?.label ?? 'Leading a team'} set of situations.`}
          </p>
        </section>

        {/* Section 3 — Decision quality across the group. Small view: band
            arcs with the mean marked, no distribution bar. Full view: adds
            the At risk/Developing/Anchored count bar above the mean gauge. */}
        <section className="report-section">
          <h2 className="report-section-title">3. Decision quality across the group</h2>

          {isFull && <CohortDqiBandBar counts={data.dqi.counts} />}

          <div className="dqi-gauge-wrap">
            <DqiGauge pct={data.dqi.mean} band={data.dqi.band} />
          </div>

          <p>
            The group mean for decision quality is {data.dqi.mean}, which sits in the{' '}
            {DQI_BAND_TITLE[data.dqi.band]} band.
            {isFull && ` ${peopleAreSentence(data.dqi.counts)}`}
          </p>
          <p>{data.dqi.line}</p>
        </section>

        {/* Section 4 — The four capacities. Fixed Upeksha/Viveka/Anuvigna/
            Anasakti order, never sorted by score. */}
        <section className="report-section">
          <h2 className="report-section-title">4. The four capacities</h2>
          <p>
            {isFull
              ? 'For each capacity, the bar shows how many people scored 67 or above, 50 to 66, and below 50.'
              : 'For each capacity, the bar shows the mean for the group.'}
          </p>

          <div className="cohort-capacity-rows">
            {CAPACITY_DISPLAY_ORDER.map((dim) => {
              const c = capacityByDim[dim]
              return <CohortCapacityRow key={dim} dimension={dim} mean={c.mean} bandCounts={c.bandCounts} />
            })}
          </div>
        </section>

        {/* Section 5 — How the group operates. Small view: the most common
            orientation named only, no chart, no counts. Full view: the
            Sattva/Rajas/Tamas distribution bar plus a separate blend note. */}
        <section className="report-section">
          <h2 className="report-section-title">5. How the group operates</h2>

          {isFull && <CohortOrientationBar ranked={data.orientation.ranked} />}

          <p>{data.orientation.summaryLine}</p>
          {isFull && data.orientation.blendLine && (
            <p className="report-margin-note">{data.orientation.blendLine}</p>
          )}
        </section>

        {/* Section 6 — Where the group could focus. Fixed closing paragraph
            (cohort spec section 4, "not a build blocker"). */}
        <section className="report-section">
          <h2 className="report-section-title">6. Where the group could focus</h2>
          <p>
            The capacity where the group scored lowest is {data.focus.name}, with a group mean of{' '}
            {data.focus.mean}. {data.focus.suggestion}
          </p>
          <p className="report-footnote">
            What this report cannot tell you is who is where. If you would like a debrief with the
            group, or to explore what group-level work on {data.focus.name} could look like, write to{' '}
            <a href="mailto:sayee@dheemerconsulting.com" className="link-accent">sayee@dheemerconsulting.com</a>.
            The UVAA team will explain what it includes and what it costs before anything is agreed.
            Individuals who want a personalised development plan can ask for one themselves, and their
            reports stay private to them.
          </p>
        </section>

        {/* Facilitator-only, reserved past the pilot (cohort spec decision
            5) — absent from the buyer's payload entirely, so this never
            renders on the Org Admin dashboard. */}
        {data.patternGrid && (
          <section className="report-section">
            <h2 className="report-section-title">Pattern distribution (facilitator only)</h2>
            <p className="admin-note">
              Shown only to the facilitator, and only once 30 or more have completed ({data.patternGrid.totalN} have).
              Never shown to the buyer, and never broken down by individual.
            </p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Pattern</th><th>Count</th></tr></thead>
                <tbody>
                  {Object.entries(data.patternGrid.cells).filter(([, count]) => count > 0).map(([key, count]) => (
                    <tr key={key}><td>{key.replace('_', ' + ')}</td><td>{count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

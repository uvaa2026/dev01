// Inline SVG/CSS charts for the organisation/cohort-level report
// (CohortReport.jsx), matching UVAA_Cohort_Report_Spec_v1_1.docx's "Chart
// rule" for each section. Reuses reportCharts.jsx's DqiGauge as-is for the
// band-arcs-with-mean-marked chart the spec asks for in both views ("the
// band arcs from the individual gauge ... with the group mean marked on
// them"), and its guna colors/labels/order so the two reports read as one
// visual system — see the import below.
import { GUNA_ORDER, GUNA_COLOR, GUNA_LABEL, GUNA_ENGLISH } from './reportCharts.jsx'
import { DIMENSION_LABELS } from '../data/dimensionLabels.js'

const DQI_BAND_COLOR = { AT_RISK: 'var(--accent-magenta)', DEVELOPING: 'var(--accent-amber)', ANCHORED: 'var(--accent-cyan)' }
const CAPACITY_BAND_COLOR = { LOW: 'var(--accent-magenta)', MID: 'var(--accent-amber)', HIGH: 'var(--accent-cyan)' }

// Generic horizontal proportional bar split into named, counted segments —
// the full-view chart shape the cohort spec asks for three times over
// (section 3's At risk/Developing/Anchored split, section 4's per-capacity
// below-50/50-66/67-or-above split, and section 5's Sattva/Rajas/Tamas
// split). A merged/suppressed bucket (lib/cohortReport.js's `display`, e.g.
// "fewer than 5") is shown as its label text rather than a number, so the
// chart never contradicts the privacy rule that produced it. Segment width
// still comes from the raw count when one is known (a visual
// approximation, not a printed exact figure) so the bar reads sensibly even
// when its own label is suppressed; a fully-merged combined bucket has no
// per-sub-segment count to show width for and renders as one wide block.
function SegmentedCountBar({ segments, total }) {
  let cursor = 0
  const widths = segments.map((seg) => {
    const width = total > 0 ? ((seg.count ?? 0) / total) * 100 : 0
    const x = cursor
    cursor += width
    return { ...seg, x, width }
  })

  return (
    <div className="cohort-segmented-bar">
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="cohort-segmented-bar-svg" role="img" aria-label={segments.map((s) => `${s.label}: ${s.display}`).join(', ')}>
        {widths.map((seg) => (
          <rect key={seg.key} x={seg.x} y="0" width={Math.max(seg.width, 0)} height="14" fill={seg.color} />
        ))}
      </svg>
      <div className="cohort-segmented-bar-legend">
        {segments.map((seg) => (
          <div className="cohort-segmented-bar-legend-item" key={seg.key}>
            <span className="cohort-segmented-bar-swatch" style={{ background: seg.color }} aria-hidden="true" />
            <span>{seg.label}: <strong>{seg.display}</strong></span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Section 3
// Full view: At risk / Developing / Anchored, left to right — "matching the
// individual report" per the cohort spec's own chart rule.
export function CohortDqiBandBar({ counts }) {
  const segments = counts.map((c) => ({ ...c, color: DQI_BAND_COLOR[c.key] }))
  const total = segments.reduce((sum, s) => sum + (s.count ?? 0), 0)
  return <SegmentedCountBar segments={segments} total={total} />
}

// ---------------------------------------------------------------- Section 4
// One row per capacity, fixed Upeksha/Viveka/Anuvigna/Anasakti order (never
// sorted by score — the cohort spec is explicit about this, unlike the
// individual report's own CapacityBars, which sorts by score and is
// deliberately not reused here). Small view: a single bar showing only the
// mean, with the 50/67 dashed reference lines (reuses the exact CSS classes
// reportCharts.jsx's CapacityBars draws its bars with). Full view: a
// below-50/50-66/67-or-above segmented bar instead, with the mean printed
// at the end of the row, no dashed lines.
export function CohortCapacityRow({ dimension, mean, bandCounts }) {
  const label = DIMENSION_LABELS[dimension]
  return (
    <div className="cohort-capacity-row">
      <div className="cohort-capacity-label">
        <span className="cohort-capacity-sanskrit">{label.sanskrit}</span>
        <span className="cohort-capacity-name">{label.name}</span>
      </div>
      <div className="cohort-capacity-chart">
        {bandCounts ? (
          <SegmentedCountBar
            segments={bandCounts.map((c) => ({ ...c, color: CAPACITY_BAND_COLOR[c.key] }))}
            total={bandCounts.reduce((sum, c) => sum + (c.count ?? 0), 0)}
          />
        ) : (
          <div className="capacity-bar-track">
            <div className="capacity-bar-fill" style={{ width: `${Math.max(0, Math.min(100, mean))}%` }} />
            <div className="capacity-bar-refline" style={{ left: '50%' }} aria-hidden="true" />
            <div className="capacity-bar-refline" style={{ left: '67%' }} aria-hidden="true" />
          </div>
        )}
      </div>
      <span className="cohort-capacity-mean">{mean}</span>
    </div>
  )
}

// ---------------------------------------------------------------- Section 5
// Full view: fixed Sattva, Rajas, Tamas order — `ranked` is sorted by count
// for the chart's own proportions and the generated summary sentence, not
// the spec's fixed-order requirement (which only applies to sections 2 and
// 4), so this re-sorts back to the fixed guna order before drawing.
export function CohortOrientationBar({ ranked }) {
  const byGuna = Object.fromEntries(ranked.map((r) => [r.guna, r]))
  const segments = GUNA_ORDER.map((guna) => ({
    key: guna,
    label: `${GUNA_LABEL[guna]} (${GUNA_ENGLISH[guna]})`,
    count: byGuna[guna].count,
    display: byGuna[guna].display,
    color: GUNA_COLOR[guna],
  }))
  const total = segments.reduce((sum, s) => sum + (s.count ?? 0), 0)
  return <SegmentedCountBar segments={segments} total={total} />
}

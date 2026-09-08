import { Fragment } from 'react'

// Inline SVG charts for the participant report (Report.jsx), matching
// UVAA_Report_V4_050926.docx's "Chart rules" for each section exactly:
// fixed guna order regardless of magnitude, gauge + capacity bars with
// dashed 50/67 reference lines, and the nine-cell UVAA Pattern grid.
// No charting library — small, fully computed SVG, so the same geometry
// could later be reused server-side for a PDF export without drift (the
// spec's own rule: "The PDF and web view must be identical").

const GUNA_ORDER = ['SATTVA', 'RAJAS', 'TAMAS']
const GUNA_COLOR = { SATTVA: 'var(--accent-cyan)', RAJAS: 'var(--accent-amber)', TAMAS: 'var(--text-muted)' }
const GUNA_LABEL = { SATTVA: 'Sattva', RAJAS: 'Rajas', TAMAS: 'Tamas' }
const GUNA_ENGLISH = { SATTVA: 'Composure', RAJAS: 'Drive', TAMAS: 'Reserve' }

// ---------------------------------------------------------------- Section 2
export function GunaOrientationBar({ sattvaPct, rajasPct, tamasPct }) {
  const pctByGuna = { SATTVA: sattvaPct, RAJAS: rajasPct, TAMAS: tamasPct }
  let cursor = 0
  const segments = GUNA_ORDER.map((guna) => {
    const width = pctByGuna[guna]
    const seg = { guna, x: cursor, width }
    cursor += width
    return seg
  })

  return (
    <div className="guna-orientation-chart">
      <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="guna-orientation-svg" role="img" aria-label="Core orientation: Sattva, Rajas, Tamas proportions">
        {segments.map((seg) => (
          <rect key={seg.guna} x={seg.x} y="0" width={seg.width} height="14" fill={GUNA_COLOR[seg.guna]} />
        ))}
        {segments.map((seg) => (
          seg.width >= 12 && (
            <text
              key={`${seg.guna}-label`}
              x={seg.x + seg.width / 2}
              y="9.5"
              textAnchor="middle"
              fontSize="5.5"
              fill="#04101a"
              fontWeight="700"
            >
              {Math.round(seg.width)}%
            </text>
          )
        ))}
      </svg>
      <div className="guna-orientation-legend">
        {GUNA_ORDER.map((guna) => (
          <div className="guna-orientation-legend-item" key={guna}>
            <span className="guna-orientation-swatch" style={{ background: GUNA_COLOR[guna] }} aria-hidden="true" />
            <span>
              <span className="guna-orientation-legend-name">{GUNA_LABEL[guna]}</span>
              <span className="guna-orientation-legend-english">{GUNA_ENGLISH[guna]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Section 3
const DQI_BAND_ARCS = [
  { band: 'AT_RISK', from: 0, to: 40, color: 'var(--accent-magenta)' },
  { band: 'DEVELOPING', from: 40, to: 75, color: 'var(--accent-amber)' },
  { band: 'ANCHORED', from: 75, to: 100, color: 'var(--accent-cyan)' },
]
const DQI_BAND_TITLE = { ANCHORED: 'Anchored', DEVELOPING: 'Developing', AT_RISK: 'At risk' }

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

// value 0-100 -> angle 180 (left) .. 0 (right), sweeping over the top.
function valueToAngle(value) {
  return 180 - (value / 100) * 180
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

export function DqiGauge({ pct, band }) {
  const cx = 100
  const cy = 100
  const r = 82
  const clamped = Math.max(0, Math.min(100, pct))
  const needleAngle = valueToAngle(clamped)
  const needleTip = polarToCartesian(cx, cy, r - 18, needleAngle)

  return (
    <div className="dqi-gauge">
      <svg viewBox="0 0 200 130" role="img" aria-label={`Decision Quality Index: ${Math.round(clamped)} percent, ${DQI_BAND_TITLE[band]}`}>
        {DQI_BAND_ARCS.map((arc) => (
          <path
            key={arc.band}
            d={describeArc(cx, cy, r, valueToAngle(arc.from), valueToAngle(arc.to))}
            stroke={arc.color}
            strokeWidth="16"
            fill="none"
            strokeLinecap="butt"
            opacity={band === arc.band ? 1 : 0.35}
          />
        ))}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="var(--text-primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="6" fill="var(--text-primary)" />
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary)" fontFamily="var(--font-heading)">
          {Math.round(clamped)}%
        </text>
        <text x={cx} y={cy + 44} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">
          {DQI_BAND_TITLE[band]}
        </text>
      </svg>
    </div>
  )
}

export function CapacityBars({ capacities }) {
  const sorted = [...capacities].sort((a, b) => b.pct - a.pct)
  return (
    <div className="capacity-bars">
      {sorted.map((c) => (
        <div className="capacity-bar-row" key={c.dimension}>
          <div className="capacity-bar-label">
            <span className="name">{c.name}</span>
            <span className="pct">{Math.round(c.pct)}%</span>
          </div>
          <div className="capacity-bar-track">
            <div className="capacity-bar-fill" style={{ width: `${Math.max(0, Math.min(100, c.pct))}%` }} />
            <div className="capacity-bar-refline" style={{ left: '50%' }} aria-hidden="true" />
            <div className="capacity-bar-refline" style={{ left: '67%' }} aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------- Section 4
const GRID_ROWS = ['SATTVA', 'RAJAS', 'TAMAS']
const GRID_COLS = ['AT_RISK', 'DEVELOPING', 'ANCHORED'] // left to right: At risk -> Anchored
const GRID_COL_TITLE = { AT_RISK: 'At risk', DEVELOPING: 'Developing', ANCHORED: 'Anchored' }

export function PatternGrid({ dominance, patternBand }) {
  return (
    <div className="pattern-grid" role="img" aria-label={`UVAA pattern grid: ${GUNA_LABEL[dominance]}, ${GRID_COL_TITLE[patternBand]}`}>
      <div className="pattern-grid-corner" aria-hidden="true" />
      {GRID_COLS.map((col) => (
        <div className="pattern-grid-col-head" key={col}>{GRID_COL_TITLE[col]}</div>
      ))}
      {GRID_ROWS.map((row) => (
        <Fragment key={row}>
          <div className="pattern-grid-row-head">{GUNA_LABEL[row]}</div>
          {GRID_COLS.map((col) => {
            const occupied = row === dominance && col === patternBand
            return (
              <div
                key={`${row}-${col}`}
                className={`pattern-grid-cell${occupied ? ' occupied' : ''}`}
              />
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}

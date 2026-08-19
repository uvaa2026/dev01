// Pure scoring functions for the Guna profiler and construct assessment.
// No React, no side effects — implements the formulas from the FRD so the
// logic is correct regardless of which vignette/scenario data is plugged
// in (sample data today, the real validated bank later).

// ---- Guna profiler (FR-08) -------------------------------------------
// Sattva/Rajas/Tamas dominant if the vignette's key option is selected on
// at least 4 of that group's 5 probes. Mixed if no group meets threshold.
export function computeGunaProfile(answers, vignettes) {
  const groups = ['SATTVA', 'RAJAS', 'TAMAS']
  const hits = { SATTVA: 0, RAJAS: 0, TAMAS: 0 }
  const total = { SATTVA: 0, RAJAS: 0, TAMAS: 0 }

  vignettes.forEach((v) => {
    total[v.group] += 1
    if (answers[v.id] && answers[v.id] === v.keyOption) {
      hits[v.group] += 1
    }
  })

  const qualifying = groups.filter((g) => total[g] > 0 && hits[g] / total[g] >= 4 / 5)

  let profile = 'MIXED'
  if (qualifying.length === 1) {
    profile = qualifying[0]
  } else if (qualifying.length > 1) {
    // Tie-break on the higher hit count; a genuine tie stays Mixed.
    const sorted = [...qualifying].sort((a, b) => hits[b] - hits[a])
    profile = hits[sorted[0]] > hits[sorted[1]] ? sorted[0] : 'MIXED'
  }

  return { profile, hits, total }
}

// ---- Construct assessment (FR-19 / FR-20 / FR-21 / FR-22) -------------
function bandForEdsi(pct) {
  if (pct >= 75) return 'Sattva Dominant'
  if (pct >= 40) return 'Transitional — Sattva Developing'
  return 'Rajas or Tamas Dominant'
}

function bandForNkoi(pct) {
  if (pct >= 75) return 'Nishkama Dominant'
  if (pct >= 50) return 'Developing Orientation'
  return 'Outcome-Attached'
}

export function computeConstructResults(answers, scenarios) {
  const byDimension = {}

  scenarios.forEach((scenario) => {
    const dim = scenario.dimension
    if (!byDimension[dim]) byDimension[dim] = { raw: 0, max: 0, answered: 0, total: 0 }
    byDimension[dim].total += 1
    byDimension[dim].max += 3

    const selectedKey = answers[scenario.id]
    if (selectedKey) {
      const option = scenario.options.find((o) => o.key === selectedKey)
      if (option) {
        byDimension[dim].raw += option.score
        byDimension[dim].answered += 1
      }
    }
  })

  const dimensions = {}
  let totalRaw = 0
  let totalMax = 0
  let nkoiCount = 0
  let answeredCount = 0

  Object.entries(byDimension).forEach(([dim, d]) => {
    const pct = d.max > 0 ? (d.raw / d.max) * 100 : 0
    dimensions[dim] = {
      raw: d.raw,
      max: d.max,
      pct,
      deficient: pct < 67,
    }
    totalRaw += d.raw
    totalMax += d.max
  })

  scenarios.forEach((scenario) => {
    const selectedKey = answers[scenario.id]
    if (!selectedKey) return
    answeredCount += 1
    const option = scenario.options.find((o) => o.key === selectedKey)
    if (option && option.score === 3) nkoiCount += 1
  })

  const edsiPct = totalMax > 0 ? (totalRaw / totalMax) * 100 : 0
  const nkoiPct = scenarios.length > 0 ? (nkoiCount / scenarios.length) * 100 : 0

  const priorityDimension = Object.entries(dimensions).sort(
    (a, b) => a[1].pct - b[1].pct,
  )[0]?.[0]

  return {
    dimensions,
    edsi: { raw: totalRaw, max: totalMax, pct: edsiPct, band: bandForEdsi(edsiPct) },
    nkoi: { count: nkoiCount, pct: nkoiPct, band: bandForNkoi(nkoiPct) },
    priorityDimension,
    answeredCount,
    totalScenarios: scenarios.length,
  }
}

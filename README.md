# UVAA Web App

React presentation layer for UVAA (Under-pressure Value-Anchored Adaptive
Intelligence) — the welcome/landing page, registration/login, and the full
assessment flow (Guna profiler → construct scenarios → processing/results).
Built with Vite + React + React Router so it can be extended with a real
backend and the validated scenario bank.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  components/     Header, Footer, GrainOverlay (shared across all pages)
  pages/          Welcome.jsx, Register.jsx, Login.jsx — one per route
  pages/assessment/
    GunaProfiler.jsx        Stage 1 — 15 vignettes, then a Guna result panel
    ConstructAssessment.jsx Stage 2 — scenario-by-scenario, next/back
    Processing.jsx          Stage 3 — processing animation, then EDSI/NKOI results
  context/
    AssessmentContext.jsx   In-memory answers shared across the three
                             assessment pages (no localStorage — see Notes)
  data/
    careerStages.js   vertical → career-stage dropdown config (FR-02A/FR-02B)
    gunaVignettes.js  SAMPLE Guna profiler content — see below
    scenarios.js      SAMPLE construct-assessment scenarios — see below
  lib/
    api.js              fetch wrapper for the backend (see below)
    scoring.js          pure functions implementing FR-08 (Guna dominance),
                         FR-20 (subscale scoring), FR-21 (EDSI), FR-22 (NKOI)
    useScrollToHash.js  smooth-scrolls to landing-page sections when
                         navigated to from another route
  index.css       Global stylesheet — the dark theme
```

## About the assessment content — sample data, not the real bank

`gunaVignettes.js` (15 vignettes) and `scenarios.js` (8 scenarios, 2 per
dimension) are placeholder content so the whole flow — navigation, scoring,
results — is functional and testable end to end. The FRD calls for 15
validated Guna vignettes and 64 validated construct scenarios (32 per
vertical) authored and scored by the UVAA framework developer; that scoring
key is the product's core IP and isn't something I generated.

`scoring.js` only depends on the data shape (`group`/`keyOption` for
vignettes, `dimension`/`options[].score` for scenarios) — so dropping in the
real content later is a data swap, not a rewrite. Percentages are computed
proportionally to however many scenarios exist per dimension, so the engine
works the same whether there are 2 sample scenarios per dimension or the
real 8.

One deliberate deviation from the FRD: FR-09 says the Guna profile should
only appear in the facilitator report, never shown to the respondent. This
build shows it to the respondent right after Stage 1, because that's what
was asked for. Worth a conscious decision before this goes further — hiding
it is a small change to `GunaProfiler.jsx` if you want to match the FRD.

## Connecting a backend

`src/lib/api.js` is a small fetch wrapper already used by the register and
login forms. With no backend configured, submitting either form shows an
informational "no backend configured yet" message instead of failing
silently.

To connect a real API:

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your API's
   base URL.
2. Confirm the endpoints `api.register()` / `api.login()` call match your
   backend, or edit `src/lib/api.js`.
3. The assessment pages don't call the API yet — `Processing.jsx` computes
   results client-side from `AssessmentContext`. Wire it to
   `POST /assessment/submit` (or similar) once the scoring engine lives on
   the server, per the FRD's architecture (Scoring Engine as its own layer).

## Notes

- No client-side storage (localStorage/sessionStorage) is used anywhere,
  including the assessment — answers live in `AssessmentContext` (React
  state) and are lost on refresh. That matches the FRD's session-management
  requirement that assessment state live server-side; it's not an oversight.
- The colour theme lives entirely in `src/index.css` as CSS custom
  properties under `:root` — change the `--accent-*` and `--bg-*` variables
  to retheme.

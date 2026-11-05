// Display names for the four UVAA Construct dimensions — labels only, no
// scoring data. Pulled out of data/constructScenarios.js (which also
// carries the full scenario text and the per-option `score` answer key, and
// is being retired from the frontend bundle entirely — see
// ConstructAssessment.jsx, which now fetches question content from the API
// instead of importing it) so admin screens that only need "what do we call
// UPEKSHA" aren't tied to a file that shouldn't ship to the browser at all.
export const DIMENSION_LABELS = {
  UPEKSHA: { name: 'Emotional Balance', sanskrit: 'Upeksha' },
  ANUVIGNA: { name: 'Pressure Non-Reactivity', sanskrit: 'Anuvigna' },
  ANASAKTI: { name: 'Detached Decision-Making', sanskrit: 'Anasakti' },
  VIVEKA: { name: 'Clarity in Complexity', sanskrit: 'Viveka' },
}

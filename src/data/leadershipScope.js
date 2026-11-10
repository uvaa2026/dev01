// Registration's "what do you lead?" question — replaced the old 4-option
// "career stage" dropdown (Early career / Mid career / Senior professional /
// Leadership) as of migration 024. Unlike the old dropdown, this is NOT
// vertical-dependent — the same 3 options are shown regardless of industry.
//
// The selected `value` is also what drives which of the three Construct/ECM
// 32-scenario content sets a respondent is served (see
// constructScenarioVariants.js) — keep these `value`s identical to the
// backend's leadershipScope enum (uvaa-api/src/lib/validation.js) and to
// respondents.leadership_scope's CHECK constraint (migration 024) if this
// ever changes.
export const LEADERSHIP_SCOPE_QUESTION = 'What do you lead?'
export const LEADERSHIP_SCOPE_HINT = 'Pick what matches your current scope, not your title or years.'

export const LEADERSHIP_SCOPE_OPTIONS = [
  {
    value: 'TEAM',
    lead: 'Leading a team',
    description: 'You lead a team or a project. The pressure is delivering through others, and managing peers and seniors you do not control.',
  },
  {
    value: 'FUNCTION',
    lead: 'Leading a function',
    description: 'You lead several teams or a function, with budget or headcount. The pressure is competing demands, and choices that affect people and stakeholders.',
  },
  {
    value: 'BUSINESS_UNIT',
    lead: 'Leading business unit(s)',
    description: 'You own the outcomes for one unit or several. The pressure is setting direction, and deciding where nobody else will catch it.',
  },
]

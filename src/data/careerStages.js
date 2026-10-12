// Career-stage dropdown content, keyed by industry vertical.
// Mirrors FRD requirements FR-02A / FR-02B: the registration UI itself
// never changes — only this configuration adapts per vertical, and Phase II
// verticals can be added here without touching the form component.
//
// The four stage descriptions (Early/Mid/Senior/Leadership) are shared
// verbatim across verticals per the product review deck — only the
// label/hint framing above them still varies by vertical.
const STANDARD_STAGE_OPTIONS = [
  { value: 'EC', label: 'Early career — building your foundation, with or without a small team' },
  { value: 'MC', label: 'Mid career — established in your field, a specialist or leading teams' },
  { value: 'SP', label: 'Senior professional — shaping direction for a function or leading several teams' },
  { value: 'LS', label: 'Leadership — accountable for a business unit or organisation' },
]

export const CAREER_STAGES = {
  IT_TECH: {
    label: 'Which best describes where you are in your career?',
    hint: 'Your pressure comes from task delivery, credibility, or the scope of decisions you own.',
    options: STANDARD_STAGE_OPTIONS,
  },
  EDUCATION: {
    label: 'Which best describes where you are in your career?',
    hint: 'Your pressure comes from research, teaching, supervision, or institutional accountability.',
    options: STANDARD_STAGE_OPTIONS,
  },
  OTHERS: {
    label: 'Which best describes where you are in your career?',
    hint: 'Your pressure comes from the decisions and accountability that come with your role.',
    options: STANDARD_STAGE_OPTIONS,
  },
}

export const EXPERIENCE_RANGES = [
  { value: 'lt1', label: 'Less than 1 year' },
  { value: '1-3', label: '1–3 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '5-8', label: '5–8 years' },
  { value: '8-12', label: '8–12 years' },
  { value: '12plus', label: '12+ years' },
]

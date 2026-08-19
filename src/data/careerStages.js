// Career-stage dropdown content, keyed by industry vertical.
// Mirrors FRD requirements FR-02A / FR-02B: the registration UI itself
// never changes — only this configuration adapts per vertical, and Phase II
// verticals can be added here without touching the form component.
export const CAREER_STAGES = {
  IT_TECH: {
    label: 'Which best describes where you are in your career?',
    hint: 'Your pressure comes from task delivery, credibility, or the scope of decisions you own.',
    options: [
      { value: 'EC', label: 'Early Career — individual contributor (0–5 years)' },
      { value: 'MC', label: 'Mid Career — 5–12 years, may or may not manage others' },
      { value: 'SP', label: 'Senior Professional — 12+ years, budget or team accountability' },
      { value: 'LS', label: 'Leadership — VP, Director, or equivalent' },
    ],
  },
  EDUCATION: {
    label: 'Which best describes your current academic role?',
    hint: 'Your pressure comes from research, teaching, supervision, or institutional accountability.',
    options: [
      { value: 'EC', label: 'Student or Research Scholar — UG, PG, or doctoral' },
      { value: 'MC', label: 'Faculty or Lecturer — early to mid academic career' },
      { value: 'SP', label: 'Head of Department or Programme Director' },
      { value: 'LS', label: 'Dean or Academic Leader' },
    ],
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

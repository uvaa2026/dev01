// Broad, India-wide organisation-type categories for the "Register your
// organisation" form. Kept as value/label pairs (same pattern as
// careerStages.js) so the submitted payload stays a stable code even
// though the field itself is a free-type searchable picklist — see
// OrgRegister.jsx's handleOrganisationTypeChange for how typed text
// resolves to one of these codes (or falls back to OTHERS).
//
// "Others" is listed first deliberately, as the safe default for any
// organisation that doesn't fit a broad category below.
export const ORGANISATION_TYPES = [
  { value: 'OTHERS', label: 'Others' },
  { value: 'IT_TECH', label: 'IT and Technology Services' },
  { value: 'EDUCATION', label: 'Education and Academic Institutions' },
  { value: 'BFSI', label: 'Banking, Financial Services and Insurance' },
  { value: 'HEALTHCARE', label: 'Healthcare and Pharmaceuticals' },
  { value: 'MANUFACTURING', label: 'Manufacturing and Engineering' },
  { value: 'GOVERNMENT', label: 'Government and Public Sector' },
  { value: 'NONPROFIT', label: 'Non-Profit and NGO' },
  { value: 'RETAIL_ECOMMERCE', label: 'Retail and E-commerce' },
  { value: 'CONSULTING', label: 'Consulting and Professional Services' },
  { value: 'MEDIA', label: 'Media, Entertainment and Communications' },
  { value: 'REAL_ESTATE', label: 'Real Estate and Construction' },
  { value: 'LOGISTICS', label: 'Logistics and Supply Chain' },
  { value: 'HOSPITALITY', label: 'Hospitality and Travel' },
  { value: 'ENERGY', label: 'Energy and Utilities' },
  { value: 'AGRICULTURE', label: 'Agriculture and Allied Industries' },
  { value: 'STARTUP', label: 'Startup' },
]

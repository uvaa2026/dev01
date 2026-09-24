// Thin fetch wrapper for the UVAA backend.
//
// Set VITE_API_BASE_URL in a local .env file (see .env.example) to point
// this app at a running uvaa-api instance — the register/login/verify
// pages below hit it automatically, no other code changes required.
// `credentials: 'include'` is required on every call so the httpOnly
// session cookie the API sets on login is sent back on subsequent
// requests (e.g. GET /auth/me) — without it the browser silently drops
// the cookie on cross-origin requests (localhost:5173 -> localhost:4000
// counts as cross-origin).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new ApiError(
      'No backend is configured yet. Set VITE_API_BASE_URL in your .env file to connect this app to the UVAA API.',
      0,
    )
  }

  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      credentials: 'include',
      ...options,
    })
  } catch {
    throw new ApiError('Could not reach the UVAA API. Check your connection or backend URL.', 0)
  }

  let body = null
  try {
    body = await res.json()
  } catch {
    // response had no JSON body — fine for empty 204s etc.
  }

  if (!res.ok) {
    throw new ApiError(body?.message || `Request failed with status ${res.status}`, res.status)
  }

  return body
}

export const api = {
  // POST /auth/register { cohortCode, fullName, email, password, vertical,
  //                        careerStage, experience, department, consent }
  // Code-first: every participant registration needs a cohort code from
  // their organisation now — see the two-step flow in OrgRegister.jsx /
  // Register.jsx (lookupCohortCode first, then this).
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  // POST /auth/login { email, password, rememberMe } -> sets session cookie
  login: (payload) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

  // POST /auth/verify { token } — from the link in the verification email
  verifyEmail: (token) =>
    request('/auth/verify', { method: 'POST', body: JSON.stringify({ token }) }),

  // GET /auth/me — the signed-in respondent's profile, via session cookie
  me: () => request('/auth/me', { method: 'GET' }),

  // POST /auth/logout — clears the session cookie
  logout: () => request('/auth/logout', { method: 'POST' }),

  // GET /assessment/briefing — { acknowledged, acknowledgedAt }. Gates entry
  // to the Guna profiler (BeforeYouBegin.jsx).
  getBriefingStatus: () => request('/assessment/briefing', { method: 'GET' }),

  // POST /assessment/briefing — records the "I understand, begin" click.
  acknowledgeBriefing: () => request('/assessment/briefing', { method: 'POST' }),

  // GET /assessment/guna — { submitted, answers, submittedAt, draft, expired }.
  // `draft` (when present) is { answers, currentIndex, startedAt } for a
  // resumable in-progress attempt; `expired` is true for exactly one
  // response right after a >72h draft was discarded server-side, so the UI
  // can say "that session expired, starting over" once.
  getGunaAssessment: () => request('/assessment/guna', { method: 'GET' }),

  // PATCH /assessment/guna/draft { answers, currentIndex } — saves
  // in-progress answers (any subset, in any order). Called after every
  // answer and from the explicit "Save draft" button.
  saveGunaDraft: (answers, currentIndex) =>
    request('/assessment/guna/draft', { method: 'PATCH', body: JSON.stringify({ answers, currentIndex }) }),

  // POST /assessment/guna { answers: [{ vignetteId, optionKey }, ...15] } —
  // all 15 required. Upserts, so resubmitting replaces the previous answers.
  submitGunaAssessment: (answers) =>
    request('/assessment/guna', { method: 'POST', body: JSON.stringify({ answers }) }),

  // GET /assessment/construct — same shape as getGunaAssessment, plus a
  // `locked` flag when the Guna profiler hasn't been submitted yet.
  getConstructAssessment: () => request('/assessment/construct', { method: 'GET' }),

  // PATCH /assessment/construct/draft — mirrors saveGunaDraft.
  saveConstructDraft: (answers, currentIndex) =>
    request('/assessment/construct/draft', { method: 'PATCH', body: JSON.stringify({ answers, currentIndex }) }),

  // POST /assessment/construct { answers: [{ scenarioId, optionKey }, ...32] }.
  submitConstructAssessment: (answers) =>
    request('/assessment/construct', { method: 'POST', body: JSON.stringify({ answers }) }),

  // GET /assessment/report — { ready: false } until both stages are scored,
  // otherwise the full read-only participant report (DQI, four dimension
  // scores, UVAA Pattern — never guna counts/percentages, those stay
  // facilitator-only).
  getReport: () => request('/assessment/report', { method: 'GET' }),

  // Admin-only endpoints (require is_admin on the signed-in account —
  // AdminRoute gates access on the frontend, the API enforces it again on
  // every request). Never called for a regular respondent.
  adminListUsers: () => request('/admin/users', { method: 'GET' }),
  adminGetUser: (id) => request(`/admin/users/${id}`, { method: 'GET' }),
  adminGetUserGuna: (id) => request(`/admin/users/${id}/guna`, { method: 'GET' }),
  adminGetUserConstruct: (id) => request(`/admin/users/${id}/construct`, { method: 'GET' }),
  adminGetUserReport: (id) => request(`/admin/users/${id}/report`, { method: 'GET' }),

  // --- Organisation registration (OrgRegister.jsx) ---------------------

  // POST /org/register { organisationName, organisationType, emailDomain,
  //   seatCount, approvalMode, provisioningModel, orgAdmin, facilitator }
  orgRegister: (payload) =>
    request('/org/register', { method: 'POST', body: JSON.stringify(payload) }),

  // POST /org/verify { token } — from the "type=org" verification link.
  // Returns { organisationName, cohortCode } on success, so the Org Admin
  // sees their cohort code immediately without a separate lookup.
  orgVerifyEmail: (token) =>
    request('/org/verify', { method: 'POST', body: JSON.stringify({ token }) }),

  // GET /org/lookup?code=... (public) — step 1 of participant registration.
  lookupCohortCode: (code) =>
    request(`/org/lookup?code=${encodeURIComponent(code)}`, { method: 'GET' }),

  // POST /org/login { email, password, rememberMe } — a separate login for
  // the Org Admin, independent of the respondent/participant session. Used
  // by an Org Admin who declined to take the assessment themselves and so
  // has no respondent account at all.
  orgLogin: (payload) =>
    request('/org/login', { method: 'POST', body: JSON.stringify(payload) }),

  // GET /org/me — resolves only for a direct Org Admin session (see
  // orgLogin above). 404s for a participant/respondent session or when
  // signed out; OrgAuthContext treats either as "not an org-admin session".
  orgMe: () => request('/org/me', { method: 'GET' }),

  // --- Org Admin dashboard (org-admin/*) --------------------------------
  // Every call below works for EITHER an Org Admin session (orgLogin) or a
  // respondent session belonging to an opted-in Org Admin (auth login) —
  // the backend's requireOrgAdmin middleware resolves the org either way,
  // so the frontend never needs to know which kind of session is active.
  orgAdmin: {
    overview: () => request('/org-admin/overview', { method: 'GET' }),
    participants: () => request('/org-admin/participants', { method: 'GET' }),
    participant: (id) => request(`/org-admin/participants/${id}`, { method: 'GET' }),
    approve: (id, decision) =>
      request(`/org-admin/participants/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
    listRoster: () => request('/org-admin/roster', { method: 'GET' }),
    addRosterEntry: (payload) =>
      request('/org-admin/roster', { method: 'POST', body: JSON.stringify(payload) }),
    uploadRosterCsv: (csv) =>
      request('/org-admin/roster/bulk', { method: 'POST', body: JSON.stringify({ csv }) }),
  },
}

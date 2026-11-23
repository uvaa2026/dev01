// Thin fetch wrapper for the UVAA backend.
//
// Set VITE_API_BASE_URL in a local .env file (see .env.example) to point
// this app at a running uvaa-api instance — the register/login/verify
// pages below hit it automatically, no other code changes required.
//
// Auth travels as an `Authorization: Bearer <token>` header, not a cookie.
// The frontend and API live on different domains (this app on uvaa.pro,
// the API on azurewebsites.net), and Safari (ITP), Firefox strict mode,
// Brave, and an increasing share of Chrome block third-party cookies
// outright — that silently broke login for anyone on those browsers no
// matter how the cookie was configured (SameSite=None doesn't help; it
// only satisfies the minimum for a cross-site cookie to be sendable at
// all, it doesn't stop a browser from blocking third-party cookies on
// principle). Storing the token ourselves and sending it as a header
// sidesteps that entirely, in every browser, present or future.
// `credentials: 'include'` is kept so the API's fallback cookie (see
// uvaa-api/src/routes/auth.js) still works for anyone it happens to reach.
const TOKEN_STORAGE_KEY = 'uvaa_token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    // Storage disabled/unavailable (private mode, some lockdown policy) —
    // the user just won't stay signed in across a refresh; same failure
    // mode the old cookie approach had in a browser blocking all cookies.
    return null
  }
}

function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch {
    // ignore — see getStoredToken
  }
}

function clearStoredToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch {
    // ignore
  }
}

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

  const token = getStoredToken()
  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
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

  // POST /auth/login { email, password, rememberMe } -> { token, respondent }
  // Stores the token so later requests can send it as an Authorization
  // header — see the comment at the top of this file.
  login: async (payload) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
    if (data?.token) setStoredToken(data.token)
    return data
  },

  // POST /auth/verify { token } — from the link in the verification email
  verifyEmail: (token) =>
    request('/auth/verify', { method: 'POST', body: JSON.stringify({ token }) }),

  // POST /auth/forgot-password { email } — always resolves with a generic
  // success message, whether or not the email matches an account.
  requestPasswordReset: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // POST /auth/reset-password { token, password } — from the link in the
  // password reset email.
  resetPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),

  // GET /auth/me — the signed-in respondent's profile, via session cookie
  me: () => request('/auth/me', { method: 'GET' }),

  // POST /auth/logout — clears the fallback cookie server-side; always
  // clears the locally stored token too, even if the request itself fails.
  logout: async () => {
    try {
      return await request('/auth/logout', { method: 'POST' })
    } finally {
      clearStoredToken()
    }
  },

  // GET /assessment/briefing — { acknowledged, acknowledgedAt }. Gates entry
  // to the Guna profiler (BeforeYouBegin.jsx).
  getBriefingStatus: () => request('/assessment/briefing', { method: 'GET' }),

  // POST /assessment/briefing — records the "I understand, begin" click.
  acknowledgeBriefing: () => request('/assessment/briefing', { method: 'POST' }),

  // GET /assessment/guna/content — the 15 vignettes' question text only
  // (id, title, prompt, option key+text). No `guna`/`score` — that's the
  // scoring key and it never leaves the API; see uvaa-api's
  // lib/scoring.js#getGunaContent for why this replaced a static frontend
  // data file.
  getGunaContent: () => request('/assessment/guna/content', { method: 'GET' }),

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

  // GET /assessment/construct/content — this respondent's 32 scenarios'
  // question text only (id, situation, option key+text). The backend
  // resolves which of the three content variants from the respondent's own
  // leadership_scope, so the frontend never needs to know or send it. No
  // `dimension`/`score` — see getConstructContent in uvaa-api's
  // lib/scoring.js. 403s the same way the submit/draft endpoints do if
  // Guna hasn't been submitted yet.
  getConstructContent: () => request('/assessment/construct/content', { method: 'GET' }),

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

  // Super Admin console — approve/reject or disable/enable ANY respondent
  // regardless of organisation, and manage organisations (list, detail,
  // seat count). Same is_admin + email-allowlist gate as everything else
  // in this section.
  adminSetApproval: (id, decision) =>
    request(`/admin/users/${id}/approval`, { method: 'PATCH', body: JSON.stringify({ decision }) }),
  adminSetAccountStatus: (id, disabled, reason) =>
    request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ disabled, reason }) }),
  adminListOrganisations: () => request('/admin/organisations', { method: 'GET' }),
  adminGetOrganisation: (id) => request(`/admin/organisations/${id}`, { method: 'GET' }),
  adminSetOrgSeats: (id, seatCount) =>
    request(`/admin/organisations/${id}/seats`, { method: 'PATCH', body: JSON.stringify({ seatCount }) }),

  // GET /admin/organisations/:id/cohort-report — the aggregate, anonymous
  // group-level report (facilitator/Super Admin side — keeps patternGrid
  // when the cohort is large enough; see lib/cohortReport.js on the API).
  adminGetCohortReport: (id) => request(`/admin/organisations/${id}/cohort-report`, { method: 'GET' }),

  // GET /admin/export — streams an .xlsx workbook (every respondent's
  // profile, final scores, and raw Guna/Construct answers). Not run through
  // the JSON `request()` helper above since the response is a binary file;
  // this reads it as a blob and triggers a normal browser download.
  adminExportUsers: async () => {
    if (!API_BASE_URL) {
      throw new ApiError(
        'No backend is configured yet. Set VITE_API_BASE_URL in your .env file to connect this app to the UVAA API.',
        0,
      )
    }

    const token = getStoredToken()
    let res
    try {
      res = await fetch(`${API_BASE_URL}/admin/export`, {
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch {
      throw new ApiError('Could not reach the UVAA API. Check your connection or backend URL.', 0)
    }

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`
      try {
        const body = await res.json()
        if (body?.message) message = body.message
      } catch {
        // error response wasn't JSON — keep the generic message above
      }
      throw new ApiError(message, res.status)
    }

    const blob = await res.blob()
    const disposition = res.headers.get('Content-Disposition') || ''
    const match = disposition.match(/filename="([^"]+)"/)
    const filename = match ? match[1] : 'uvaa-respondent-export.xlsx'

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  },

  // POST /contact { fullName, workEmail, organisation, role, interest,
  //   message } — public, unauthenticated. Home's "Let's start a
  // conversation" form (Welcome.jsx #contact).
  submitContactForm: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),

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

  // POST /org/forgot-password { email } — mirrors requestPasswordReset
  // above, for an Org Admin account. Always resolves with a generic
  // success message, whether or not the email matches an account (see
  // uvaa-api's routes/organisations.js for why). The reset link it emails
  // lands on the same /reset-password page and calls the same
  // resetPassword below — token redemption is shared across both account
  // kinds (migration 027).
  requestOrgPasswordReset: (email) =>
    request('/org/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // POST /org/login { email, password, rememberMe } — a separate login for
  // the Org Admin, independent of the respondent/participant session. Used
  // by an Org Admin who declined to take the assessment themselves and so
  // has no respondent account at all. Stores the token the same way
  // api.login above does — it's the same shared token slot, since only one
  // of these two login kinds is ever active at a time.
  orgLogin: async (payload) => {
    const data = await request('/org/login', { method: 'POST', body: JSON.stringify(payload) })
    if (data?.token) setStoredToken(data.token)
    return data
  },

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
    // GET /org-admin/cohort-report — the aggregate, anonymous group-level
    // report for the buyer's own organisation (never includes patternGrid —
    // see lib/cohortReport.js on the API, and admin.adminGetCohortReport
    // above for the facilitator-side equivalent that does).
    cohortReport: () => request('/org-admin/cohort-report', { method: 'GET' }),
  },
}

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
  // POST /auth/register { fullName, email, password, organisation, vertical,
  //                        careerStage, experience, department, consent }
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

  // GET /assessment/guna — { submitted, answers, submittedAt }. Used both to
  // show a "completed" state and to resume/edit a previous submission.
  getGunaAssessment: () => request('/assessment/guna', { method: 'GET' }),

  // POST /assessment/guna { answers: [{ vignetteId, optionKey }, ...15] } —
  // all 15 required. Upserts, so resubmitting replaces the previous answers.
  submitGunaAssessment: (answers) =>
    request('/assessment/guna', { method: 'POST', body: JSON.stringify({ answers }) }),
}

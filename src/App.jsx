import { Routes, Route, Navigate } from 'react-router-dom'
import GrainOverlay from './components/GrainOverlay.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import OrgGuestRoute from './components/OrgGuestRoute.jsx'
import OrgAdminRoute from './components/OrgAdminRoute.jsx'
import { AssessmentProvider } from './context/AssessmentContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrgAuthProvider } from './context/OrgAuthContext.jsx'
import Welcome from './pages/Welcome.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import OrgForgotPassword from './pages/OrgForgotPassword.jsx'
import MyPage from './pages/MyPage.jsx'
import Report from './pages/Report.jsx'
import BeforeYouBegin from './pages/assessment/BeforeYouBegin.jsx'
import GunaProfiler from './pages/assessment/GunaProfiler.jsx'
import ConstructAssessment from './pages/assessment/ConstructAssessment.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminUserDetail from './pages/admin/AdminUserDetail.jsx'
import AdminOrganisations from './pages/admin/AdminOrganisations.jsx'
import AdminOrganisationDetail from './pages/admin/AdminOrganisationDetail.jsx'
import OrgRegister from './pages/OrgRegister.jsx'
import OrgLogin from './pages/OrgLogin.jsx'
import OrgAdminDashboard from './pages/org-admin/OrgAdminDashboard.jsx'
import TermsOfUse from './pages/TermsOfUse.jsx'
import Guide from './pages/Guide.jsx'

export default function App() {
  return (
    <AuthProvider>
      <OrgAuthProvider>
      <AssessmentProvider>
        <GrainOverlay />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Welcome />} />
            {/* The whole marketing site is one page now (Welcome.jsx) —
                every old standalone route redirects bookmarks and external
                links to the matching anchor section there instead of
                404-ing. The retired page components themselves
                (WhyUvaa/Framework/TheAssessment/WhatYouGet/
                ForOrganisations/PrivacyData/WhatUvaaDoesNotClaim/TalkToUs)
                are left on disk — delete them whenever convenient, this
                session can't delete files on your machine.
                Targets updated for the corporate-refresh 7-section Home —
                #about-uvaa/#assessment/#framework-story/#who-for/
                #what-you-receive no longer exist; the content that used
                to live at each now lives in #what-uvaa-measures or
                #what-you-get instead (see the anchor map comment atop
                Welcome.jsx). */}
            <Route path="/why-uvaa" element={<Navigate to="/#what-uvaa-measures" replace />} />
            <Route path="/framework" element={<Navigate to="/#what-uvaa-measures" replace />} />
            <Route path="/the-assessment" element={<Navigate to="/#what-uvaa-measures" replace />} />
            <Route path="/what-you-get" element={<Navigate to="/#what-you-get" replace />} />
            <Route path="/for-organisations" element={<Navigate to="/#what-you-get" replace />} />
            <Route path="/privacy-data" element={<Navigate to="/#privacy" replace />} />
            <Route path="/what-uvaa-does-not-claim" element={<Navigate to="/#faq" replace />} />
            <Route path="/talk-to-us" element={<Navigate to="/#contact" replace />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/guide" element={<Guide />} />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/my-page"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/begin"
              element={
                <ProtectedRoute>
                  <BeforeYouBegin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/guna"
              element={
                <ProtectedRoute>
                  <GunaProfiler />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assessment/construct"
              element={
                <ProtectedRoute>
                  <ConstructAssessment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <AdminUserDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/organisations"
              element={
                <AdminRoute>
                  <AdminOrganisations />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/organisations/:id"
              element={
                <AdminRoute>
                  <AdminOrganisationDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/org-register"
              element={
                <OrgGuestRoute>
                  <OrgRegister />
                </OrgGuestRoute>
              }
            />
            <Route
              path="/org-login"
              element={
                <OrgGuestRoute>
                  <OrgLogin />
                </OrgGuestRoute>
              }
            />
            <Route path="/org-forgot-password" element={<OrgForgotPassword />} />
            <Route
              path="/org-admin"
              element={
                <OrgAdminRoute>
                  <OrgAdminDashboard />
                </OrgAdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AssessmentProvider>
      </OrgAuthProvider>
    </AuthProvider>
  )
}

import { Routes, Route } from 'react-router-dom'
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
import MyPage from './pages/MyPage.jsx'
import Report from './pages/Report.jsx'
import BeforeYouBegin from './pages/assessment/BeforeYouBegin.jsx'
import GunaProfiler from './pages/assessment/GunaProfiler.jsx'
import ConstructAssessment from './pages/assessment/ConstructAssessment.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminUserDetail from './pages/admin/AdminUserDetail.jsx'
import OrgRegister from './pages/OrgRegister.jsx'
import OrgLogin from './pages/OrgLogin.jsx'
import OrgAdminDashboard from './pages/org-admin/OrgAdminDashboard.jsx'
import WhyUvaa from './pages/WhyUvaa.jsx'
import Framework from './pages/Framework.jsx'
import TheAssessment from './pages/TheAssessment.jsx'
import WhatYouGet from './pages/WhatYouGet.jsx'
import ForOrganisations from './pages/ForOrganisations.jsx'
import PrivacyData from './pages/PrivacyData.jsx'
import WhatUvaaDoesNotClaim from './pages/WhatUvaaDoesNotClaim.jsx'
import TalkToUs from './pages/TalkToUs.jsx'

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
            <Route path="/why-uvaa" element={<WhyUvaa />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/the-assessment" element={<TheAssessment />} />
            <Route path="/what-you-get" element={<WhatYouGet />} />
            <Route path="/for-organisations" element={<ForOrganisations />} />
            <Route path="/privacy-data" element={<PrivacyData />} />
            <Route path="/what-uvaa-does-not-claim" element={<WhatUvaaDoesNotClaim />} />
            <Route path="/talk-to-us" element={<TalkToUs />} />
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

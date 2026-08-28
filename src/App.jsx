import { Routes, Route } from 'react-router-dom'
import GrainOverlay from './components/GrainOverlay.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import { AssessmentProvider } from './context/AssessmentContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Welcome from './pages/Welcome.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import MyPage from './pages/MyPage.jsx'
import GunaProfiler from './pages/assessment/GunaProfiler.jsx'
import ConstructAssessment from './pages/assessment/ConstructAssessment.jsx'
import Processing from './pages/assessment/Processing.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminUserDetail from './pages/admin/AdminUserDetail.jsx'

export default function App() {
  return (
    <AuthProvider>
      <AssessmentProvider>
        <GrainOverlay />
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
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
              path="/assessment/processing"
              element={
                <ProtectedRoute>
                  <Processing />
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
          </Routes>
        </main>
        <Footer />
      </AssessmentProvider>
    </AuthProvider>
  )
}

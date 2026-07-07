import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import { LoadingScreen } from './components/ui/Skeleton';
import { MedicalChatbot } from './components/ai/MedicalChatbot';
import { DashboardLayout } from './components/layout/DashboardLayout';
import './index.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.SignupPage })));
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage').then(m => ({ default: m.AdminDashboard })));
const DoctorDashboard = lazy(() => import('./pages/doctor/DashboardPage').then(m => ({ default: m.DoctorDashboard })));
const PatientDashboard = lazy(() => import('./pages/patient/DashboardPage').then(m => ({ default: m.PatientDashboard })));
const SymptomCheckerPage = lazy(() => import('./pages/patient/SymptomCheckerPage').then(m => ({ default: m.SymptomCheckerPage })));

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { profile, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={`/${profile.role}`} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen bg-dark-50 dark:bg-dark-950 transition-colors duration-300">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminDashboard />} />
                    <Route path="doctors" element={<AdminDashboard />} />
                    <Route path="patients" element={<AdminDashboard />} />
                    <Route path="appointments" element={<AdminDashboard />} />
                    <Route path="reports" element={<AdminDashboard />} />
                    <Route path="settings" element={<AdminDashboard />} />
                  </Route>

                  {/* Doctor Routes */}
                  <Route
                    path="/doctor"
                    element={
                      <ProtectedRoute allowedRoles={['doctor']}>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DoctorDashboard />} />
                    <Route path="appointments" element={<DoctorDashboard />} />
                    <Route path="patients" element={<DoctorDashboard />} />
                    <Route path="consultations" element={<DoctorDashboard />} />
                    <Route path="prescriptions" element={<DoctorDashboard />} />
                    <Route path="ai-assist" element={<DoctorDashboard />} />
                    <Route path="schedule" element={<DoctorDashboard />} />
                  </Route>

                  {/* Patient Routes */}
                  <Route
                    path="/patient"
                    element={
                      <ProtectedRoute allowedRoles={['patient']}>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<PatientDashboard />} />
                    <Route path="appointments" element={<PatientDashboard />} />
                    <Route path="symptom-checker" element={<SymptomCheckerPage />} />
                    <Route path="health-records" element={<PatientDashboard />} />
                    <Route path="prescriptions" element={<PatientDashboard />} />
                    <Route path="reports" element={<PatientDashboard />} />
                    <Route path="consultations" element={<PatientDashboard />} />
                    <Route path="chat" element={<PatientDashboard />} />
                    <Route path="emergency" element={<PatientDashboard />} />
                  </Route>

                  {/* Receptionist Routes */}
                  <Route
                    path="/receptionist"
                    element={
                      <ProtectedRoute allowedRoles={['receptionist']}>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="appointments" element={<AdminDashboard />} />
                    <Route path="patients" element={<AdminDashboard />} />
                    <Route path="doctors" element={<AdminDashboard />} />
                    <Route path="queue" element={<AdminDashboard />} />
                  </Route>

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>

              {/* Medical Chatbot - available on all pages */}
              <MedicalChatbot />

              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    borderRadius: '12px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#1e293b',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#1e293b',
                    },
                  },
                }}
              />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

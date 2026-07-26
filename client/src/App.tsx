import {lazy, Suspense} from 'react';

//Static imports

import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import StickyDonateBar from './components/StickyDonateBar';
import WhatsAppWidget from './components/WhatsAppWidget';
import LoadingSpinner from './components/LoadingSpinner';

//Lazy-loaded route pages

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const VolunteerPage = lazy(() => import('./pages/VolunteerPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LeadershipPage = lazy(() => import('./pages/LeadershipPage'));
const ProgrammeDetailPage = lazy(() => import('./pages/ProgrammeDetailPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const DashboardHome = lazy(() => import('./pages/admin/DashboardHome'));
const ProjectsPage = lazy(() => import('./pages/admin/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/admin/ProjectDetailPage'));
const BeneficiariesPage = lazy(() => import('./pages/admin/BeneficiariesPage'));
const ActivityLogsPage = lazy(() => import('./pages/admin/ActivityLogsPage'));
const SoupKitchenPage = lazy(() => import('./pages/admin/SoupKitchenPage'));
const AuditLogPage = lazy(() => import('./pages/admin/AuditLogPage'));


function App() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isAdminArea && <Navbar />}
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/leadership" element={<LeadershipPage />} />
                <Route path="/programs" element={<ProgramsPage />} />
                <Route path="/programs/:slug" element={<ProgrammeDetailPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<NewsDetailPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/volunteer" element={<VolunteerPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:id" element={<ProjectDetailPage />} />
                    <Route path="beneficiaries" element={<BeneficiariesPage />} />
                    <Route path="activity-logs" element={<ActivityLogsPage />} />
                    <Route path="soup-kitchen" element={<SoupKitchenPage />} />
                    <Route element={<ProtectedRoute roles={['admin']} redirectTo="/admin" />}>
                      <Route path="audit-log" element={<AuditLogPage />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
              </Suspense>
            </Box>

            {!isAdminArea && <Footer />}
            {!isAdminArea && <StickyDonateBar />}
            {!isAdminArea && <WhatsAppWidget />}
          </Box>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

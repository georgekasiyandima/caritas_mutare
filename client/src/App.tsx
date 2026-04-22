import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import DonatePage from './pages/DonatePage';
import VolunteerPage from './pages/VolunteerPage';
import ContactPage from './pages/ContactPage';
import LeadershipPage from './pages/LeadershipPage';
import ProgrammeDetailPage from './pages/ProgrammeDetailPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import DashboardHome from './pages/admin/DashboardHome';
import ProjectsPage from './pages/admin/ProjectsPage';
import ProjectDetailPage from './pages/admin/ProjectDetailPage';
import BeneficiariesPage from './pages/admin/BeneficiariesPage';
import ActivityLogsPage from './pages/admin/ActivityLogsPage';
import SoupKitchenPage from './pages/admin/SoupKitchenPage';
import AuditLogPage from './pages/admin/AuditLogPage';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import StickyDonateBar from './components/StickyDonateBar';
import BackToHomeLink from './components/BackToHomeLink';

function App() {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!isAdminArea && <Navbar />}
            {!isAdminArea && <BackToHomeLink />}
            <Box component="main" sx={{ flexGrow: 1 }}>
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
            </Box>

            {!isAdminArea && <Footer />}
            {!isAdminArea && <StickyDonateBar />}
          </Box>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

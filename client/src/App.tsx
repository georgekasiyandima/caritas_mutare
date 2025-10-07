import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ProgramsPage from './pages/ProgramsPage.tsx';
import NewsPage from './pages/NewsPage.tsx';
import NewsDetailPage from './pages/NewsDetailPage.tsx';
import DonatePage from './pages/DonatePage.tsx';
import VolunteerPage from './pages/VolunteerPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import LeadershipPage from './pages/LeadershipPage.tsx';
import SoupKitchenPage from './pages/programs/SoupKitchenPage.tsx';
import EducationPage from './pages/programs/EducationPage.tsx';
import HealthcarePage from './pages/programs/HealthcarePage.tsx';
import AgriculturePage from './pages/programs/AgriculturePage.tsx';
import AdminLoginPage from './pages/admin/AdminLoginPage.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/programs/soup-kitchen" element={<SoupKitchenPage />} />
              <Route path="/programs/education" element={<EducationPage />} />
              <Route path="/programs/healthcare" element={<HealthcarePage />} />
              <Route path="/programs/agriculture" element={<AgriculturePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;


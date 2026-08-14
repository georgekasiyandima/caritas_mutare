import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyDonateBar from '../StickyDonateBar';
import WhatsAppWidget from '../WhatsAppWidget';

export default function PublicLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <StickyDonateBar />
      <WhatsAppWidget />
    </Box>
  );
}
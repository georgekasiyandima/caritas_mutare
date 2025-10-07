import React, { useState } from 'react';
import {
  Fab,
  Zoom,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Chip,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '+263774671893', // Default Caritas phone number
  welcomeMessage = 'Hello! How can we help you today?',
  position = 'bottom-right'
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message || welcomeMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    handleClose();
    setMessage('');
  };

  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
    handleClose();
  };

  const positionStyles = {
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <Fab
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 1000,
          backgroundColor: '#25D366',
          color: 'white',
          width: 60,
          height: 60,
          boxShadow: 4,
          '&:hover': {
            backgroundColor: '#128C7E',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)',
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)',
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)',
            },
          },
        }}
        aria-label="WhatsApp contact"
      >
        <WhatsAppIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* WhatsApp Contact Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#25D366',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon sx={{ mr: 2, fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Contact Caritas Mutare
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                We're here to help!
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                backgroundColor: 'primary.main',
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Get in Touch with Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {welcomeMessage}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              icon={<PhoneIcon />}
              label={phoneNumber}
              variant="outlined"
              color="primary"
              sx={{ flexGrow: 1 }}
            />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
            Available Monday - Friday, 8:00 AM - 5:00 PM
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleCall}
            variant="outlined"
            startIcon={<PhoneIcon />}
            sx={{
              flexGrow: 1,
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
            }}
          >
            Call Now
          </Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              flexGrow: 1,
              backgroundColor: '#25D366',
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
              '&:hover': {
                backgroundColor: '#128C7E',
              },
            }}
          >
            Send WhatsApp
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WhatsAppWidget;

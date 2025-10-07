import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </Typography>
          {this.state.error && (
            <Box sx={{ mb: 4, p: 2, backgroundColor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body2" color="error">
                {this.state.error.message}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

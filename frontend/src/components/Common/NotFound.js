import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <ErrorIcon sx={{ fontSize: 100, color: '#ed6c02', mb: 2 }} />
        <Typography variant="h1" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ px: 4 }}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ px: 4 }}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;

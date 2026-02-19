import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  EventNote as EventIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Student Management',
      description: 'Comprehensive student information system with enrollment, profiles, and academic tracking.'
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 50, color: '#2e7d32' }} />,
      title: 'Course Management',
      description: 'Manage courses, syllabus, enrollments, and course materials efficiently.'
    },
    {
      icon: <EventIcon sx={{ fontSize: 50, color: '#ed6c02' }} />,
      title: 'Attendance Tracking',
      description: 'Real-time attendance marking, monitoring, and automated reports with alerts.'
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 50, color: '#9c27b0' }} />,
      title: 'Grade Management',
      description: 'Exam creation, grade entry, GPA calculation, and result publishing system.'
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 50, color: '#d32f2f' }} />,
      title: 'Assignment System',
      description: 'Create assignments, track submissions, and provide feedback with grading.'
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 50, color: '#0288d1' }} />,
      title: 'Fee Management',
      description: 'Fee structure setup, payment tracking, receipt generation, and reports.'
    }
  ];

  const roles = [
    {
      title: 'Admin',
      description: 'Complete system control with user management, reports, and configurations.',
      color: '#1976d2'
    },
    {
      title: 'Teacher',
      description: 'Manage courses, mark attendance, create exams, and grade assignments.',
      color: '#2e7d32'
    },
    {
      title: 'Student',
      description: 'View courses, check attendance, see grades, submit assignments, and pay fees.',
      color: '#ed6c02'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 10
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                College ERP System
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Complete Education Management Solution for Modern Institutions
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                Streamline your college operations with our comprehensive ERP system featuring
                student management, attendance tracking, grade management, and much more.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' },
                    px: 4,
                    py: 1.5
                  }}
                >
                  Register
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <SchoolIcon sx={{ fontSize: 250, opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
          Powerful Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, mb: 6 }}>
            Role-Based Access
          </Typography>
          <Grid container spacing={4}>
            {roles.map((role, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderTop: `4px solid ${role.color}`,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: role.color }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {role.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1976d2' }}>
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Students
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              50+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Teachers
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#ed6c02' }}>
              100+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Courses
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#9c27b0' }}>
              24/7
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Access
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#667eea', color: 'white', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            Join thousands of institutions using our College ERP System
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              '&:hover': { bgcolor: '#f5f5f5' },
              px: 5,
              py: 1.5
            }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#333', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h6">College ERP</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                A comprehensive education management system for modern institutions.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © {new Date().getFullYear()} College ERP System
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                All rights reserved
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

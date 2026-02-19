import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  EventNote as EventIcon,
  Grade as GradeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../slices/studentSlice';
import { fetchCourses } from '../../slices/courseSlice';
import { fetchExams } from '../../slices/examSlice';
import { fetchAssignments } from '../../slices/assignmentSlice';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.students);
  const { courses } = useSelector((state) => state.courses);
  const { exams } = useSelector((state) => state.exams);
  const { assignments } = useSelector((state) => state.assignments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStudents({ limit: 100 }));
    dispatch(fetchCourses({ limit: 100 }));
    dispatch(fetchExams({ limit: 100 }));
    dispatch(fetchAssignments({ limit: 100 }));
  }, [dispatch]);

  const stats = [
    { title: 'Total Students', value: students.length, icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
    { title: 'Total Courses', value: courses.length, icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
    { title: 'Active Exams', value: exams.length, icon: <EventIcon sx={{ fontSize: 40 }} />, color: '#ed6c02' },
    { title: 'Assignments', value: assignments.length, icon: <AssignmentIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' }
  ];

  const managementModules = [
    { title: 'Manage Students', route: '/students', icon: <PeopleIcon /> },
    { title: 'Manage Courses', route: '/courses', icon: <SchoolIcon /> },
    { title: 'Attendance', route: '/attendance', icon: <EventIcon /> },
    { title: 'Exams', route: '/exams', icon: <EventIcon /> },
    { title: 'Grades', route: '/grades', icon: <GradeIcon /> },
    { title: 'Assignments', route: '/assignments', icon: <AssignmentIcon /> },
    { title: 'Fee Management', route: '/fees', icon: <PaymentIcon /> }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Admin Dashboard
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Welcome back, {user?.name}!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: stat.color, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Management Modules */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Management Modules
        </Typography>
        <Grid container spacing={2}>
          {managementModules.map((module, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={module.icon}
                onClick={() => navigate(module.route)}
                sx={{
                  py: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {module.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;

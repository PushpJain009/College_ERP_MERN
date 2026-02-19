import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EventNote as EventIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../slices/courseSlice';
import { fetchAssignments } from '../../slices/assignmentSlice';
import { fetchExams } from '../../slices/examSlice';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.courses);
  const { assignments } = useSelector((state) => state.assignments);
  const { exams } = useSelector((state) => state.exams);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCourses({ teacher: user._id }));
      dispatch(fetchAssignments({ teacher: user._id }));
      dispatch(fetchExams({ teacher: user._id }));
    }
  }, [dispatch, user]);

  const stats = [
    { title: 'My Courses', value: courses.length, icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
    { title: 'Assignments', value: assignments.length, icon: <AssignmentIcon sx={{ fontSize: 40 }} />, color: '#ed6c02' },
    { title: 'Scheduled Exams', value: exams.length, icon: <EventIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
    { title: 'Total Students', value: '120', icon: <PeopleIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' }
  ];

  const quickActions = [
    { title: 'Mark Attendance', route: '/attendance', icon: <EventIcon /> },
    { title: 'Create Assignment', route: '/assignments', icon: <AssignmentIcon /> },
    { title: 'Create Exam', route: '/exams', icon: <EventIcon /> },
    { title: 'Enter Grades', route: '/grades', icon: <EventIcon /> },
    { title: 'View Students', route: '/students', icon: <PeopleIcon /> },
    { title: 'Manage Courses', route: '/courses', icon: <SchoolIcon /> }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Teacher Dashboard
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

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={action.icon}
                    onClick={() => navigate(action.route)}
                    sx={{
                      py: 1.5,
                      justifyContent: 'flex-start',
                      textTransform: 'none'
                    }}
                  >
                    {action.title}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* My Courses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              My Courses
            </Typography>
            <List>
              {courses.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No courses assigned"
                    secondary="Contact administration for course assignments"
                  />
                </ListItem>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <ListItem key={course._id}>
                    <ListItemText
                      primary={course.title}
                      secondary={`${course.courseCode} - ${course.students?.length || 0} students`}
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Assignments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Assignments
            </Typography>
            <List>
              {assignments.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No assignments created"
                    secondary="Create assignments to track student submissions"
                  />
                </ListItem>
              ) : (
                assignments.slice(0, 5).map((assignment) => (
                  <ListItem key={assignment._id}>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`${assignment.course?.title} - Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {assignment.submissions?.length || 0} submissions
                    </Typography>
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;

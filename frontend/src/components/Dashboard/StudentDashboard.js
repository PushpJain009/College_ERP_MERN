import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  EventNote as EventIcon,
  Grade as GradeIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../slices/courseSlice';
import { fetchAssignments } from '../../slices/assignmentSlice';
import { fetchGrades } from '../../slices/gradeSlice';
import { fetchAttendance } from '../../slices/attendanceSlice';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { courses } = useSelector((state) => state.courses);
  const { assignments } = useSelector((state) => state.assignments);
  const { grades } = useSelector((state) => state.grades);
  const { attendance } = useSelector((state) => state.attendance);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCourses({ student: user._id }));
      dispatch(fetchAssignments({ student: user._id }));
      dispatch(fetchGrades({ student: user._id }));
      dispatch(fetchAttendance({ student: user._id }));
    }
  }, [dispatch, user]);

  const stats = [
    { title: 'Enrolled Courses', value: courses.length, icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: '#1976d2' },
    { title: 'Pending Assignments', value: assignments.filter(a => !a.submitted).length, icon: <AssignmentIcon sx={{ fontSize: 40 }} />, color: '#ed6c02' },
    { title: 'Attendance %', value: '85%', icon: <EventIcon sx={{ fontSize: 40 }} />, color: '#2e7d32' },
    { title: 'GPA', value: '3.8', icon: <GradeIcon sx={{ fontSize: 40 }} />, color: '#9c27b0' }
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600 }}>
        Student Dashboard
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
                    primary="No courses enrolled"
                    secondary="Contact administration to enroll in courses"
                  />
                </ListItem>
              ) : (
                courses.slice(0, 5).map((course) => (
                  <ListItem key={course._id}>
                    <ListItemText
                      primary={course.title}
                      secondary={`${course.courseCode} - ${course.credits} credits`}
                    />
                    <Chip label="Active" color="success" size="small" />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Assignments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Upcoming Assignments
            </Typography>
            <List>
              {assignments.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No pending assignments"
                    secondary="You're all caught up!"
                  />
                </ListItem>
              ) : (
                assignments.slice(0, 5).map((assignment) => (
                  <ListItem key={assignment._id}>
                    <ListItemText
                      primary={assignment.title}
                      secondary={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                    />
                    <Chip
                      label={assignment.submitted ? 'Submitted' : 'Pending'}
                      color={assignment.submitted ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Grades */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Grades
            </Typography>
            <List>
              {grades.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="No grades available"
                    secondary="Grades will appear here once published"
                  />
                </ListItem>
              ) : (
                grades.slice(0, 5).map((grade) => (
                  <ListItem key={grade._id}>
                    <ListItemText
                      primary={grade.exam?.title}
                      secondary={`${grade.exam?.course?.title} - ${grade.percentage}%`}
                    />
                    <Chip label={grade.grade} color="primary" size="small" />
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

export default StudentDashboard;

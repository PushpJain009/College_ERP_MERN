import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, markAttendance, markBulkAttendance, getAttendanceReport } from '../../slices/attendanceSlice';
import { fetchCourses } from '../../slices/courseSlice';
import { fetchStudents } from '../../slices/studentSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { attendance, loading, error, report } = useSelector((state) => state.attendance);
  const { courses } = useSelector((state) => state.courses);
  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [view, setView] = useState('list'); // 'list', 'mark', 'report'
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [reportCourse, setReportCourse] = useState('');
  const [reportStudent, setReportStudent] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({}));
    if (view === 'list') {
      dispatch(fetchAttendance({ page: page + 1, limit: rowsPerPage }));
    }
  }, [dispatch, page, rowsPerPage, view]);

  useEffect(() => {
    if (selectedCourse && view === 'mark') {
      dispatch(fetchStudents({ course: selectedCourse }))
        .unwrap()
        .then((data) => {
          const initialAttendance = data.data.map((student) => ({
            studentId: student._id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            status: 'Present'
          }));
          setAttendanceList(initialAttendance);
        });
    }
  }, [selectedCourse, dispatch, view]);

  const handleMarkAttendance = (studentId, status) => {
    setAttendanceList(
      attendanceList.map((item) =>
        item.studentId === studentId ? { ...item, status } : item
      )
    );
  };

  const handleSubmitAttendance = async () => {
    if (!selectedCourse || !selectedDate) {
      return;
    }

    try {
      await dispatch(
        markBulkAttendance({
          courseId: selectedCourse,
          date: selectedDate,
          attendanceList
        })
      ).unwrap();

      setView('list');
      setSelectedCourse('');
      setAttendanceList([]);
      dispatch(fetchAttendance({ page: page + 1, limit: rowsPerPage }));
    } catch (err) {
      console.error('Failed to mark attendance:', err);
    }
  };

  const handleGenerateReport = () => {
    const params = {};
    if (reportCourse) params.course = reportCourse;
    if (reportStudent) params.student = reportStudent;

    dispatch(getAttendanceReport(params));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const canMarkAttendance = user?.role === 'teacher' || user?.role === 'admin';

  if (loading && attendance.length === 0 && view === 'list') {
    return <LoadingSpinner message="Loading attendance..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Attendance Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={view === 'list' ? 'contained' : 'outlined'}
            onClick={() => setView('list')}
          >
            View Attendance
          </Button>
          {canMarkAttendance && (
            <Button
              variant={view === 'mark' ? 'contained' : 'outlined'}
              onClick={() => setView('mark')}
            >
              Mark Attendance
            </Button>
          )}
          <Button
            variant={view === 'report' ? 'contained' : 'outlined'}
            onClick={() => setView('report')}
          >
            Reports
          </Button>
        </Box>
      </Box>

      <ErrorAlert error={error} onClose={() => {}} />

      {view === 'list' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell><strong>Roll Number</strong></TableCell>
                <TableCell><strong>Course</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Marked By</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((record) => (
                  <TableRow key={record._id} hover>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.student?.name}</TableCell>
                    <TableCell>{record.student?.rollNumber}</TableCell>
                    <TableCell>{record.course?.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={
                          record.status === 'Present' ? 'success' :
                          record.status === 'Late' ? 'warning' :
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.markedBy?.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={attendance.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {view === 'mark' && canMarkAttendance && (
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Select Course"
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.courseCode} - {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {selectedCourse && attendanceList.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Mark Attendance for {attendanceList.length} Students
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Roll Number</strong></TableCell>
                      <TableCell><strong>Student Name</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceList.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.rollNumber}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>
                          <RadioGroup
                            row
                            value={student.status}
                            onChange={(e) => handleMarkAttendance(student.studentId, e.target.value)}
                          >
                            <FormControlLabel
                              value="Present"
                              control={<Radio />}
                              label="Present"
                            />
                            <FormControlLabel
                              value="Absent"
                              control={<Radio />}
                              label="Absent"
                            />
                            <FormControlLabel
                              value="Late"
                              control={<Radio />}
                              label="Late"
                            />
                            <FormControlLabel
                              value="Excused"
                              control={<Radio />}
                              label="Excused"
                            />
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedCourse('');
                    setAttendanceList([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitAttendance}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Attendance'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {view === 'report' && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Generate Attendance Report
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Course (Optional)</InputLabel>
                <Select
                  value={reportCourse}
                  onChange={(e) => setReportCourse(e.target.value)}
                  label="Filter by Course (Optional)"
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.courseCode} - {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Filter by Student (Optional)</InputLabel>
                <Select
                  value={reportStudent}
                  onChange={(e) => setReportStudent(e.target.value)}
                  label="Filter by Student (Optional)"
                >
                  <MenuItem value="">All Students</MenuItem>
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.rollNumber} - {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                disabled={loading}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>

          {report && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Attendance Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Classes
                      </Typography>
                      <Typography variant="h4">
                        {report.totalClasses || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#e8f5e9' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Present
                      </Typography>
                      <Typography variant="h4">
                        {report.present || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#ffebee' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Absent
                      </Typography>
                      <Typography variant="h4">
                        {report.absent || 0}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Card sx={{ backgroundColor: '#e3f2fd' }}>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Attendance %
                      </Typography>
                      <Typography variant="h4">
                        {report.percentage || 0}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AttendanceManagement;

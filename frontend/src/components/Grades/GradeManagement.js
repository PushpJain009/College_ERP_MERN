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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGrades, createGrade, calculateGPA } from '../../slices/gradeSlice';
import { fetchExams } from '../../slices/examSlice';
import { fetchStudents } from '../../slices/studentSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const GradeManagement = () => {
  const dispatch = useDispatch();
  const { grades, loading, error, gpaData } = useSelector((state) => state.grades);
  const { exams } = useSelector((state) => state.exams);
  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({
    student: '',
    exam: '',
    marksObtained: ''
  });
  const [formError, setFormError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    dispatch(fetchGrades({}));
    dispatch(fetchExams({}));
    dispatch(fetchStudents({}));
  }, [dispatch]);

  const handleOpenDialog = () => {
    setCurrentGrade({
      student: '',
      exam: '',
      marksObtained: ''
    });
    setFormError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormError('');
  };

  const handleInputChange = (e) => {
    setCurrentGrade({
      ...currentGrade,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!currentGrade.student || !currentGrade.exam || !currentGrade.marksObtained) {
      setFormError('Student, exam, and marks obtained are required');
      return false;
    }

    const exam = exams.find(e => e._id === currentGrade.exam);
    if (exam && parseInt(currentGrade.marksObtained) > exam.maxMarks) {
      setFormError(`Marks cannot exceed ${exam.maxMarks}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const gradeData = {
        ...currentGrade,
        marksObtained: parseInt(currentGrade.marksObtained)
      };

      await dispatch(createGrade(gradeData)).unwrap();
      handleCloseDialog();
      dispatch(fetchGrades({}));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleCalculateGPA = () => {
    if (selectedStudent) {
      dispatch(calculateGPA(selectedStudent));
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'default';
    if (['A+', 'A'].includes(grade)) return 'success';
    if (['B+', 'B'].includes(grade)) return 'primary';
    if (['C+', 'C'].includes(grade)) return 'warning';
    return 'error';
  };

  const canManageGrades = user?.role === 'admin' || user?.role === 'teacher';

  if (loading && grades.length === 0) {
    return <LoadingSpinner message="Loading grades..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Grade Management
        </Typography>
        {canManageGrades && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Grade
          </Button>
        )}
      </Box>

      <ErrorAlert error={error} onClose={() => {}} />

      {/* GPA Calculator */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Calculate GPA
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                label="Select Student"
              >
                {students.map((student) => (
                  <MenuItem key={student._id} value={student._id}>
                    {student.rollNumber} - {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleCalculateGPA}
              disabled={!selectedStudent || loading}
            >
              Calculate GPA
            </Button>
          </Grid>
          {gpaData && (
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: '#e3f2fd' }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    GPA
                  </Typography>
                  <Typography variant="h4">
                    {gpaData.gpa || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Grades Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Student</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Exam</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Marks Obtained</strong></TableCell>
              <TableCell><strong>Max Marks</strong></TableCell>
              <TableCell><strong>Percentage</strong></TableCell>
              <TableCell><strong>Grade</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No grades found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              grades.map((grade) => (
                <TableRow key={grade._id} hover>
                  <TableCell>{grade.student?.name}</TableCell>
                  <TableCell>{grade.student?.rollNumber}</TableCell>
                  <TableCell>{grade.exam?.title}</TableCell>
                  <TableCell>{grade.exam?.course?.title}</TableCell>
                  <TableCell>{grade.marksObtained}</TableCell>
                  <TableCell>{grade.exam?.maxMarks}</TableCell>
                  <TableCell>{grade.percentage}%</TableCell>
                  <TableCell>
                    <Chip
                      label={grade.grade}
                      color={getGradeColor(grade.grade)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Grade</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Student</InputLabel>
            <Select
              name="student"
              value={currentGrade.student}
              onChange={handleInputChange}
              label="Student"
            >
              {students.map((student) => (
                <MenuItem key={student._id} value={student._id}>
                  {student.rollNumber} - {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Exam</InputLabel>
            <Select
              name="exam"
              value={currentGrade.exam}
              onChange={handleInputChange}
              label="Exam"
            >
              {exams.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.title} ({exam.course?.title}) - Max: {exam.maxMarks}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Marks Obtained"
            name="marksObtained"
            type="number"
            fullWidth
            margin="normal"
            value={currentGrade.marksObtained}
            onChange={handleInputChange}
            inputProps={{ min: 0 }}
            required
            helperText={
              currentGrade.exam && exams.find(e => e._id === currentGrade.exam)
                ? `Maximum marks: ${exams.find(e => e._id === currentGrade.exam)?.maxMarks}`
                : ''
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Grade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradeManagement;

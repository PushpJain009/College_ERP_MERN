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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Publish as PublishIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExams, createExam, updateExam, deleteExam, publishExamResults } from '../../slices/examSlice';
import { fetchCourses } from '../../slices/courseSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const ExamManagement = () => {
  const dispatch = useDispatch();
  const { exams, loading, error } = useSelector((state) => state.exams);
  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExam, setCurrentExam] = useState({
    title: '',
    course: '',
    examType: 'Midterm',
    date: '',
    duration: '',
    maxMarks: '',
    instructions: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchExams({}));
    dispatch(fetchCourses({}));
  }, [dispatch]);

  const handleOpenDialog = (exam = null) => {
    if (exam) {
      setEditMode(true);
      setCurrentExam({
        ...exam,
        date: exam.date ? exam.date.split('T')[0] : '',
        duration: exam.duration?.toString() || '',
        maxMarks: exam.maxMarks?.toString() || ''
      });
    } else {
      setEditMode(false);
      setCurrentExam({
        title: '',
        course: '',
        examType: 'Midterm',
        date: '',
        duration: '',
        maxMarks: '',
        instructions: ''
      });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormError('');
  };

  const handleInputChange = (e) => {
    setCurrentExam({
      ...currentExam,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!currentExam.title || !currentExam.course || !currentExam.date || !currentExam.maxMarks) {
      setFormError('Title, course, date, and max marks are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const examData = {
        ...currentExam,
        duration: currentExam.duration ? parseInt(currentExam.duration) : undefined,
        maxMarks: parseInt(currentExam.maxMarks)
      };

      if (editMode) {
        await dispatch(updateExam({ id: currentExam._id, data: examData })).unwrap();
      } else {
        await dispatch(createExam(examData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchExams({}));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await dispatch(deleteExam(id)).unwrap();
        dispatch(fetchExams({}));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handlePublish = async (id) => {
    if (window.confirm('Publish exam results? Students will be able to view their grades.')) {
      try {
        await dispatch(publishExamResults(id)).unwrap();
        dispatch(fetchExams({}));
      } catch (err) {
        console.error('Publish failed:', err);
      }
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  if (loading && exams.length === 0) {
    return <LoadingSpinner message="Loading exams..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Exam Management
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Exam
          </Button>
        )}
      </Box>

      <ErrorAlert error={error} onClose={() => {}} />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Course</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Duration (min)</strong></TableCell>
              <TableCell><strong>Max Marks</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {canEdit && <TableCell align="center"><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 8 : 7} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No exams found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam._id} hover>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.course?.title}</TableCell>
                  <TableCell>{exam.examType}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell>{exam.duration || 'N/A'}</TableCell>
                  <TableCell>{exam.maxMarks}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.isPublished ? 'Published' : 'Draft'}
                      color={exam.isPublished ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {canEdit && (
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleOpenDialog(exam)}>
                        <EditIcon />
                      </IconButton>
                      {!exam.isPublished && (
                        <IconButton color="success" size="small" onClick={() => handlePublish(exam._id)}>
                          <PublishIcon />
                        </IconButton>
                      )}
                      <IconButton color="error" size="small" onClick={() => handleDelete(exam._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Exam' : 'Create New Exam'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <TextField
            label="Exam Title"
            name="title"
            fullWidth
            margin="normal"
            value={currentExam.title}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Course</InputLabel>
            <Select
              name="course"
              value={currentExam.course}
              onChange={handleInputChange}
              label="Course"
            >
              {courses.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.courseCode} - {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Exam Type</InputLabel>
            <Select
              name="examType"
              value={currentExam.examType}
              onChange={handleInputChange}
              label="Exam Type"
            >
              <MenuItem value="Midterm">Midterm</MenuItem>
              <MenuItem value="Final">Final</MenuItem>
              <MenuItem value="Quiz">Quiz</MenuItem>
              <MenuItem value="Practical">Practical</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Exam Date"
            name="date"
            type="date"
            fullWidth
            margin="normal"
            value={currentExam.date}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Duration (minutes)"
            name="duration"
            type="number"
            fullWidth
            margin="normal"
            value={currentExam.duration}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Maximum Marks"
            name="maxMarks"
            type="number"
            fullWidth
            margin="normal"
            value={currentExam.maxMarks}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            label="Instructions"
            name="instructions"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentExam.instructions}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamManagement;

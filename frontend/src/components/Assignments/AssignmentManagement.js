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
  IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } from '../../slices/assignmentSlice';
import { fetchCourses } from '../../slices/courseSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const AssignmentManagement = () => {
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.assignments);
  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    maxMarks: '',
    instructions: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchAssignments({}));
    dispatch(fetchCourses({}));
  }, [dispatch]);

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditMode(true);
      setCurrentAssignment({
        ...assignment,
        dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
        maxMarks: assignment.maxMarks?.toString() || ''
      });
    } else {
      setEditMode(false);
      setCurrentAssignment({
        title: '',
        description: '',
        course: '',
        dueDate: '',
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
    setCurrentAssignment({
      ...currentAssignment,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!currentAssignment.title || !currentAssignment.course || !currentAssignment.dueDate) {
      setFormError('Title, course, and due date are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const assignmentData = {
        ...currentAssignment,
        maxMarks: currentAssignment.maxMarks ? parseInt(currentAssignment.maxMarks) : undefined
      };

      if (editMode) {
        await dispatch(updateAssignment({ id: currentAssignment._id, data: assignmentData })).unwrap();
      } else {
        await dispatch(createAssignment(assignmentData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchAssignments({}));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await dispatch(deleteAssignment(id)).unwrap();
        dispatch(fetchAssignments({}));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const canManage = user?.role === 'admin' || user?.role === 'teacher';

  if (loading && assignments.length === 0) {
    return <LoadingSpinner message="Loading assignments..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Assignment Management
        </Typography>
        {canManage && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Assignment
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
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Max Marks</strong></TableCell>
              <TableCell><strong>Submissions</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {canManage && <TableCell align="center"><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 7 : 6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No assignments found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => {
                const isPastDue = new Date(assignment.dueDate) < new Date();
                return (
                  <TableRow key={assignment._id} hover>
                    <TableCell>{assignment.title}</TableCell>
                    <TableCell>{assignment.course?.title}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{assignment.maxMarks || 'N/A'}</TableCell>
                    <TableCell>{assignment.submissions?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={isPastDue ? 'Past Due' : 'Active'}
                        color={isPastDue ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    {canManage && (
                      <TableCell align="center">
                        <IconButton color="primary" size="small" onClick={() => handleOpenDialog(assignment)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDelete(assignment._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Assignment' : 'Create New Assignment'}</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <TextField
            label="Assignment Title"
            name="title"
            fullWidth
            margin="normal"
            value={currentAssignment.title}
            onChange={handleInputChange}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Course</InputLabel>
            <Select
              name="course"
              value={currentAssignment.course}
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

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentAssignment.description}
            onChange={handleInputChange}
          />

          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            fullWidth
            margin="normal"
            value={currentAssignment.dueDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />

          <TextField
            label="Maximum Marks"
            name="maxMarks"
            type="number"
            fullWidth
            margin="normal"
            value={currentAssignment.maxMarks}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Instructions"
            name="instructions"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentAssignment.instructions}
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

export default AssignmentManagement;

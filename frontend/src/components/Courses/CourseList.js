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
  TablePagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../slices/courseSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, error, pagination } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({
    title: '',
    courseCode: '',
    description: '',
    credits: '',
    semester: '',
    department: '',
    maxStudents: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
  }, [dispatch, page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    dispatch(fetchCourses({ page: 1, limit: rowsPerPage, search: searchTerm }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditMode(true);
      setCurrentCourse({
        ...course,
        credits: course.credits?.toString() || '',
        semester: course.semester?.toString() || '',
        maxStudents: course.maxStudents?.toString() || ''
      });
    } else {
      setEditMode(false);
      setCurrentCourse({
        title: '',
        courseCode: '',
        description: '',
        credits: '',
        semester: '',
        department: '',
        maxStudents: ''
      });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCourse({
      title: '',
      courseCode: '',
      description: '',
      credits: '',
      semester: '',
      department: '',
      maxStudents: ''
    });
    setFormError('');
  };

  const handleInputChange = (e) => {
    setCurrentCourse({
      ...currentCourse,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!currentCourse.title || !currentCourse.courseCode) {
      setFormError('Title and course code are required');
      return false;
    }
    if (currentCourse.credits && (isNaN(currentCourse.credits) || currentCourse.credits <= 0)) {
      setFormError('Credits must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const courseData = {
        ...currentCourse,
        credits: currentCourse.credits ? parseInt(currentCourse.credits) : undefined,
        semester: currentCourse.semester ? parseInt(currentCourse.semester) : undefined,
        maxStudents: currentCourse.maxStudents ? parseInt(currentCourse.maxStudents) : undefined
      };

      if (editMode) {
        await dispatch(updateCourse({ id: currentCourse._id, data: courseData })).unwrap();
      } else {
        await dispatch(createCourse(courseData)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchCourses({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await dispatch(deleteCourse(id)).unwrap();
        dispatch(fetchCourses({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  if (loading && courses.length === 0) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Course Management
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Course
          </Button>
        )}
      </Box>

      <ErrorAlert error={error} onClose={() => {}} />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by title, code, or description"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>Course Code</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Credits</strong></TableCell>
              <TableCell><strong>Semester</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Enrolled</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {canEdit && <TableCell align="center"><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 8 : 7} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No courses found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id} hover>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits || 'N/A'}</TableCell>
                  <TableCell>{course.semester || 'N/A'}</TableCell>
                  <TableCell>{course.department?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {course.students?.length || 0}
                    {course.maxStudents ? ` / ${course.maxStudents}` : ''}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.isActive ? 'Active' : 'Inactive'}
                      color={course.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {canEdit && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(course)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(course._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination?.total || courses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            label="Course Title"
            name="title"
            fullWidth
            margin="normal"
            value={currentCourse.title}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="Course Code"
            name="courseCode"
            fullWidth
            margin="normal"
            value={currentCourse.courseCode}
            onChange={handleInputChange}
            required
            disabled={editMode}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentCourse.description}
            onChange={handleInputChange}
          />

          <TextField
            label="Credits"
            name="credits"
            type="number"
            fullWidth
            margin="normal"
            value={currentCourse.credits}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Semester</InputLabel>
            <Select
              name="semester"
              value={currentCourse.semester}
              onChange={handleInputChange}
              label="Semester"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Department"
            name="department"
            fullWidth
            margin="normal"
            value={currentCourse.department}
            onChange={handleInputChange}
            helperText="Leave empty if not assigned yet"
          />

          <TextField
            label="Max Students"
            name="maxStudents"
            type="number"
            fullWidth
            margin="normal"
            value={currentCourse.maxStudents}
            onChange={handleInputChange}
            inputProps={{ min: 1 }}
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

export default CourseList;

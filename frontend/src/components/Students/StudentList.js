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
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../../slices/studentSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, loading, error, pagination } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    department: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchStudents({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
  }, [dispatch, page, rowsPerPage]);

  const handleSearch = () => {
    setPage(0);
    dispatch(fetchStudents({ page: 1, limit: rowsPerPage, search: searchTerm }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditMode(true);
      setCurrentStudent({
        ...student,
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : ''
      });
    } else {
      setEditMode(false);
      setCurrentStudent({
        name: '',
        rollNumber: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        department: ''
      });
    }
    setFormError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStudent({
      name: '',
      rollNumber: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      department: ''
    });
    setFormError('');
  };

  const handleInputChange = (e) => {
    setCurrentStudent({
      ...currentStudent,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!currentStudent.name || !currentStudent.email) {
      setFormError('Name and email are required');
      return false;
    }
    if (!editMode && !currentStudent.rollNumber) {
      setFormError('Roll number is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (editMode) {
        await dispatch(updateStudent({ id: currentStudent._id, data: currentStudent })).unwrap();
      } else {
        await dispatch(createStudent(currentStudent)).unwrap();
      }
      handleCloseDialog();
      dispatch(fetchStudents({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await dispatch(deleteStudent(id)).unwrap();
        dispatch(fetchStudents({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const canEdit = user?.role === 'admin';

  if (loading && students.length === 0) {
    return <LoadingSpinner message="Loading students..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Student Management
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Student
          </Button>
        )}
      </Box>

      <ErrorAlert error={error} onClose={() => {}} />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search by name, email, or roll number"
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
              <TableCell><strong>Roll Number</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Department</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              {canEdit && <TableCell align="center"><strong>Actions</strong></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 7 : 6} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No students found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student._id} hover>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || 'N/A'}</TableCell>
                  <TableCell>{student.department?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status || 'Active'}
                      color={student.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {canEdit && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(student._id)}
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
          count={pagination?.total || students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            value={currentStudent.name}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="Roll Number"
            name="rollNumber"
            fullWidth
            margin="normal"
            value={currentStudent.rollNumber}
            onChange={handleInputChange}
            required
            disabled={editMode}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={currentStudent.email}
            onChange={handleInputChange}
            required
          />

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={currentStudent.phone}
            onChange={handleInputChange}
          />

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            fullWidth
            margin="normal"
            value={currentStudent.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={currentStudent.gender}
              onChange={handleInputChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={currentStudent.address}
            onChange={handleInputChange}
          />

          <TextField
            label="Department"
            name="department"
            fullWidth
            margin="normal"
            value={currentStudent.department}
            onChange={handleInputChange}
            helperText="Leave empty if not assigned yet"
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

export default StudentList;

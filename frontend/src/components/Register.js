import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [validationError, setValidationError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role after successful registration
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-dashboard');
          break;
        case 'student':
          navigate('/student-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setValidationError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setValidationError('All fields are required');
      return false;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    dispatch(register(registerData));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          maxWidth: '450px',
          width: '100%',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
          Register for College ERP
        </Typography>

        {(error || validationError) && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => {
              dispatch(clearError());
              setValidationError('');
            }}
          >
            {error || validationError}
          </Alert>
        )}

        <TextField
          label="Full Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <TextField
          label="Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <TextField
          label="Password"
          name="password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          helperText="Minimum 6 characters"
        />

        <TextField
          label="Confirm Password"
          name="confirmPassword"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formData.role}
            onChange={handleChange}
            label="Role"
            disabled={loading}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;

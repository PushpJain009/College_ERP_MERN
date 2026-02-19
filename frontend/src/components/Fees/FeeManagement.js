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
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, CheckCircle as VerifyIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeeStructures,
  fetchFeePayments,
  createFeeStructure,
  createFeePayment,
  verifyPayment
} from '../../slices/feeSlice';
import { fetchStudents } from '../../slices/studentSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

const FeeManagement = () => {
  const dispatch = useDispatch();
  const { structures, payments, loading, error } = useSelector((state) => state.fees);
  const { students } = useSelector((state) => state.students);
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [openStructureDialog, setOpenStructureDialog] = useState(false);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [currentStructure, setCurrentStructure] = useState({
    name: '',
    amount: '',
    category: 'Tuition',
    academicYear: '',
    semester: ''
  });
  const [currentPayment, setCurrentPayment] = useState({
    student: '',
    feeStructure: '',
    amount: '',
    paymentMode: 'Cash',
    transactionId: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(fetchFeeStructures({}));
    dispatch(fetchFeePayments({}));
    dispatch(fetchStudents({}));
  }, [dispatch]);

  const handleStructureInputChange = (e) => {
    setCurrentStructure({
      ...currentStructure,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentInputChange = (e) => {
    setCurrentPayment({
      ...currentPayment,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateStructure = async () => {
    if (!currentStructure.name || !currentStructure.amount) {
      setFormError('Name and amount are required');
      return;
    }

    try {
      const structureData = {
        ...currentStructure,
        amount: parseFloat(currentStructure.amount),
        semester: currentStructure.semester ? parseInt(currentStructure.semester) : undefined
      };

      await dispatch(createFeeStructure(structureData)).unwrap();
      setOpenStructureDialog(false);
      setCurrentStructure({ name: '', amount: '', category: 'Tuition', academicYear: '', semester: '' });
      dispatch(fetchFeeStructures({}));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleCreatePayment = async () => {
    if (!currentPayment.student || !currentPayment.feeStructure || !currentPayment.amount) {
      setFormError('Student, fee structure, and amount are required');
      return;
    }

    try {
      const paymentData = {
        ...currentPayment,
        amount: parseFloat(currentPayment.amount)
      };

      await dispatch(createFeePayment(paymentData)).unwrap();
      setOpenPaymentDialog(false);
      setCurrentPayment({ student: '', feeStructure: '', amount: '', paymentMode: 'Cash', transactionId: '' });
      dispatch(fetchFeePayments({}));
    } catch (err) {
      setFormError(err || 'Operation failed');
    }
  };

  const handleVerifyPayment = async (id) => {
    try {
      await dispatch(verifyPayment({ id, data: { status: 'Verified' } })).unwrap();
      dispatch(fetchFeePayments({}));
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const canManage = user?.role === 'admin';

  if (loading && structures.length === 0 && payments.length === 0) {
    return <LoadingSpinner message="Loading fee records..." />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
        Fee Management
      </Typography>

      <ErrorAlert error={error} onClose={() => {}} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Fee Structures" />
          <Tab label="Payments" />
        </Tabs>
      </Box>

      {/* Fee Structures Tab */}
      {tabValue === 0 && (
        <Box>
          {canManage && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenStructureDialog(true)}
              sx={{ mb: 2 }}
            >
              Create Fee Structure
            </Button>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Academic Year</strong></TableCell>
                  <TableCell><strong>Semester</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {structures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No fee structures found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  structures.map((structure) => (
                    <TableRow key={structure._id} hover>
                      <TableCell>{structure.name}</TableCell>
                      <TableCell>${structure.amount}</TableCell>
                      <TableCell>{structure.category}</TableCell>
                      <TableCell>{structure.academicYear || 'N/A'}</TableCell>
                      <TableCell>{structure.semester || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Payments Tab */}
      {tabValue === 1 && (
        <Box>
          {canManage && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenPaymentDialog(true)}
              sx={{ mb: 2 }}
            >
              Record Payment
            </Button>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Receipt No</strong></TableCell>
                  <TableCell><strong>Student</strong></TableCell>
                  <TableCell><strong>Fee Type</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Payment Mode</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  {canManage && <TableCell align="center"><strong>Actions</strong></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canManage ? 8 : 7} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No payments found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment._id} hover>
                      <TableCell>{payment.receiptNumber}</TableCell>
                      <TableCell>{payment.student?.name}</TableCell>
                      <TableCell>{payment.feeStructure?.name}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.paymentMode}</TableCell>
                      <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={
                            payment.status === 'Verified' ? 'success' :
                            payment.status === 'Pending' ? 'warning' :
                            'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      {canManage && (
                        <TableCell align="center">
                          {payment.status === 'Pending' && (
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => handleVerifyPayment(payment._id)}
                            >
                              <VerifyIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Create Structure Dialog */}
      <Dialog open={openStructureDialog} onClose={() => setOpenStructureDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Fee Structure</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <TextField
            label="Fee Name"
            name="name"
            fullWidth
            margin="normal"
            value={currentStructure.name}
            onChange={handleStructureInputChange}
            required
          />

          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            value={currentStructure.amount}
            onChange={handleStructureInputChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={currentStructure.category}
              onChange={handleStructureInputChange}
              label="Category"
            >
              <MenuItem value="Tuition">Tuition</MenuItem>
              <MenuItem value="Hostel">Hostel</MenuItem>
              <MenuItem value="Library">Library</MenuItem>
              <MenuItem value="Laboratory">Laboratory</MenuItem>
              <MenuItem value="Transport">Transport</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Academic Year"
            name="academicYear"
            fullWidth
            margin="normal"
            value={currentStructure.academicYear}
            onChange={handleStructureInputChange}
            placeholder="e.g., 2023-2024"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Semester</InputLabel>
            <Select
              name="semester"
              value={currentStructure.semester}
              onChange={handleStructureInputChange}
              label="Semester"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Semester {sem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStructureDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateStructure} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Student</InputLabel>
            <Select
              name="student"
              value={currentPayment.student}
              onChange={handlePaymentInputChange}
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
            <InputLabel>Fee Structure</InputLabel>
            <Select
              name="feeStructure"
              value={currentPayment.feeStructure}
              onChange={handlePaymentInputChange}
              label="Fee Structure"
            >
              {structures.map((structure) => (
                <MenuItem key={structure._id} value={structure._id}>
                  {structure.name} - ${structure.amount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            margin="normal"
            value={currentPayment.amount}
            onChange={handlePaymentInputChange}
            inputProps={{ min: 0, step: 0.01 }}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Payment Mode</InputLabel>
            <Select
              name="paymentMode"
              value={currentPayment.paymentMode}
              onChange={handlePaymentInputChange}
              label="Payment Mode"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Cheque">Cheque</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Transaction ID (Optional)"
            name="transactionId"
            fullWidth
            margin="normal"
            value={currentPayment.transactionId}
            onChange={handlePaymentInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button onClick={handleCreatePayment} variant="contained" color="primary">
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeeManagement;

// src/slices/feeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feeAPI } from '../services/api';

// Async thunks
export const fetchFeeStructures = createAsyncThunk(
  'fees/fetchStructures',
  async (params, { rejectWithValue }) => {
    try {
      const response = await feeAPI.getStructures(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch fee structures');
    }
  }
);

export const fetchFeePayments = createAsyncThunk(
  'fees/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await feeAPI.getPayments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch fee payments');
    }
  }
);

export const createFeeStructure = createAsyncThunk(
  'fees/createStructure',
  async (data, { rejectWithValue }) => {
    try {
      const response = await feeAPI.createStructure(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create fee structure');
    }
  }
);

export const updateFeeStructure = createAsyncThunk(
  'fees/updateStructure',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await feeAPI.updateStructure(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update fee structure');
    }
  }
);

export const deleteFeeStructure = createAsyncThunk(
  'fees/deleteStructure',
  async (id, { rejectWithValue }) => {
    try {
      const response = await feeAPI.deleteStructure(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete fee structure');
    }
  }
);

export const createFeePayment = createAsyncThunk(
  'fees/createPayment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await feeAPI.createPayment(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create fee payment');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'fees/verifyPayment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await feeAPI.verifyPayment(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to verify payment');
    }
  }
);

export const getFeeReport = createAsyncThunk(
  'fees/getReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await feeAPI.getReport(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch fee report');
    }
  }
);

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    structures: [],
    payments: [],
    report: null,
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReport: (state) => {
      state.report = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch structures
      .addCase(fetchFeeStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeeStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch payments
      .addCase(fetchFeePayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeePayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeePayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create structure
      .addCase(createFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures.push(action.payload.data);
      })
      .addCase(createFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update structure
      .addCase(updateFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.structures.findIndex((s) => s._id === action.payload.data._id);
        if (index !== -1) {
          state.structures[index] = action.payload.data;
        }
      })
      .addCase(updateFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete structure
      .addCase(deleteFeeStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeeStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = state.structures.filter((s) => s._id !== action.meta.arg);
      })
      .addCase(deleteFeeStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create payment
      .addCase(createFeePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload.data);
      })
      .addCase(createFeePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify payment
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.payments.findIndex((p) => p._id === action.payload.data._id);
        if (index !== -1) {
          state.payments[index] = action.payload.data;
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get report
      .addCase(getFeeReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.data;
      })
      .addCase(getFeeReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearReport } = feeSlice.actions;
export default feeSlice.reducer;

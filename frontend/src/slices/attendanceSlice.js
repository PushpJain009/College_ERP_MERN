// src/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceAPI } from '../services/api';

// Async thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attendance');
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.mark(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark attendance');
    }
  }
);

export const markBulkAttendance = createAsyncThunk(
  'attendance/markBulk',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.markBulk(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark bulk attendance');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'attendance/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update attendance');
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  'attendance/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.delete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete attendance');
    }
  }
);

export const getAttendanceReport = createAsyncThunk(
  'attendance/report',
  async (params, { rejectWithValue }) => {
    try {
      const response = await attendanceAPI.getReport(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch attendance report');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendance: [],
    currentAttendance: null,
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
      // Fetch attendance
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark attendance
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance.push(action.payload.data);
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark bulk attendance
      .addCase(markBulkAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markBulkAttendance.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(markBulkAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attendance.findIndex((a) => a._id === action.payload.data._id);
        if (index !== -1) {
          state.attendance[index] = action.payload.data;
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete attendance
      .addCase(deleteAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = state.attendance.filter((a) => a._id !== action.meta.arg);
      })
      .addCase(deleteAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get report
      .addCase(getAttendanceReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.data;
      })
      .addCase(getAttendanceReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearReport } = attendanceSlice.actions;
export default attendanceSlice.reducer;

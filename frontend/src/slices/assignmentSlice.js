// src/slices/assignmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignmentAPI } from '../services/api';

// Async thunks
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch assignments');
    }
  }
);

export const fetchAssignmentById = createAsyncThunk(
  'assignments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch assignment');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create assignment');
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update assignment');
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.delete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete assignment');
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignments/submit',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.submit(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit assignment');
    }
  }
);

export const gradeSubmission = createAsyncThunk(
  'assignments/gradeSubmission',
  async ({ assignmentId, submissionId, data }, { rejectWithValue }) => {
    try {
      const response = await assignmentAPI.gradeSubmission(assignmentId, submissionId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to grade submission');
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    currentAssignment: null,
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAssignment: (state) => {
      state.currentAssignment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch assignment by ID
      .addCase(fetchAssignmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssignment = action.payload.data;
      })
      .addCase(fetchAssignmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments.push(action.payload.data);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update assignment
      .addCase(updateAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.assignments.findIndex((a) => a._id === action.payload.data._id);
        if (index !== -1) {
          state.assignments[index] = action.payload.data;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = state.assignments.filter((a) => a._id !== action.meta.arg);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit assignment
      .addCase(submitAssignment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Grade submission
      .addCase(gradeSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(gradeSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentAssignment } = assignmentSlice.actions;
export default assignmentSlice.reducer;

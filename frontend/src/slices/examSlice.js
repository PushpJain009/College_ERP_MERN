// src/slices/examSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examAPI } from '../services/api';

// Async thunks
export const fetchExams = createAsyncThunk(
  'exams/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await examAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch exams');
    }
  }
);

export const fetchExamById = createAsyncThunk(
  'exams/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await examAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch exam');
    }
  }
);

export const createExam = createAsyncThunk(
  'exams/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await examAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create exam');
    }
  }
);

export const updateExam = createAsyncThunk(
  'exams/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await examAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update exam');
    }
  }
);

export const deleteExam = createAsyncThunk(
  'exams/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await examAPI.delete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete exam');
    }
  }
);

export const publishExamResults = createAsyncThunk(
  'exams/publishResults',
  async (id, { rejectWithValue }) => {
    try {
      const response = await examAPI.publishResults(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to publish results');
    }
  }
);

const examSlice = createSlice({
  name: 'exams',
  initialState: {
    exams: [],
    currentExam: null,
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentExam: (state) => {
      state.currentExam = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch exams
      .addCase(fetchExams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch exam by ID
      .addCase(fetchExamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExam = action.payload.data;
      })
      .addCase(fetchExamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create exam
      .addCase(createExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams.push(action.payload.data);
      })
      .addCase(createExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update exam
      .addCase(updateExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exams.findIndex((e) => e._id === action.payload.data._id);
        if (index !== -1) {
          state.exams[index] = action.payload.data;
        }
      })
      .addCase(updateExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete exam
      .addCase(deleteExam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.loading = false;
        state.exams = state.exams.filter((e) => e._id !== action.meta.arg);
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Publish results
      .addCase(publishExamResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishExamResults.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exams.findIndex((e) => e._id === action.payload.data._id);
        if (index !== -1) {
          state.exams[index] = action.payload.data;
        }
      })
      .addCase(publishExamResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentExam } = examSlice.actions;
export default examSlice.reducer;

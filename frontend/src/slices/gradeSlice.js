// src/slices/gradeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gradeAPI } from '../services/api';

// Async thunks
export const fetchGrades = createAsyncThunk(
  'grades/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch grades');
    }
  }
);

export const fetchGradeById = createAsyncThunk(
  'grades/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch grade');
    }
  }
);

export const createGrade = createAsyncThunk(
  'grades/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.create(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create grade');
    }
  }
);

export const updateGrade = createAsyncThunk(
  'grades/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update grade');
    }
  }
);

export const deleteGrade = createAsyncThunk(
  'grades/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.delete(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete grade');
    }
  }
);

export const calculateGPA = createAsyncThunk(
  'grades/calculateGPA',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await gradeAPI.calculateGPA(studentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to calculate GPA');
    }
  }
);

const gradeSlice = createSlice({
  name: 'grades',
  initialState: {
    grades: [],
    currentGrade: null,
    gpaData: null,
    loading: false,
    error: null,
    pagination: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGPAData: (state) => {
      state.gpaData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch grades
      .addCase(fetchGrades.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch grade by ID
      .addCase(fetchGradeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGradeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGrade = action.payload.data;
      })
      .addCase(fetchGradeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create grade
      .addCase(createGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades.push(action.payload.data);
      })
      .addCase(createGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update grade
      .addCase(updateGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.grades.findIndex((g) => g._id === action.payload.data._id);
        if (index !== -1) {
          state.grades[index] = action.payload.data;
        }
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete grade
      .addCase(deleteGrade.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGrade.fulfilled, (state, action) => {
        state.loading = false;
        state.grades = state.grades.filter((g) => g._id !== action.meta.arg);
      })
      .addCase(deleteGrade.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Calculate GPA
      .addCase(calculateGPA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateGPA.fulfilled, (state, action) => {
        state.loading = false;
        state.gpaData = action.payload.data;
      })
      .addCase(calculateGPA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearGPAData } = gradeSlice.actions;
export default gradeSlice.reducer;

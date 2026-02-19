// src/slices/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseAPI } from '../services/api';

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseAPI.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await courseAPI.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await courseAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete course');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch courses
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch course by ID
    builder
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      });

    // Create course
    builder
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      });

    // Update course
    builder
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
      });

    // Delete course
    builder
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter(c => c._id !== action.payload);
      });
  }
});

export const { clearError } = courseSlice.actions;
export default courseSlice.reducer;

// src/slices/studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentAPI } from '../services/api';

const initialState = {
  students: [],
  currentStudent: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 25,
    total: 0
  }
};

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await studentAPI.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch students');
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await studentAPI.getById(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch student');
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await studentAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create student');
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await studentAPI.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update student');
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id, { rejectWithValue }) => {
    try {
      await studentAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete student');
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.next?.page - 1 || 1,
          limit: action.payload.pagination?.next?.limit || 25,
          total: action.payload.total
        };
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch student by ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create student
    builder
      .addCase(createStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update student
    builder
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.currentStudent?._id === action.payload._id) {
          state.currentStudent = action.payload;
        }
      });

    // Delete student
    builder
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s._id !== action.payload);
      });
  }
});

export const { clearError, clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;

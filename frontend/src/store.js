// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import courseReducer from './slices/courseSlice';
import attendanceReducer from './slices/attendanceSlice';
import examReducer from './slices/examSlice';
import gradeReducer from './slices/gradeSlice';
import assignmentReducer from './slices/assignmentSlice';
import feeReducer from './slices/feeSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    courses: courseReducer,
    attendance: attendanceReducer,
    exams: examReducer,
    grades: gradeReducer,
    assignments: assignmentReducer,
    fees: feeReducer,
    notifications: notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;



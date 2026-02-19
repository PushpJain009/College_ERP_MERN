// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { getMe } from './slices/authSlice';

// Layout
import Layout from './components/Layout/Layout';

// Auth Components
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';

// Dashboard Components
import AdminDashboard from './components/Dashboard/AdminDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';

// Management Components
import StudentList from './components/Students/StudentList';
import CourseList from './components/Courses/CourseList';
import AttendanceManagement from './components/Attendance/AttendanceManagement';
import ExamManagement from './components/Exams/ExamManagement';
import GradeManagement from './components/Grades/GradeManagement';
import AssignmentManagement from './components/Assignments/AssignmentManagement';
import FeeManagement from './components/Fees/FeeManagement';

// Utility Components
import PrivateRoute from './components/Common/PrivateRoute';
import NotFound from './components/Common/NotFound';

const App = () => {
  const dispatch = useDispatch();

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Dashboard Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <PrivateRoute roles={['teacher']}>
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute roles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />

          {/* Student Management */}
          <Route
            path="/students"
            element={
              <PrivateRoute roles={['admin', 'teacher']}>
                <StudentList />
              </PrivateRoute>
            }
          />

          {/* Course Management */}
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <CourseList />
              </PrivateRoute>
            }
          />

          {/* Attendance Management */}
          <Route
            path="/attendance"
            element={
              <PrivateRoute roles={['admin', 'teacher']}>
                <AttendanceManagement />
              </PrivateRoute>
            }
          />

          {/* Exam Management */}
          <Route
            path="/exams"
            element={
              <PrivateRoute roles={['admin', 'teacher']}>
                <ExamManagement />
              </PrivateRoute>
            }
          />

          {/* Grade Management */}
          <Route
            path="/grades"
            element={
              <PrivateRoute>
                <GradeManagement />
              </PrivateRoute>
            }
          />

          {/* Assignment Management */}
          <Route
            path="/assignments"
            element={
              <PrivateRoute>
                <AssignmentManagement />
              </PrivateRoute>
            }
          />

          {/* Fee Management */}
          <Route
            path="/fees"
            element={
              <PrivateRoute>
                <FeeManagement />
              </PrivateRoute>
            }
          />
        </Route>

        {/* 404 Not Found */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

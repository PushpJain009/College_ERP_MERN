// src/services/api.js
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updatePassword: (data) => api.put('/users/update-password', data)
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

// Student APIs
export const studentAPI = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  enrollCourse: (id, courseId) => api.post(`/students/${id}/enroll`, { courseId }),
  unenrollCourse: (id, courseId) => api.delete(`/students/${id}/unenroll/${courseId}`),
  getCourses: (id) => api.get(`/students/${id}/courses`),
  getGrades: (id) => api.get(`/students/${id}/grades`),
  getAttendance: (id) => api.get(`/students/${id}/attendance`)
};

// Course APIs
export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  getStudents: (id) => api.get(`/courses/${id}/students`),
  getByDepartment: (departmentId) => api.get(`/courses/department/${departmentId}`),
  getBySemester: (semester) => api.get(`/courses/semester/${semester}`),
  getByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`)
};

// Department APIs
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`)
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance', { params }),
  mark: (data) => api.post('/attendance', data),
  markBulk: (data) => api.post('/attendance/bulk', data),
  getByStudent: (studentId, params) => api.get(`/attendance/student/${studentId}`, { params }),
  getByCourse: (courseId, params) => api.get(`/attendance/course/${courseId}`, { params }),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  getReports: (params) => api.get('/attendance/reports', { params })
};

// Exam APIs
export const examAPI = {
  getAll: (params) => api.get('/exams', { params }),
  getById: (id) => api.get(`/exams/${id}`),
  create: (data) => api.post('/exams', data),
  update: (id, data) => api.put(`/exams/${id}`, data),
  delete: (id) => api.delete(`/exams/${id}`),
  publish: (id) => api.put(`/exams/${id}/publish`)
};

// Grade APIs
export const gradeAPI = {
  getAll: () => api.get('/grades'),
  getByStudent: (studentId) => api.get(`/grades/student/${studentId}`),
  getByExam: (examId) => api.get(`/grades/exam/${examId}`),
  add: (data) => api.post('/grades', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  delete: (id) => api.delete(`/grades/${id}`),
  publish: (id) => api.put(`/grades/${id}/publish`)
};

// Assignment APIs
export const assignmentAPI = {
  getAll: (params) => api.get('/assignments', { params }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  getSubmissions: (id) => api.get(`/assignments/${id}/submissions`),
  submit: (id, data) => api.post(`/assignments/${id}/submit`, data),
  gradeSubmission: (id, data) => api.put(`/assignments/submissions/${id}/grade`, data)
};

// Fee APIs
export const feeAPI = {
  getAll: () => api.get('/fees'),
  getById: (id) => api.get(`/fees/${id}`),
  create: (data) => api.post('/fees', data),
  update: (id, data) => api.put(`/fees/${id}`, data),
  delete: (id) => api.delete(`/fees/${id}`),
  getStudentFees: (studentId) => api.get(`/fees/student/${studentId}`),
  recordPayment: (data) => api.post('/fees/payment', data),
  getPaymentHistory: () => api.get('/fees/payments'),
  getReports: (params) => api.get('/fees/reports', { params })
};

// Timetable APIs
export const timetableAPI = {
  getAll: (params) => api.get('/timetable', { params }),
  getById: (id) => api.get(`/timetable/${id}`),
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
  getStudentTimetable: (studentId) => api.get(`/timetable/student/${studentId}`),
  getTeacherTimetable: (teacherId) => api.get(`/timetable/teacher/${teacherId}`)
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  getById: (id) => api.get(`/notifications/${id}`),
  create: (data) => api.post('/notifications', data),
  update: (id, data) => api.put(`/notifications/${id}`, data),
  delete: (id) => api.delete(`/notifications/${id}`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  getUnreadCount: () => api.get('/notifications/unread/count'),
  markAllAsRead: () => api.put('/notifications/read-all')
};

export default api;

// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import TeacherDashboard from "./components/Dashboard/TeacherDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import AddCourse from "./components/Courses/AddCourse";
import CourseList from "./components/Courses/CourseList";
import AddStudent from "./components/Students/AddStudent";
import StudentList from "./components/Students/StudentList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/students" element={<StudentList />} />
      </Routes>
    </Router>
  );
};

export default App;

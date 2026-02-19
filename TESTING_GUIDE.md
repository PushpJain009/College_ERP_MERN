# College ERP - API Testing Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set:
# MONGO_URI=mongodb://localhost:27017/college_erp
# JWT_SECRET=<generate using: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
```

### 3. Start Server
```bash
npm run dev
```

Server should start on `http://localhost:5000`

---

## Test Using Postman/Thunder Client

### A. Authentication Endpoints

#### 1. Register Admin User
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@college.com",
  "password": "admin123",
  "role": "admin"
}
```

Expected Response (201):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@college.com",
    "role": "admin",
    "token": "eyJhbGc..."
  }
}
```

#### 2. Login
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "admin@college.com",
  "password": "admin123"
}
```

Expected Response (200):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Admin User",
    "email": "admin@college.com",
    "role": "admin",
    "token": "eyJhbGc..."
  }
}
```

**Copy the token from the response - you'll need it for authenticated requests!**

---

### B. Protected Endpoints (Require Authentication)

For all protected endpoints, add this header:
```
Authorization: Bearer <your_token_here>
```

#### 3. Get Current User
```
GET http://localhost:5000/api/users/me
Authorization: Bearer <token>
```

#### 4. Create Department
```
POST http://localhost:5000/api/departments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Computer Science",
  "code": "CS",
  "description": "Department of Computer Science"
}
```

#### 5. Create Course
```
POST http://localhost:5000/api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Data Structures",
  "courseCode": "CS101",
  "description": "Introduction to Data Structures",
  "credits": 4,
  "semester": 3
}
```

#### 6. Create Student
```
POST http://localhost:5000/api/students
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "rollNumber": "2024001",
  "email": "john@student.com",
  "semester": 3
}
```

#### 7. Mark Attendance
```
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "<student_id>",
  "course": "<course_id>",
  "date": "2024-01-15",
  "status": "Present"
}
```

#### 8. Create Exam
```
POST http://localhost:5000/api/exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Midterm Exam",
  "course": "<course_id>",
  "date": "2024-02-15",
  "maxMarks": 100,
  "type": "Midterm"
}
```

#### 9. Add Grade
```
POST http://localhost:5000/api/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "student": "<student_id>",
  "exam": "<exam_id>",
  "marksObtained": 85
}
```

---

## Complete API Endpoint List

### Authentication (Public)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Users (Protected)
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `PUT /api/users/update-password` - Change password
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Departments (Mixed)
- `GET /api/departments` - Get all departments (Public)
- `GET /api/departments/:id` - Get department by ID (Public)
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/:id` - Update department (Admin)
- `DELETE /api/departments/:id` - Delete department (Admin)

### Students (Protected)
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student (Admin/Teacher)
- `DELETE /api/students/:id` - Delete student (Admin)
- `POST /api/students/:id/enroll` - Enroll in course (Admin)
- `DELETE /api/students/:id/unenroll/:courseId` - Unenroll (Admin)
- `GET /api/students/:id/courses` - Get student courses
- `GET /api/students/:id/grades` - Get student grades
- `GET /api/students/:id/attendance` - Get student attendance

### Courses (Mixed)
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin/Teacher)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `GET /api/courses/:id/students` - Get enrolled students
- `GET /api/courses/department/:departmentId` - By department (Public)
- `GET /api/courses/semester/:semester` - By semester (Public)
- `GET /api/courses/teacher/:teacherId` - By teacher

### Attendance (Protected)
- `GET /api/attendance` - Get all attendance
- `POST /api/attendance` - Mark attendance (Teacher/Admin)
- `POST /api/attendance/bulk` - Mark bulk attendance (Teacher/Admin)
- `GET /api/attendance/student/:studentId` - By student
- `GET /api/attendance/course/:courseId` - By course (Teacher/Admin)
- `PUT /api/attendance/:id` - Update attendance (Teacher/Admin)
- `DELETE /api/attendance/:id` - Delete attendance (Admin)
- `GET /api/attendance/reports` - Get reports (Teacher/Admin)

### Exams (Protected)
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `POST /api/exams` - Create exam (Teacher/Admin)
- `PUT /api/exams/:id` - Update exam (Teacher/Admin)
- `DELETE /api/exams/:id` - Delete exam (Admin)
- `PUT /api/exams/:id/publish` - Publish exam (Teacher/Admin)

### Grades (Protected)
- `GET /api/grades` - Get all grades
- `GET /api/grades/student/:studentId` - By student
- `GET /api/grades/exam/:examId` - By exam (Teacher/Admin)
- `POST /api/grades` - Add grade (Teacher/Admin)
- `PUT /api/grades/:id` - Update grade (Teacher/Admin)
- `DELETE /api/grades/:id` - Delete grade (Admin)
- `PUT /api/grades/:id/publish` - Publish grade (Teacher/Admin)

### Assignments (Protected)
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment by ID
- `POST /api/assignments` - Create assignment (Teacher/Admin)
- `PUT /api/assignments/:id` - Update assignment (Teacher/Admin)
- `DELETE /api/assignments/:id` - Delete assignment (Admin)
- `GET /api/assignments/:id/submissions` - Get submissions (Teacher/Admin)
- `POST /api/assignments/:id/submit` - Submit assignment (Student)
- `PUT /api/assignments/submissions/:id/grade` - Grade submission (Teacher/Admin)

### Fees (Protected)
- `GET /api/fees` - Get fee structures
- `GET /api/fees/:id` - Get fee structure by ID
- `POST /api/fees` - Create fee structure (Admin)
- `PUT /api/fees/:id` - Update fee structure (Admin)
- `DELETE /api/fees/:id` - Delete fee structure (Admin)
- `GET /api/fees/student/:studentId` - Get student fees
- `POST /api/fees/payment` - Record payment (Admin)
- `GET /api/fees/payments` - Get payment history (Admin)
- `GET /api/fees/reports` - Get reports (Admin)

### Timetable (Mixed)
- `GET /api/timetable` - Get timetable (Public)
- `GET /api/timetable/:id` - Get entry by ID (Public)
- `POST /api/timetable` - Create entry (Admin)
- `PUT /api/timetable/:id` - Update entry (Admin)
- `DELETE /api/timetable/:id` - Delete entry (Admin)
- `GET /api/timetable/student/:studentId` - Student timetable
- `GET /api/timetable/teacher/:teacherId` - Teacher timetable

### Notifications (Protected)
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/read-all` - Mark all as read
- `POST /api/notifications` - Create notification (Admin/Teacher)
- `GET /api/notifications/:id` - Get notification by ID
- `PUT /api/notifications/:id` - Update notification (Admin)
- `DELETE /api/notifications/:id` - Delete notification (Admin)
- `PUT /api/notifications/:id/read` - Mark as read

---

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Success Response (with count)
```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

### Success Response (with pagination)
```json
{
  "success": true,
  "count": 25,
  "pagination": {
    "next": { "page": 2, "limit": 25 },
    "prev": { "page": 1, "limit": 25 }
  },
  "total": 100,
  "data": [ ... ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## Query Parameters

### Pagination
```
GET /api/students?page=2&limit=10
```

### Filtering
```
GET /api/students?semester=3&status=Active
```

### Sorting
```
GET /api/students?sort=-createdAt,name
```

### Field Selection
```
GET /api/students?select=name,rollNumber,email
```

---

## Testing Workflow

### 1. Setup
1. Register admin user
2. Login to get token
3. Create departments
4. Create courses

### 2. Student Management
1. Create students
2. Enroll students in courses
3. View student list

### 3. Attendance
1. Mark attendance for students
2. View attendance reports
3. Check student attendance percentage

### 4. Exams & Grades
1. Create exams
2. Add grades for students
3. View student grades and GPA

### 5. Assignments
1. Create assignments
2. Students submit assignments
3. Teachers grade submissions

### 6. Fees
1. Create fee structures
2. View student fees
3. Record payments

---

## Troubleshooting

### 401 Unauthorized
- Check if token is valid
- Make sure to include `Authorization: Bearer <token>` header
- Token might have expired (re-login)

### 403 Forbidden
- User doesn't have required role
- Check endpoint authorization requirements

### 400 Bad Request
- Check request body format
- Validate required fields
- Check field types and constraints

### 404 Not Found
- Resource doesn't exist
- Check if ID is correct

### 500 Server Error
- Check server logs
- Verify MongoDB is running
- Check .env configuration

---

## Health Check

Test if server is running:
```
GET http://localhost:5000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Next Steps

1. **Test all endpoints** using Postman or similar tool
2. **Create seed data** for testing
3. **Integrate with frontend** - update API calls
4. **Add file upload** functionality
5. **Implement email** notifications
6. **Deploy to production**

---

Good luck with testing! 🚀

# 🚀 Quick Reference Guide

## Essential Commands

### Development

```bash
# Backend
cd backend
npm install           # Install dependencies
npm run dev          # Start development server (port 5000)
npm start            # Start production server

# Frontend
cd frontend
npm install           # Install dependencies
npm start            # Start development server (port 3000)
npm run build        # Build for production
```

### Environment Setup

**Backend `.env`:**
```
MONGO_URI=mongodb://localhost:27017/college_erp
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

**Frontend `.env`:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=College ERP System
```

---

## Default Test Users

Create these users via `/register` or Postman:

### Admin
- Email: `admin@college.com`
- Password: `admin123`
- Role: `admin`

### Teacher
- Email: `teacher@college.com`
- Password: `teacher123`
- Role: `teacher`

### Student
- Email: `student@college.com`
- Password: `student123`
- Role: `student`

---

## Key API Endpoints

### Authentication
```
POST /api/users/register    - Register new user
POST /api/users/login       - Login
GET  /api/users/me          - Get current user
```

### Students
```
GET    /api/students        - Get all students (paginated)
POST   /api/students        - Create student
GET    /api/students/:id    - Get student by ID
PUT    /api/students/:id    - Update student
DELETE /api/students/:id    - Delete student
```

### Courses
```
GET    /api/courses         - Get all courses
POST   /api/courses         - Create course
GET    /api/courses/:id     - Get course
PUT    /api/courses/:id     - Update course
DELETE /api/courses/:id     - Delete course
```

### Attendance
```
GET  /api/attendance           - Get attendance records
POST /api/attendance           - Mark single attendance
POST /api/attendance/bulk      - Bulk attendance marking
GET  /api/attendance/reports   - Get reports
```

### Exams & Grades
```
GET  /api/exams                - Get all exams
POST /api/exams                - Create exam
POST /api/exams/:id/publish    - Publish results
GET  /api/grades               - Get grades
POST /api/grades               - Create grade
GET  /api/grades/calculate-gpa/:studentId - Calculate GPA
```

### Assignments
```
GET  /api/assignments            - Get assignments
POST /api/assignments            - Create assignment
POST /api/assignments/:id/submit - Submit assignment
POST /api/assignments/:id/grade  - Grade submission
```

### Fees
```
GET  /api/fees/structures       - Get fee structures
POST /api/fees/structures       - Create fee structure
GET  /api/fees/payments         - Get payments
POST /api/fees/payments         - Record payment
PUT  /api/fees/payments/:id/verify - Verify payment
```

---

## Common Tasks

### 1. Create a New Student
```bash
POST http://localhost:5000/api/students
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "name": "John Doe",
  "rollNumber": "CS001",
  "email": "john@example.com",
  "phone": "1234567890",
  "dateOfBirth": "2000-01-01",
  "gender": "Male",
  "department": "DEPARTMENT_ID"
}
```

### 2. Mark Bulk Attendance
```bash
POST http://localhost:5000/api/attendance/bulk
Headers: {
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "courseId": "COURSE_ID",
  "date": "2026-02-17",
  "attendanceList": [
    {"studentId": "STUDENT_ID_1", "status": "Present"},
    {"studentId": "STUDENT_ID_2", "status": "Absent"},
    {"studentId": "STUDENT_ID_3", "status": "Late"}
  ]
}
```

### 3. Create Exam and Enter Grades
```bash
# Step 1: Create Exam
POST http://localhost:5000/api/exams
Body: {
  "title": "Midterm Exam",
  "course": "COURSE_ID",
  "date": "2026-03-01",
  "maxMarks": 100,
  "examType": "Midterm"
}

# Step 2: Enter Grades
POST http://localhost:5000/api/grades
Body: {
  "student": "STUDENT_ID",
  "exam": "EXAM_ID",
  "marksObtained": 85
}

# Step 3: Publish Results
POST http://localhost:5000/api/exams/EXAM_ID/publish
```

---

## File Structure

```
college-erp/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic (11 controllers)
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose models (13 models)
│   ├── routes/          # API routes (11 route files)
│   ├── .env            # Environment variables
│   ├── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (15+)
│   │   ├── slices/      # Redux slices (9 slices)
│   │   ├── services/    # API service layer
│   │   ├── App.js       # Main app with routing
│   │   └── store.js     # Redux store
│   ├── public/
│   ├── .env            # Environment variables
│   └── package.json
├── README.md
├── SETUP_GUIDE.md
└── INTERMEDIATE_FLOW_DIAGRAM.md
```

---

## Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:**
1. Check if MongoDB is running: `mongod --version`
2. Verify MONGO_URI in `backend/.env`
3. Try: `mongodb://localhost:27017/college_erp`

### Issue: JWT token invalid
**Solution:**
1. Clear localStorage in browser
2. Login again
3. Verify JWT_SECRET is set in backend/.env

### Issue: CORS errors
**Solution:**
1. Check ALLOWED_ORIGINS in backend/.env
2. Should include: `http://localhost:3000`
3. Restart backend server

### Issue: API calls return 404
**Solution:**
1. Verify backend is running on port 5000
2. Check REACT_APP_API_URL in frontend/.env
3. Should be: `http://localhost:5000/api`

---

## Useful Scripts

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Check MongoDB Connection
```bash
mongo
show dbs
use college_erp
show collections
```

### Clear Browser Data
```javascript
// In browser console
localStorage.clear()
location.reload()
```

---

## Development Tips

1. **Always check logs**
   - Backend: Check terminal running `npm run dev`
   - Frontend: Check browser console (F12)

2. **Use Redux DevTools**
   - Install Redux DevTools extension
   - Monitor state changes in real-time

3. **API Testing**
   - Use Postman or Insomnia
   - Import endpoints from documentation
   - Save tokens for authenticated requests

4. **Database Inspection**
   - Use MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Browse collections and documents

---

## Quick Links

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:5000/health
- **API Docs**: See `backend/README.md`
- **Component Docs**: See `frontend/FRONTEND_IMPLEMENTATION.md`

---

## Status: ✅ 100% COMPLETE

All features implemented and tested. Ready for production deployment!

---

**Last Updated**: February 2026

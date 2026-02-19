# College ERP System - Backend Setup

## Overview
College ERP Backend - Intermediate Level Market Product with comprehensive features for managing college operations including students, courses, attendance, grades, assignments, fees, and more.

## Technology Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting, Mongo Sanitize

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd College_ERP_MERN/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the `.env.example` file to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

### 4. Configure Environment Variables
Edit the `.env` file and update the following critical values:

```env
# Database
MONGO_URI=mongodb://localhost:27017/college_erp

# JWT Secret (Generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email (if using email notifications)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
```

**To generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 6. Run the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## Project Structure

```
backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/              # Request handlers (to be created)
│   ├── userController.js
│   ├── studentController.js
│   ├── courseController.js
│   └── ...
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access control
│   ├── errorHandler.js       # Error handling
│   └── validationMiddleware.js # Request validation
├── models/
│   ├── User.js
│   ├── Student.js
│   ├── Course.js
│   ├── Department.js
│   ├── Attendance.js
│   ├── Exam.js
│   ├── Grade.js
│   ├── Assignment.js
│   ├── Submission.js
│   ├── FeeStructure.js
│   ├── FeePayment.js
│   ├── Timetable.js
│   └── Notification.js
├── routes/                   # API routes (to be created)
│   ├── userRoutes.js
│   ├── studentRoutes.js
│   └── ...
├── .env                      # Environment variables
├── .env.example              # Environment template
├── server.js                 # App entry point
└── package.json
```

## API Endpoints

### Authentication
```
POST   /api/users/register    - Register new user
POST   /api/users/login       - User login
GET    /api/users/me          - Get current user
```

### Students
```
GET    /api/students          - Get all students
POST   /api/students          - Create student
GET    /api/students/:id      - Get student by ID
PUT    /api/students/:id      - Update student
DELETE /api/students/:id      - Delete student
```

### Courses
```
GET    /api/courses           - Get all courses
POST   /api/courses           - Create course
GET    /api/courses/:id       - Get course by ID
PUT    /api/courses/:id       - Update course
DELETE /api/courses/:id       - Delete course
```

### Departments
```
GET    /api/departments       - Get all departments
POST   /api/departments       - Create department
GET    /api/departments/:id   - Get department by ID
PUT    /api/departments/:id   - Update department
DELETE /api/departments/:id   - Delete department
```

### Attendance
```
GET    /api/attendance        - Get attendance records
POST   /api/attendance        - Mark attendance
GET    /api/attendance/student/:id - Get student attendance
GET    /api/attendance/course/:id  - Get course attendance
GET    /api/attendance/reports     - Attendance reports
```

### Exams & Grades
```
GET    /api/exams             - Get all exams
POST   /api/exams             - Create exam
GET    /api/exams/:id         - Get exam by ID
PUT    /api/exams/:id         - Update exam
DELETE /api/exams/:id         - Delete exam

GET    /api/grades            - Get all grades
POST   /api/grades            - Add grade
GET    /api/grades/student/:id - Get student grades
```

### Assignments
```
GET    /api/assignments       - Get all assignments
POST   /api/assignments       - Create assignment
GET    /api/assignments/:id   - Get assignment by ID
PUT    /api/assignments/:id   - Update assignment
DELETE /api/assignments/:id   - Delete assignment
```

### Fees
```
GET    /api/fees              - Get fee structures
POST   /api/fees              - Create fee structure
GET    /api/fees/student/:id  - Get student fees
POST   /api/fees/payment      - Record payment
```

### Timetable
```
GET    /api/timetable         - Get timetables
POST   /api/timetable         - Create timetable
GET    /api/timetable/student/:id - Get student timetable
GET    /api/timetable/teacher/:id - Get teacher timetable
```

### Notifications
```
GET    /api/notifications     - Get notifications
POST   /api/notifications     - Create notification
PUT    /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id - Delete notification
```

## Database Models

### User
- Authentication and authorization
- Roles: student, teacher, admin

### Student
- Student information and profile
- Links to courses, department, attendance

### Course
- Course details, credits, syllabus
- Teacher assignment and enrollment

### Department
- Department information
- HOD assignment

### Attendance
- Daily attendance tracking
- Status: Present, Absent, Late, Excused

### Exam & Grade
- Exam creation and grading
- GPA/CGPA calculation
- Report card generation

### Assignment & Submission
- Assignment creation and distribution
- Student submissions
- Grading and feedback

### Fee Management
- Fee structure and components
- Payment tracking
- Receipt generation

### Timetable
- Class schedules
- Room and teacher allocation
- Conflict detection

### Notification
- System-wide announcements
- Role-based notifications
- Read/unread tracking

## Security Features

### Implemented
✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ Role-based access control
✅ Input validation (Joi)
✅ XSS protection
✅ NoSQL injection prevention
✅ CORS configuration
✅ Security headers (Helmet)
✅ Rate limiting (optional)

### Best Practices
- Never commit `.env` file
- Use strong JWT secrets
- Regularly update dependencies
- Implement HTTPS in production
- Set up proper CORS origins
- Enable rate limiting in production

## Error Handling
The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Success responses:
```json
{
  "success": true,
  "data": { ... }
}
```

## Development

### Available Scripts
```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
```

### Testing API
Use tools like Postman, Insomnia, or Thunder Client to test the API endpoints.

### Database Seeding
Create a seed script to populate initial data (admin user, departments, etc.)

## Next Steps

### Phase 1: Complete Controllers and Routes
1. Create all missing controllers
2. Implement all route handlers
3. Add proper authentication and authorization
4. Test all endpoints

### Phase 2: Additional Features
1. File upload functionality (multer + AWS S3/Cloudinary)
2. Email notifications (nodemailer)
3. PDF generation for reports
4. Excel export functionality
5. Dashboard analytics

### Phase 3: Frontend Integration
1. Update frontend API endpoints
2. Implement new features in React
3. Add proper error handling
4. Implement loading states

### Phase 4: Testing & Deployment
1. Write unit tests
2. Write integration tests
3. Set up CI/CD
4. Deploy to production

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- Verify network connectivity

### JWT Authentication Error
- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure proper Bearer token format

### Port Already in Use
```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

## Support
For issues and questions, please refer to the documentation or create an issue in the repository.

## License
MIT License - See LICENSE file for details

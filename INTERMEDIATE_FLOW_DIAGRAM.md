# College ERP - Intermediate Level Flow Diagram

## System Overview
This document outlines the architecture and flow for an **Intermediate Market-Ready** College ERP System.

---

## 1. System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INTERMEDIATE COLLEGE ERP SYSTEM                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION LAYER                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────┐          ┌─────────────────────┐                    │
│  │ User Login │────────▶│  JWT Authentication  │                    │
│  │  (Email +  │          │  - Token Generation  │                    │
│  │  Password) │          │  - Token Validation  │                    │
│  └────────────┘          │  - Session Mgmt      │                    │
│                          │  - Password Hashing  │                    │
│                          └──────────┬───────────┘                    │
│                                     │                                 │
│                          ┌──────────▼───────────┐                    │
│                          │  Role-Based Access   │                    │
│                          │  Control (RBAC)      │                    │
│                          └──────────┬───────────┘                    │
│                                     │                                 │
└─────────────────────────────────────┼─────────────────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
        ┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
        │  ADMIN PORTAL  │   │ TEACHER PORTAL │   │ STUDENT PORTAL │
        └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
                │                    │                     │
                │                    │                     │
┌───────────────▼────────────────────▼─────────────────────▼───────────┐
│                         APPLICATION LAYER                             │
│                      (Core Business Logic)                            │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. User Role Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USER ROLES                                  │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          ADMIN DASHBOARD                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ User Management  │  │ Dept Management  │  │ System Settings │  │
│  │ • Add Students   │  │ • Add Depts      │  │ • Academic Year │  │
│  │ • Add Teachers   │  │ • Assign HODs    │  │ • Semesters     │  │
│  │ • Add Staff      │  │ • Dept Resources │  │ • Fee Structure │  │
│  │ • Edit/Delete    │  │ • View Reports   │  │ • Notifications │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Course Mgmt      │  │ Timetable Mgmt   │  │ Fee Management  │  │
│  │ • Create Courses │  │ • Create Schedule│  │ • Set Fee       │  │
│  │ • Assign Teachers│  │ • Room Alloc     │  │ • Track Payment │  │
│  │ • Set Syllabus   │  │ • Conflict Check │  │ • Generate Bill │  │
│  │ • Enrollment     │  │ • Publish        │  │ • View Reports  │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ Reports & Stats  │  │ Announcements    │                        │
│  │ • Attendance Rep │  │ • Post Notices   │                        │
│  │ • Grade Reports  │  │ • Send Alerts    │                        │
│  │ • Fee Reports    │  │ • Broadcast Msg  │                        │
│  │ • Analytics      │  │ • Event Calendar │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        TEACHER DASHBOARD                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ My Courses       │  │ Attendance Mgmt  │  │ Grade Management│  │
│  │ • View Courses   │  │ • Mark Attendance│  │ • Create Exams  │  │
│  │ • Course Content │  │ • View Reports   │  │ • Enter Marks   │  │
│  │ • Syllabus       │  │ • Export Data    │  │ • View Analytics│  │
│  │ • Enrolled List  │  │ • Send Alerts    │  │ • Grade Cards   │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Assignment Mgmt  │  │ My Timetable     │  │ Student Info    │  │
│  │ • Create Tasks   │  │ • View Schedule  │  │ • View Students │  │
│  │ • Set Deadlines  │  │ • Room Details   │  │ • Performance   │  │
│  │ • View Submiss.  │  │ • Exam Schedule  │  │ • Contact Info  │  │
│  │ • Grade & Feedback│ │ • Events        │  │ • Attendance    │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ Messaging        │  │ Notifications    │                        │
│  │ • Student Msgs   │  │ • System Alerts  │                        │
│  │ • Parent Comm.   │  │ • Announcements  │                        │
│  │ • Announcements  │  │ • Reminders      │                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        STUDENT DASHBOARD                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ My Courses       │  │ Attendance       │  │ Grades & Marks  │  │
│  │ • Enrolled List  │  │ • View Status    │  │ • View Marks    │  │
│  │ • Course Content │  │ • Percentage     │  │ • GPA/CGPA      │  │
│  │ • Syllabus       │  │ • Subject-wise   │  │ • Report Cards  │  │
│  │ • Teachers       │  │ • Alerts         │  │ • Grade Trends  │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Assignments      │  │ My Timetable     │  │ Fee Details     │  │
│  │ • View Tasks     │  │ • Class Schedule │  │ • Fee Structure │  │
│  │ • Upload Submit. │  │ • Exam Schedule  │  │ • Payment Status│  │
│  │ • Deadlines      │  │ • Room Details   │  │ • Pay Online    │  │
│  │ • View Grades    │  │ • Events         │  │ • Receipts      │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐                        │
│  │ Notifications    │  │ Profile          │                        │
│  │ • Announcements  │  │ • Personal Info  │                        │
│  │ • Alerts         │  │ • Change Password│                        │
│  │ • Messages       │  │ • Upload Photo   │                        │
│  │ • Events         │  │ • Contact Details│                        │
│  └──────────────────┘  └──────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Module Flow Diagrams

### 3.1 Attendance Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ATTENDANCE MANAGEMENT FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

TEACHER WORKFLOW:
┌──────────────┐
│  Teacher     │
│  Login       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Select Course│
│ & Class Date │
└──────┬───────┘
       │
       ▼
┌─────────────────┐
│ View Student    │
│ List (Enrolled) │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Mark Attendance     │
│ • Present           │
│ • Absent            │
│ • Late              │
│ • Excused           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────┐
│ Submit to DB    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ System Processes:       │
│ • Calculate Percentage  │
│ • Check Threshold (<75%)│
│ • Send Alerts if Low    │
└─────────────────────────┘

STUDENT WORKFLOW:
┌──────────────┐
│  Student     │
│  Login       │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ View Attendance  │
│ Dashboard        │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────┐
│ Display:                │
│ • Overall %             │
│ • Subject-wise %        │
│ • Monthly Trend         │
│ • Alert if Low          │
└─────────────────────────┘

DATABASE SCHEMA:
Attendance {
  _id: ObjectId
  student: ObjectId (ref: Student)
  course: ObjectId (ref: Course)
  date: Date
  status: Enum [Present, Absent, Late, Excused]
  markedBy: ObjectId (ref: Teacher)
  createdAt: Timestamp
}
```

### 3.2 Grade Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      GRADE MANAGEMENT FLOW                           │
└─────────────────────────────────────────────────────────────────────┘

TEACHER WORKFLOW:
┌──────────────┐
│ Create Exam  │
│ • Name       │
│ • Date       │
│ • Max Marks  │
│ • Weightage  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ Assign to Course │
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ Enter Marks for │
│ Each Student    │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│ System Calculates:      │
│ • Individual %          │
│ • Grade (A/B/C/D/F)     │
│ • Class Average         │
│ • Rank                  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────┐
│ Publish Results │
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│ Notify Students     │
│ (Email/In-app)      │
└─────────────────────┘

ADMIN WORKFLOW:
┌──────────────────┐
│ Generate Reports │
│ • Term-wise      │
│ • Semester-wise  │
│ • Annual         │
└──────┬───────────┘
       │
       ▼
┌─────────────────────┐
│ Calculate GPA/CGPA  │
│ for all Students    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Generate Transcripts│
│ & Report Cards      │
└─────────────────────┘

STUDENT WORKFLOW:
┌──────────────┐
│ View Grades  │
└──────┬───────┘
       │
       ▼
┌────────────────────────┐
│ Display:               │
│ • Exam-wise Marks      │
│ • Subject Grades       │
│ • Semester GPA         │
│ • Cumulative CGPA      │
│ • Download Report Card │
└────────────────────────┘

DATABASE SCHEMA:
Exam {
  _id: ObjectId
  name: String
  course: ObjectId (ref: Course)
  date: Date
  maxMarks: Number
  weightage: Number
  type: Enum [Quiz, Midterm, Final, Assignment]
}

Grade {
  _id: ObjectId
  student: ObjectId (ref: Student)
  exam: ObjectId (ref: Exam)
  marksObtained: Number
  grade: String [A+, A, B+, B, C, D, F]
  remarks: String
  publishedAt: Date
}
```

### 3.3 Fee Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       FEE MANAGEMENT FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

ADMIN WORKFLOW - Setup:
┌──────────────────┐
│ Create Fee       │
│ Structure        │
│ • Tuition Fee    │
│ • Lab Fee        │
│ • Library Fee    │
│ • Other Fees     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Assign to        │
│ • Department     │
│ • Semester       │
│ • Student Type   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate Fee for │
│ All Students     │
└──────────────────┘

ADMIN WORKFLOW - Tracking:
┌──────────────────┐
│ View Payments    │
│ • Pending        │
│ • Paid           │
│ • Overdue        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Mark Manual      │
│ Payment          │
│ (Cash/Cheque)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate Receipt │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Send Reminders   │
│ for Overdue      │
└──────────────────┘

STUDENT WORKFLOW:
┌──────────────┐
│ View Fee     │
│ Details      │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ Display:           │
│ • Total Amount     │
│ • Paid Amount      │
│ • Pending Amount   │
│ • Due Date         │
└──────┬─────────────┘
       │
       ▼
┌──────────────────┐
│ Pay Online       │
│ (if integrated)  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Payment Gateway  │
│ Processing       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Update DB Status │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Generate &       │
│ Download Receipt │
└──────────────────┘

DATABASE SCHEMA:
FeeStructure {
  _id: ObjectId
  name: String
  academicYear: String
  semester: Number
  department: ObjectId
  components: [{
    name: String
    amount: Number
  }]
  totalAmount: Number
}

FeePayment {
  _id: ObjectId
  student: ObjectId (ref: Student)
  feeStructure: ObjectId (ref: FeeStructure)
  amountPaid: Number
  paymentMode: Enum [Cash, Card, UPI, Cheque]
  transactionId: String
  paidAt: Date
  receiptNumber: String
  status: Enum [Pending, Paid, Overdue, Partial]
}
```

### 3.4 Assignment Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ASSIGNMENT MANAGEMENT FLOW                        │
└─────────────────────────────────────────────────────────────────────┘

TEACHER WORKFLOW:
┌──────────────────┐
│ Create Assignment│
│ • Title          │
│ • Description    │
│ • Attach Files   │
│ • Max Marks      │
│ • Deadline       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Assign to Course │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Publish to       │
│ Students         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Send Notification│
└──────────────────┘

STUDENT WORKFLOW:
┌──────────────────┐
│ View Assignments │
│ • Pending        │
│ • Submitted      │
│ • Graded         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Download Files   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Upload Submission│
│ (PDF/Doc/etc)    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Submit before    │
│ Deadline         │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│ System Records:      │
│ • Submission Time    │
│ • Late Status        │
└──────────────────────┘

TEACHER GRADING:
┌──────────────────┐
│ View Submissions │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Download Student │
│ Files            │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Enter Marks &    │
│ Feedback         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Publish Grades   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Notify Students  │
└──────────────────┘

DATABASE SCHEMA:
Assignment {
  _id: ObjectId
  title: String
  description: String
  course: ObjectId (ref: Course)
  teacher: ObjectId (ref: Teacher)
  attachments: [String] (file URLs)
  maxMarks: Number
  deadline: Date
  publishedAt: Date
}

Submission {
  _id: ObjectId
  assignment: ObjectId (ref: Assignment)
  student: ObjectId (ref: Student)
  files: [String] (file URLs)
  submittedAt: Date
  isLate: Boolean
  marks: Number
  feedback: String
  gradedAt: Date
}
```

---

## 4. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────┘

CLIENT SIDE (React):
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌──────────────┐         ┌──────────────┐        ┌─────────────┐ │
│  │   UI Layer   │────────▶│ Redux Store  │───────▶│ Local       │ │
│  │ (Components) │         │ (State Mgmt) │        │ Storage     │ │
│  └──────┬───────┘         └──────┬───────┘        └─────────────┘ │
│         │                        │                                  │
│         │                        │                                  │
│  ┌──────▼────────────────────────▼──────┐                          │
│  │     Axios HTTP Client                │                          │
│  │     (API Calls with JWT Token)       │                          │
│  └──────────────┬───────────────────────┘                          │
│                 │                                                    │
└─────────────────┼────────────────────────────────────────────────────┘
                  │
                  │ HTTPS
                  │
┌─────────────────▼────────────────────────────────────────────────────┐
│                         SERVER SIDE (Node.js)                        │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE LAYER                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │  │
│  │  │ CORS        │  │ Body Parser │  │ Auth Middleware      │ │  │
│  │  │ Handler     │  │ (JSON)      │  │ (JWT Verification)   │ │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────────┘ │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐ │  │
│  │  │ Error       │  │ Validation  │  │ Rate Limiter         │ │  │
│  │  │ Handler     │  │ Middleware  │  │ (Optional)           │ │  │
│  │  └─────────────┘  └─────────────┘  └──────────────────────┘ │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────▼──────────────────────────────────┐  │
│  │                       ROUTES LAYER                            │  │
│  │  /api/users     /api/students    /api/courses                │  │
│  │  /api/attendance /api/grades     /api/assignments            │  │
│  │  /api/fees      /api/timetable   /api/notifications          │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────▼──────────────────────────────────┐  │
│  │                    CONTROLLERS LAYER                          │  │
│  │  Business Logic / Request Processing                          │  │
│  │  • Data Validation                                            │  │
│  │  • Business Rules                                             │  │
│  │  • Response Formatting                                        │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
│  ┌───────────────────────────▼──────────────────────────────────┐  │
│  │                      MODELS LAYER                             │  │
│  │  Mongoose Schemas:                                            │  │
│  │  User, Student, Teacher, Course, Attendance, Grade,           │  │
│  │  Assignment, Fee, Notification, Timetable                     │  │
│  └───────────────────────────┬──────────────────────────────────┘  │
│                              │                                      │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                       DATABASE LAYER                                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    MongoDB Database                          │    │
│  │                                                               │    │
│  │  Collections:                                                │    │
│  │  • users         • students       • courses                  │    │
│  │  • attendance    • grades         • assignments              │    │
│  │  • fees          • notifications  • timetables               │    │
│  │  • departments   • semesters      • exams                    │    │
│  │                                                               │    │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                 Redis Cache (Optional)                       │    │
│  │  • Session Storage                                           │    │
│  │  • Frequently Accessed Data                                  │    │
│  │  • Rate Limiting Counters                                    │    │
│  └───────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                                 │
├───────────────────────────────────────────────────────────────────────┤
│  • Email Service (SendGrid/Nodemailer)                                │
│  • File Storage (AWS S3 / Cloudinary)                                 │
│  • Payment Gateway (Stripe/Razorpay) - Optional                       │
│  • SMS Gateway (Twilio) - Optional                                    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technology Stack

### Frontend
- **Framework:** React 18.3+
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **UI Library:** Material-UI (MUI) v6 / Ant Design
- **HTTP Client:** Axios
- **Form Handling:** Formik + Yup
- **Charts:** Recharts / Chart.js
- **Date Handling:** date-fns / moment.js

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** JavaScript / TypeScript (Recommended)
- **Authentication:** JWT (jsonwebtoken) + bcryptjs
- **Validation:** Joi / express-validator
- **File Upload:** Multer
- **Email:** Nodemailer / SendGrid
- **Documentation:** Swagger/OpenAPI

### Database
- **Primary DB:** MongoDB 6.0+
- **ODM:** Mongoose
- **Cache:** Redis (Optional)

### DevOps
- **Version Control:** Git
- **Hosting:** AWS / DigitalOcean / Heroku
- **File Storage:** AWS S3 / Cloudinary
- **CI/CD:** GitHub Actions / Jenkins

---

## 6. Security Features

```
┌───────────────────────────────────────────────────────────────┐
│                    SECURITY IMPLEMENTATION                     │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Authentication & Authorization                             │
│     • JWT Token with expiration                                │
│     • Password hashing (bcrypt salt rounds: 12)                │
│     • Role-based access control (RBAC)                         │
│     • Protected routes with middleware                         │
│                                                                │
│  2. Input Validation                                           │
│     • Request body validation (Joi/Yup)                        │
│     • Sanitization (express-validator)                         │
│     • XSS protection (helmet.js)                               │
│     • SQL injection prevention (Mongoose)                      │
│                                                                │
│  3. Rate Limiting                                              │
│     • express-rate-limit                                       │
│     • Login attempt limiting                                   │
│     • API endpoint throttling                                  │
│                                                                │
│  4. HTTPS & CORS                                               │
│     • SSL/TLS encryption                                       │
│     • CORS configuration                                       │
│     • Secure headers (helmet)                                  │
│                                                                │
│  5. File Upload Security                                       │
│     • File type validation                                     │
│     • File size limits                                         │
│     • Virus scanning (optional)                                │
│     • Secure storage (S3/Cloudinary)                           │
│                                                                │
│  6. Session Management                                         │
│     • Token refresh mechanism                                  │
│     • Logout functionality                                     │
│     • Session timeout                                          │
│                                                                │
│  7. Error Handling                                             │
│     • No sensitive data in errors                              │
│     • Logging (Winston/Morgan)                                 │
│     • Monitoring & alerts                                      │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. API Structure Example

```
BASE URL: https://api.collegeerp.com

AUTHENTICATION:
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - User login
POST   /api/auth/logout          - User logout
GET    /api/auth/me              - Get current user
POST   /api/auth/forgot-password - Password recovery

USERS:
GET    /api/users                - Get all users (Admin)
GET    /api/users/:id            - Get user by ID
PUT    /api/users/:id            - Update user
DELETE /api/users/:id            - Delete user

STUDENTS:
GET    /api/students             - Get all students (Paginated)
POST   /api/students             - Add new student
GET    /api/students/:id         - Get student by ID
PUT    /api/students/:id         - Update student
DELETE /api/students/:id         - Delete student
GET    /api/students/:id/courses - Get student courses
GET    /api/students/:id/grades  - Get student grades

COURSES:
GET    /api/courses              - Get all courses
POST   /api/courses              - Create new course
GET    /api/courses/:id          - Get course by ID
PUT    /api/courses/:id          - Update course
DELETE /api/courses/:id          - Delete course
GET    /api/courses/:id/students - Get enrolled students

ATTENDANCE:
GET    /api/attendance           - Get attendance records
POST   /api/attendance           - Mark attendance
GET    /api/attendance/student/:id - Get student attendance
GET    /api/attendance/course/:id  - Get course attendance
PUT    /api/attendance/:id       - Update attendance
GET    /api/attendance/reports   - Generate reports

GRADES:
GET    /api/grades               - Get all grades
POST   /api/grades               - Add grade
GET    /api/grades/student/:id   - Get student grades
GET    /api/grades/course/:id    - Get course grades
PUT    /api/grades/:id           - Update grade
GET    /api/grades/reports       - Generate grade reports

ASSIGNMENTS:
GET    /api/assignments          - Get all assignments
POST   /api/assignments          - Create assignment
GET    /api/assignments/:id      - Get assignment
PUT    /api/assignments/:id      - Update assignment
DELETE /api/assignments/:id      - Delete assignment
POST   /api/assignments/:id/submit - Submit assignment
GET    /api/assignments/:id/submissions - Get submissions

FEES:
GET    /api/fees                 - Get fee records
POST   /api/fees                 - Create fee structure
GET    /api/fees/student/:id     - Get student fees
POST   /api/fees/payment         - Record payment
GET    /api/fees/reports         - Fee reports

TIMETABLE:
GET    /api/timetable            - Get timetables
POST   /api/timetable            - Create timetable
GET    /api/timetable/student/:id - Student timetable
GET    /api/timetable/teacher/:id - Teacher timetable

NOTIFICATIONS:
GET    /api/notifications        - Get notifications
POST   /api/notifications        - Create notification
PUT    /api/notifications/:id/read - Mark as read
DELETE /api/notifications/:id   - Delete notification
```

---

## 8. Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE RELATIONSHIPS                       │
└─────────────────────────────────────────────────────────────────┘

User (1) ────────── (M) Student
  │                       │
  │                       │
  │                   (M) │ (M)
  │                       │
  │                   Enrollment
  │                       │
  │                   (M) │ (M)
  │                       │
  └─────── (M)        Course ───── (M) Assignment
              │          │              │
              │      (M) │ (M)      (M) │ (M)
              │          │              │
          Teacher    Attendance    Submission
              │          │
          (1) │      (M) │ (M)
              │          │
          Department   Grade
              │          │
              │      (M) │ (M)
              │          │
          Timetable    Exam
              │
          (M) │ (M)
              │
           Room
```

---

## 9. Implementation Priority

### Phase 1 (Week 1-2): Foundation
- Fix existing bugs
- Implement proper authentication middleware
- Add input validation
- Error handling
- Create all controllers

### Phase 2 (Week 3-4): Core Features
- Attendance system
- Grade management
- Assignment module

### Phase 3 (Week 5-6): Administrative
- Fee management
- Timetable system
- Department setup

### Phase 4 (Week 7-8): Communication
- Notification system
- Messaging
- Email integration

### Phase 5 (Week 9-10): Polish
- Reports & analytics
- File upload functionality
- UI/UX improvements
- Testing & deployment

---

## 10. Success Metrics

### For Intermediate Product:
- ✅ 90%+ uptime
- ✅ < 2 second page load time
- ✅ Support 500+ concurrent users
- ✅ Mobile responsive design
- ✅ Data backup daily
- ✅ Security audit passed
- ✅ 95%+ user satisfaction

---

**End of Intermediate Level Flow Diagram**

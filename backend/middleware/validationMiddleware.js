// middleware/validationMiddleware.js
const Joi = require('joi');
const { ErrorResponse } = require('./errorHandler');

// Wrapper function to validate request body
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ErrorResponse(errorMessage, 400));
    }

    next();
  };
};

// Validation schemas
const validationSchemas = {
  // User Registration
  userRegister: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(30),
    role: Joi.string().valid('student', 'teacher', 'admin').default('student')
  }),

  // User Login
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Student
  student: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    rollNumber: Joi.string().required(),
    department: Joi.string(),
    semester: Joi.number().integer().min(1).max(8),
    courses: Joi.array().items(Joi.string())
  }),

  // Course
  course: Joi.object({
    title: Joi.string().required().min(2).max(100),
    courseCode: Joi.string().required(),
    description: Joi.string().allow('').max(500),
    department: Joi.string(),
    semester: Joi.number().integer().min(1).max(8),
    credits: Joi.number().integer().min(1).max(6),
    teacher: Joi.string()
  }),

  // Attendance
  attendance: Joi.object({
    student: Joi.string().required(),
    course: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('Present', 'Absent', 'Late', 'Excused').required(),
    remarks: Joi.string().allow('').max(200)
  }),

  // Grade
  grade: Joi.object({
    student: Joi.string().required(),
    exam: Joi.string().required(),
    marksObtained: Joi.number().required().min(0),
    remarks: Joi.string().allow('').max(200)
  }),

  // Exam
  exam: Joi.object({
    name: Joi.string().required().min(2).max(100),
    course: Joi.string().required(),
    date: Joi.date().required(),
    maxMarks: Joi.number().required().min(1),
    weightage: Joi.number().min(0).max(100),
    type: Joi.string().valid('Quiz', 'Midterm', 'Final', 'Assignment', 'Project').required()
  }),

  // Assignment
  assignment: Joi.object({
    title: Joi.string().required().min(2).max(100),
    description: Joi.string().required(),
    course: Joi.string().required(),
    maxMarks: Joi.number().required().min(1),
    deadline: Joi.date().required(),
    attachments: Joi.array().items(Joi.string())
  }),

  // Fee
  feeStructure: Joi.object({
    name: Joi.string().required(),
    academicYear: Joi.string().required(),
    semester: Joi.number().integer().min(1).max(8),
    department: Joi.string(),
    components: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        amount: Joi.number().required().min(0)
      })
    ).required(),
    totalAmount: Joi.number().required().min(0)
  }),

  // Department
  department: Joi.object({
    name: Joi.string().required().min(2).max(100),
    code: Joi.string().required().min(2).max(10),
    hod: Joi.string(),
    description: Joi.string().allow('').max(500)
  }),

  // Timetable
  timetable: Joi.object({
    course: Joi.string().required(),
    day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    room: Joi.string().required(),
    teacher: Joi.string().required(),
    semester: Joi.number().integer().min(1).max(8)
  }),

  // Notification
  notification: Joi.object({
    title: Joi.string().required().min(2).max(100),
    message: Joi.string().required(),
    type: Joi.string().valid('info', 'warning', 'success', 'error').default('info'),
    recipients: Joi.array().items(Joi.string()),
    recipientRole: Joi.string().valid('all', 'student', 'teacher', 'admin')
  })
};

module.exports = { validate, validationSchemas };

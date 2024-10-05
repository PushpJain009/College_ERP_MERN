const express = require("express");
const router = express.Router();
const Student = require("../models/Student"); // Assuming you have a Student model

// @route   GET /api/students
// @desc    Get all students
// @access  Public
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/students
// @desc    Add a new student
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, course } = req.body;

  try {
    const newStudent = new Student({
      name,
      email,
      course,
    });

    const savedStudent = await newStudent.save();
    res.json(savedStudent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/students/:id
// @desc    Get a student by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student by ID
// @access  Public
router.put("/:id", async (req, res) => {
  const { name, email, course } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.course = course || student.course;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.remove();
    res.json({ message: "Student removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); // Assuming you have a Course model

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/courses
// @desc    Add a new course
// @access  Public
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCourse = new Course({
      name,
      description,
    });

    const savedCourse = await newCourse.save();
    res.json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a course by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course by ID
// @access  Public
router.put("/:id", async (req, res) => {
  const { name, description } = req.body;

  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.name = name || course.name;
    course.description = description || course.description;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course by ID
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.remove();
    res.json({ message: "Course removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

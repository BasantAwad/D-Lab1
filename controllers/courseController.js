const Course = require('../models/Course');
const { body, validationResult } = require('express-validator');

class CourseController {
  // Validation rules
  static createValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('instructor').notEmpty().withMessage('Instructor is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer')
  ];

  static updateValidation = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('instructor').optional().notEmpty().withMessage('Instructor cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer')
  ];

  // Get all courses (public)
  static getAllCourses(req, res) {
    Course.getAll((err, courses) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(courses);
    });
  }

  // Get course by ID (public)
  static getCourseById(req, res) {
    const { id } = req.params;
    Course.findById(id, (err, course) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    });
  }

  // Create new course (admin only)
  static createCourse(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    Course.create(req.body, (err, course) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create course' });
      }
      res.status(201).json(course);
    });
  }

  // Update course (admin only)
  static updateCourse(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    Course.update(id, req.body, (err, course) => {
      if (err) {
        if (err.message === 'Course not found') {
          return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Failed to update course' });
      }
      res.json(course);
    });
  }

  // Delete course (admin only)
  static deleteCourse(req, res) {
    const { id } = req.params;
    Course.delete(id, (err, result) => {
      if (err) {
        if (err.message === 'Course not found') {
          return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Failed to delete course' });
      }
      res.json(result);
    });
  }
}

module.exports = CourseController;
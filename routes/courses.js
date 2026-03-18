const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);

// Admin only routes
router.post('/', authenticateToken, authorizeRole('admin'), CourseController.createValidation, CourseController.createCourse);
router.put('/:id', authenticateToken, authorizeRole('admin'), CourseController.updateValidation, CourseController.updateCourse);
router.delete('/:id', authenticateToken, authorizeRole('admin'), CourseController.deleteCourse);

module.exports = router;
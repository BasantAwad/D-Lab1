const express = require('express');
const router = express.Router();
const EnrollmentController = require('../controllers/enrollmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Student routes
router.post('/:courseId/enroll', authenticateToken, EnrollmentController.enrollInCourse);
router.delete('/:courseId/unenroll', authenticateToken, EnrollmentController.unenrollFromCourse);
router.get('/my-enrollments', authenticateToken, EnrollmentController.getUserEnrollments);

// Admin routes
router.get('/', authenticateToken, authorizeRole('admin'), EnrollmentController.getAllEnrollments);

module.exports = router;
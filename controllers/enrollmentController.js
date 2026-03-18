const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

class EnrollmentController {
  // Enroll in a course (students only)
  static enrollInCourse(req, res) {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    Course.findById(courseId, (err, course) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      Enrollment.enroll(userId, courseId, (err, enrollment) => {
        if (err) {
          if (err.message === 'User already enrolled in this course') {
            return res.status(400).json({ error: err.message });
          }
          return res.status(500).json({ error: 'Failed to enroll' });
        }
        res.status(201).json({ message: 'Enrolled successfully', enrollment });
      });
    });
  }

  // Get user's enrollments (authenticated users)
  static getUserEnrollments(req, res) {
    const userId = req.user.id;
    Enrollment.getByUser(userId, (err, enrollments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(enrollments);
    });
  }

  // Get all enrollments (admin only)
  static getAllEnrollments(req, res) {
    Enrollment.getAll((err, enrollments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(enrollments);
    });
  }

  // Unenroll from course (students only)
  static unenrollFromCourse(req, res) {
    const { courseId } = req.params;
    const userId = req.user.id;

    Enrollment.unenroll(userId, courseId, (err, result) => {
      if (err) {
        if (err.message === 'Enrollment not found') {
          return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Failed to unenroll' });
      }
      res.json(result);
    });
  }
}

module.exports = EnrollmentController;
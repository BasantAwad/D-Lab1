const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

class DashboardController {
  // Get dashboard statistics (admin only)
  static getStats(req, res) {
    // Get enrollment stats
    Enrollment.getStats((err, enrollmentStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get total courses count
      Course.getAll((err, courses) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Get total users count
        User.getAll((err, users) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const stats = {
            totalCourses: courses.length,
            totalStudents: enrollmentStats.total_students || 0,
            totalUsers: users.length,
            totalRevenue: enrollmentStats.total_revenue || 0,
            totalEnrollments: enrollmentStats.total_courses ? enrollmentStats.total_courses : 0
          };

          res.json(stats);
        });
      });
    });
  }

  // Get recent enrollments (admin only)
  static getRecentEnrollments(req, res) {
    Enrollment.getAll((err, enrollments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      // Return last 10 enrollments
      const recent = enrollments.slice(0, 10);
      res.json(recent);
    });
  }
}

module.exports = DashboardController;
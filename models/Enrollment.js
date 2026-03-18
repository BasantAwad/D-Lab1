const db = require('../config/database');

class Enrollment {
  // Enroll user in course
  static enroll(userId, courseId, callback) {
    // Check if already enrolled
    const checkSql = `SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?`;
    db.query(checkSql, [userId, courseId], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        return callback(new Error('User already enrolled in this course'));
      }

      // Enroll
      const sql = `INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)`;
      db.query(sql, [userId, courseId], (err, result) => {
        if (err) {
          return callback(err);
        }
        callback(null, { id: result.insertId, userId, courseId });
      });
    });
  }

  // Get enrollments for user
  static getByUser(userId, callback) {
    const sql = `
      SELECT e.id, e.enrolled_at, c.title, c.description, c.instructor, c.price, c.duration
      FROM enrollments e
      INNER JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  // Get all enrollments (admin)
  static getAll(callback) {
    const sql = `
      SELECT e.id, e.enrolled_at, u.username, u.email, c.title, c.price
      FROM enrollments e
      INNER JOIN users u ON e.user_id = u.id
      INNER JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `;
    db.query(sql, [], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  // Get enrollment stats
  static getStats(callback) {
    const sql = `
      SELECT
        COUNT(DISTINCT e.user_id) as total_students,
        COUNT(DISTINCT e.course_id) as total_courses,
        SUM(c.price) as total_revenue
      FROM enrollments e
      INNER JOIN courses c ON e.course_id = c.id
    `;
    db.query(sql, [], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0]);
    });
  }

  // Unenroll user from course
  static unenroll(userId, courseId, callback) {
    const sql = `DELETE FROM enrollments WHERE user_id = ? AND course_id = ?`;
    db.query(sql, [userId, courseId], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('Enrollment not found'));
      }
      callback(null, { message: 'Unenrolled successfully' });
    });
  }
}

module.exports = Enrollment;
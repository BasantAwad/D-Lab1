const db = require('../config/database');

class Course {
  // Create a new course
  static create(courseData, callback) {
    const { title, description, instructor, price, duration } = courseData;

    const sql = `INSERT INTO courses (title, description, instructor, price, duration) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [title, description, instructor, price, duration], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, { id: result.insertId, title, description, instructor, price, duration });
    });
  }

  // Get all courses
  static getAll(callback) {
    const sql = `SELECT * FROM courses ORDER BY created_at DESC`;
    db.query(sql, [], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  // Find course by ID
  static findById(id, callback) {
    const sql = `SELECT * FROM courses WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0] || null);
    });
  }

  // Update course
  static update(id, courseData, callback) {
    const { title, description, instructor, price, duration } = courseData;
    const sql = `UPDATE courses SET title = ?, description = ?, instructor = ?, price = ?, duration = ? WHERE id = ?`;
    db.query(sql, [title, description, instructor, price, duration, id], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('Course not found'));
      }
      callback(null, { id, title, description, instructor, price, duration });
    });
  }

  // Delete course
  static delete(id, callback) {
    const sql = `DELETE FROM courses WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.affectedRows === 0) {
        return callback(new Error('Course not found'));
      }
      callback(null, { message: 'Course deleted successfully' });
    });
  }

  // Get courses by user enrollment
  static getEnrolledCourses(userId, callback) {
    const sql = `
      SELECT c.* FROM courses c
      INNER JOIN enrollments e ON c.id = e.course_id
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
}

module.exports = Course;
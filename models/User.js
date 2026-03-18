const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static create(userData, callback) {
    const { username, email, password, role } = userData;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`;
    db.query(sql, [username, email, hashedPassword, role], (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, { id: result.insertId, username, email, role });
    });
  }

  // Find user by email
  static findByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0] || null);
    });
  }

  // Find user by ID
  static findById(id, callback) {
    const sql = `SELECT id, username, email, role, created_at FROM users WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0] || null);
    });
  }

  // Get all users (admin only)
  static getAll(callback) {
    const sql = `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`;
    db.query(sql, [], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  // Verify password
  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}

module.exports = User;
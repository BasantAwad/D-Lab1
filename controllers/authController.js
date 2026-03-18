const User = require('../models/User');
const db = require('../config/database');
const JWTUtils = require('../utils/jwt');
const { body, validationResult } = require('express-validator');

class AuthController {
  // Validation rules
  static registerValidation = [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'student']).withMessage('Role must be admin or student')
  ];

  static loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').exists().withMessage('Password is required')
  ];

  // Register new user
  static register(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      User.create({ username, email, password, role }, (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const token = JWTUtils.generateToken({ id: user.id, username: user.username, email: user.email, role: user.role });
        res.status(201).json({
          message: 'User registered successfully',
          user: { id: user.id, username: user.username, email: user.email, role: user.role },
          token
        });
      });
    });
  }

  // Login user
  static login(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!User.verifyPassword(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = JWTUtils.generateToken({ id: user.id, username: user.username, email: user.email, role: user.role });
      res.json({
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token
      });
    });
  }

  // Get current user profile
  static getProfile(req, res) {
    User.findById(req.user.id, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    });
  }

  // Get all users (admin only)
  static getAllUsers(req, res) {
    User.getAll((err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(users);
    });
  }

  // Delete user (admin only)
  static deleteUser(req, res) {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    User.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Delete user (you might want to add a soft delete instead)
      const sql = `DELETE FROM users WHERE id = ?`;
      db.query(sql, [userId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete user' });
        }
        res.json({ message: 'User deleted successfully' });
      });
    });
  }
}

module.exports = AuthController;
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.registerValidation, AuthController.register);
router.post('/login', AuthController.loginValidation, AuthController.login);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

// Admin routes
router.get('/users', authenticateToken, authorizeRole('admin'), AuthController.getAllUsers);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), AuthController.deleteUser);

module.exports = router;
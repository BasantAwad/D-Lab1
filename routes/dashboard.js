const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Admin only routes
router.get('/stats', authenticateToken, authorizeRole('admin'), DashboardController.getStats);
router.get('/recent-enrollments', authenticateToken, authorizeRole('admin'), DashboardController.getRecentEnrollments);

module.exports = router;
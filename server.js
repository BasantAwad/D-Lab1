require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Import database configuration
require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const dashboardRoutes = require('./routes/dashboard');

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Logger middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const time = Number(end - start) / 1000000; // milliseconds
    console.log(`${req.method} ${req.url} ${res.statusCode} ${time.toFixed(2)}ms`);
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve HTML files
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(__dirname + '/admin-dashboard.html');
});

app.get('/admin-panel', (req, res) => {
  res.sendFile(__dirname + '/admin-panel.html');
});

app.get('/student-portal', (req, res) => {
  res.sendFile(__dirname + '/student-portal.html');
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Course Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Course Management API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
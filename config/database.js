const mysql = require('mysql2');

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'course_management',
  port: process.env.DB_PORT || 3306
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
    console.log('Please make sure MySQL is running and the database exists.');
    console.log('You can create the database in phpMyAdmin or MySQL Workbench.');
    return;
  }
  console.log('Connected to MySQL database.');
  initializeDatabase();
});

// Initialize database tables
function initializeDatabase() {
  const queries = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'student') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Courses table
    `CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      instructor VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      duration INT NOT NULL COMMENT 'in hours',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // Enrollments table
    `CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      UNIQUE KEY unique_enrollment (user_id, course_id)
    )`
  ];

  // Execute all table creation queries
  let completed = 0;
  queries.forEach((query, index) => {
    db.query(query, (err) => {
      if (err) {
        console.error(`Error creating table ${index + 1}:`, err.message);
      } else {
        completed++;
        if (completed === queries.length) {
          console.log('Database tables initialized.');
        }
      }
    });
  });
}

module.exports = db;
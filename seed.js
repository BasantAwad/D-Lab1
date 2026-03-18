const db = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');

// Seed data
const seedData = () => {
  console.log('Seeding database...');

  // Create admin user
  User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }, (err, user) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin:', err);
      }
    } else {
      console.log('Admin user created:', user);
    }

    // Create sample courses
    const courses = [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the fundamentals of JavaScript programming',
        instructor: 'John Doe',
        price: 99.99,
        duration: 40
      },
      {
        title: 'Advanced React Development',
        description: 'Master React hooks, context, and advanced patterns',
        instructor: 'Jane Smith',
        price: 149.99,
        duration: 60
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js',
        instructor: 'Bob Johnson',
        price: 129.99,
        duration: 50
      }
    ];

    let completed = 0;
    courses.forEach((course) => {
      Course.create(course, (err, createdCourse) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log(`Course "${course.title}" already exists`);
          } else {
            console.error('Error creating course:', err);
          }
        } else {
          console.log('Course created:', createdCourse.title);
        }
        completed++;
        if (completed === courses.length) {
          console.log('Seeding completed!');
          process.exit(0);
        }
      });
    });
  });
};

// Run seeding
seedData();
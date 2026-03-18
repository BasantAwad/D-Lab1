# Course Management API

A secure RESTful API for managing courses using the MVVM (Model–View–ViewModel) architectural pattern with JWT authentication and role-based access control.

## Database Setup

This application uses **MySQL** with **phpMyAdmin** for database management.

### Quick Setup with XAMPP
1. **Install XAMPP**: Download from https://www.apachefriends.org/ and install
2. **Start XAMPP**: Run XAMPP Control Panel as Administrator
3. **Start MySQL**: Click "Start" next to MySQL module
4. **Access phpMyAdmin**: Click "Admin" or visit http://localhost/phpmyadmin
5. **Create Database**: In phpMyAdmin, create database named `course_management`
6. **Install Dependencies**: `npm install`
7. **Seed Database**: `npm run seed`
8. **Start Server**: `npm start`

See `MYSQL_SETUP.md` for detailed instructions.

## Features

- **MVVM Architecture**: Clear separation of concerns with Models, ViewModels (Controllers), and Views (JSON responses)
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and Student roles with different permissions
- **MySQL Database**: Persistent data storage with phpMyAdmin management
- **Password Hashing**: Secure password storage using bcrypt
- **Admin Dashboard**: Analytics and insights for administrators

## Setup

1. Install dependencies: `npm install`
2. Seed the database with initial data: `npm run seed`
3. Start the server: `npm start`
4. Server runs on http://localhost:3000

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "admin"
}
```

#### POST /api/auth/login
Login and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

### Courses

#### GET /api/courses
Get all courses (public).

#### GET /api/courses/:id
Get course by ID (public).

#### POST /api/courses
Create new course (admin only).
```json
{
  "title": "Course Title",
  "description": "Course description",
  "instructor": "Instructor Name",
  "price": 99.99,
  "duration": 40
}
```

#### PUT /api/courses/:id
Update course (admin only).

#### DELETE /api/courses/:id
Delete course (admin only).

### Enrollments

#### POST /api/enrollments/:courseId/enroll
Enroll in a course (authenticated users).

#### DELETE /api/enrollments/:courseId/unenroll
Unenroll from a course (authenticated users).

#### GET /api/enrollments/my-enrollments
Get user's enrollments (authenticated users).

#### GET /api/enrollments
Get all enrollments (admin only).

### Dashboard (Admin Only)

#### GET /api/dashboard/stats
Get dashboard statistics:
- Total courses
- Total students (enrolled)
- Total users
- Total revenue
- Total enrollments

#### GET /api/dashboard/recent-enrollments
Get recent enrollments (admin only).

## Sample Data

After running `npm run seed`, the following data is available:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Sample Courses:**
- Introduction to JavaScript ($99.99)
- Advanced React Development ($149.99)
- Node.js Backend Development ($129.99)

## Testing with Postman

1. **Register/Login** to get a JWT token
2. **Set Authorization**: In Postman, go to Authorization tab, select "Bearer Token" and paste your token
3. **Test endpoints** based on your role permissions

## Architecture Overview

### Models (Data Layer)
- `User.js`: User management and authentication
- `Course.js`: Course CRUD operations
- `Enrollment.js`: Enrollment management

### Controllers (Business Logic Layer)
- `authController.js`: Authentication logic
- `courseController.js`: Course management
- `enrollmentController.js`: Enrollment operations
- `dashboardController.js`: Admin analytics

### Routes (Presentation Layer)
- Organized route handlers with middleware
- Input validation using express-validator

### Middleware
- JWT authentication
- Role-based authorization
- Request logging

## Security Features

- Password hashing with bcrypt
- JWT token expiration
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
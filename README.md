# Course Management System

A full-stack Course Management System built with Express.js, MySQL, and JWT authentication. Features a responsive web interface with role-based access control for administrators and students.

## 🚀 Features

### Backend (API)
- **MVVM Architecture**: Clear separation of concerns with Models, Controllers, and JSON responses
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **MySQL Database**: Persistent data storage with connection pooling
- **Password Hashing**: Secure password storage using bcrypt
- **Input Validation**: Request validation using express-validator
- **CORS Support**: Cross-origin resource sharing for frontend integration

### Frontend (Web Interface)
- **Unified Login Page**: Single entry point that redirects based on user role
- **Admin Dashboard**: Analytics and statistics overview
- **Admin Panel**: Complete course and student management interface
- **Student Portal**: Course browsing, enrollment, and progress tracking
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Real-time Updates**: Immediate UI feedback for enrollments and changes

### User Roles & Permissions
- **Admin**: Full system access, course management, user management, analytics
- **Student**: Course browsing, enrollment management, personal dashboard

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with mysql2 driver
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Icons**: Font Awesome
- **Validation**: express-validator
- **Development**: XAMPP (MySQL), npm

## 📋 Prerequisites

- Node.js (v14 or higher)
- XAMPP (for MySQL database)
- Git

## 🚀 Quick Start

### 1. Database Setup with XAMPP
1. **Install XAMPP**: Download from https://www.apachefriends.org/
2. **Start XAMPP**: Run as Administrator, start MySQL module
3. **Access phpMyAdmin**: Visit http://localhost/phpmyadmin
4. **Create Database**: Create database named `course_management`

### 2. Application Setup
```bash
# Clone or navigate to project directory
cd D-Lab1

# Install dependencies
npm install

# Seed database with sample data
npm run seed

# Start the server
npm start
```

### 3. Access the Application
- **Main Entry Point**: http://localhost:3001/login
- **Health Check**: http://localhost:3001/api/health

## 👥 Default Users

After running `npm run seed`, you can login with:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Sample Student:**
- Email: `student@example.com`
- Password: `student123`

## 🎯 Application Workflow

1. **Login**: Visit `/login` and enter credentials
2. **Role-based Redirect**:
   - Admin → Admin Panel (`/admin-panel`)
   - Student → Student Portal (`/student-portal`)
3. **Admin Features**:
   - View dashboard statistics
   - Manage courses (CRUD operations)
   - Manage students
   - View enrollment analytics
4. **Student Features**:
   - Browse available courses
   - Enroll/unenroll from courses
   - View enrollment history
   - Track progress

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
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

### Course Endpoints

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

### Enrollment Endpoints

#### POST /api/enrollments/:courseId/enroll
Enroll in a course (authenticated users).

#### DELETE /api/enrollments/:courseId/unenroll
Unenroll from a course (authenticated users).

#### GET /api/enrollments/my-enrollments
Get user's enrollments (authenticated users).

#### GET /api/enrollments
Get all enrollments (admin only).

### Dashboard Endpoints (Admin Only)

#### GET /api/dashboard/stats
Get dashboard statistics.

#### GET /api/dashboard/recent-enrollments
Get recent enrollments.

## 🧪 Testing

### Manual Testing
1. Start the server: `npm start`
2. Open browser to http://localhost:3001/login
3. Test admin and student workflows
4. Use browser developer tools for API inspection

### API Testing with Postman
1. Login to get JWT token
2. Set Authorization header: `Bearer <token>`
3. Test endpoints based on role permissions

## 📁 Project Structure

```
D-Lab1/
├── config/
│   └── database.js          # MySQL connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── courseController.js  # Course management
│   ├── enrollmentController.js # Enrollment operations
│   └── dashboardController.js # Admin analytics
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Course.js            # Course model
│   └── Enrollment.js        # Enrollment model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── courses.js           # Course routes
│   ├── enrollments.js       # Enrollment routes
│   └── dashboard.js         # Dashboard routes
├── admin-dashboard.html     # Admin statistics page
├── admin-panel.html         # Admin management interface
├── student-portal.html      # Student interface
├── login.html               # Unified login page
├── server.js                # Main application server
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Secure token storage in localStorage

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive design with Font Awesome icons
- **Real-time Feedback**: Immediate UI updates for user actions
- **Role-specific Interfaces**: Tailored experiences for admins and students
- **Unified Access**: Single login page with automatic redirection

## 🚀 Deployment

### Local Development
```bash
npm install
npm run seed
npm start
```

### Production Deployment
1. Set environment variables in `.env`
2. Configure production database
3. Use process manager like PM2
4. Set up reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues
- **Port 3001 in use**: Kill existing process or change port in server.js
- **Database connection failed**: Ensure XAMPP MySQL is running
- **CORS errors**: Check CORS configuration in server.js
- **Login issues**: Verify database is seeded with sample users

### Support
- Check server logs for error details
- Verify database connectivity
- Test API endpoints individually
- Use browser developer tools for frontend debugging
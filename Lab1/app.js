const express = require('express');
const app = express();
const port = 3000;

// ==========================================
// 2. Students Data (In-Memory)
// ==========================================
let students = [
  { id: 1, name: 'Alice Smith', gpa: 3.8 },
  { id: 2, name: 'Bob Johnson', gpa: 2.9 },
  { id: 3, name: 'Charlie Brown', gpa: 3.5 }
];
let nextId = 4; // To keep track of IDs for new students

// ==========================================
// 3. Middleware
// ==========================================

// a) JSON Middleware to parse request bodies
app.use(express.json());

// b) Logger Middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const timeInMs = Number(end - start) / 1000000;
    console.log(`[LOGGER] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${timeInMs.toFixed(2)}ms`);
  });
  
  next();
});

// c) Authentication Middleware
const authMiddleware = (req, res, next) => {
  // Only protect routes that start with /api
  if (req.path.startsWith('/api')) {
    const apiKey = req.headers['x-api-key'];
    
    // Check if key is provided and equals '123'
    if (!apiKey || apiKey !== '123') {
      return res.status(401).json({ error: 'Unauthorized: Invalid or missing x-api-key header' });
    }
  }
  next();
};

// Apply auth middleware
app.use(authMiddleware);

// ==========================================
// d) API Routes (Multi Routes Required)
// ==========================================

// 1. GET /api/students -> Returns all students
app.get('/api/students', (req, res) => {
  // Returns only id, name, and gpa (currently that's all there is, but mapping ensures only these return)
  const result = students.map(s => ({
    id: s.id,
    name: s.name,
    gpa: s.gpa
  }));
  res.json(result);
});

// 2. GET /api/students/:id -> Returns a single student by ID
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// 3. POST /api/students -> Adds a new student
app.post('/api/students', (req, res) => {
  const { name, gpa } = req.body;
  
  if (!name || gpa === undefined) {
    // Basic validation
    return res.status(400).json({ error: 'Name and GPA are required in the request body' });
  }
  
  const newStudent = {
    id: nextId++,
    name,
    gpa
  };
  
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// 4. DELETE /api/students/:id -> Deletes a student by ID
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex(s => s.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

// 5. PUT /api/students/:id -> Replaces the entire student object
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, gpa } = req.body;
  
  if (!name || gpa === undefined) {
    return res.status(400).json({ error: 'Both name and gpa are required for a PUT request' });
  }
  
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Replace the object
  students[index] = { id, name, gpa };
  res.json(students[index]);
});

// 6. PATCH /api/students/:id -> Updates only the provided fields
app.patch('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, gpa } = req.body;
  
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  // Update fields if provided
  if (name !== undefined) student.name = name;
  if (gpa !== undefined) student.gpa = gpa;
  
  res.json(student);
});

// ==========================================
// Start Server
// ==========================================
app.listen(port, () => {
  console.log(`Lab 1 Server is running at http://localhost:${port}`);
  console.log('Remember to pass headers: { "x-api-key": "123" } for testing /api/students endpoints.');
});

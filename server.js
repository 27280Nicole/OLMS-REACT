// server.js
// A small Node.js/Express server, the same pattern as Part 1's server.js.
// It does NOT serve the React app itself (Vite's dev server does that,
// on port 5173) — this server's only job is to read and write the real
// JSON files in public/data/, since a browser isn't allowed to write to
// files on disk, but Node.js is. The React app talks to this through
// requests to /api/..., which vite.config.js forwards here automatically.

// This project's package.json has "type": "module", which means .js files
// here use the modern "import" syntax instead of require(). __dirname
// isn't automatically available in this mode, so we rebuild it ourselves
// from import.meta.url (the two lines below do that).

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 4000;

const USERS_FILE = path.join(__dirname, 'public', 'data', 'users.json');
const ENROLLMENTS_FILE = path.join(__dirname, 'public', 'data', 'enrollments.json');

app.use(express.json());

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

app.post('/api/register', function (req, res) {
  const { username, password, role, name, email } = req.body || {};

  if (!username || !password || !role || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const users = readJsonFile(USERS_FILE);

  const alreadyExists = users.some(function (u) { return u.email === email; });
  if (alreadyExists) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  users.push({ username, password, role, name, email });
  writeJsonFile(USERS_FILE, users);

  res.status(201).json({ message: 'User registered.' });
});

app.post('/api/enroll', function (req, res) {
  const { email, courseId } = req.body || {};

  if (!email || !courseId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const enrollments = readJsonFile(ENROLLMENTS_FILE);

  const alreadyEnrolled = enrollments.some(function (e) {
    return e.email === email && e.courseId === courseId;
  });

  if (!alreadyEnrolled) {
    enrollments.push({ email: email, courseId: courseId, progress: 0 });
    writeJsonFile(ENROLLMENTS_FILE, enrollments);
  }

  res.status(201).json({ message: 'Enrollment saved.' });
});

const COURSES_FILE = path.join(__dirname, 'public', 'data', 'courses.json');

// POST /api/courses — an instructor adds a new course.
app.post('/api/courses', function (req, res) {
  const { title, level, duration, instructor } = req.body || {};

  if (!title || !level || !duration || !instructor) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const courses = readJsonFile(COURSES_FILE);
  const nextId = courses.reduce(function (max, c) { return Math.max(max, c.id); }, 0) + 1;

  const newCourse = {
    id: nextId,
    title: title,
    level: level,
    duration: duration,
    students: 0,
    instructor: instructor
  };

  courses.push(newCourse);
  writeJsonFile(COURSES_FILE, courses);

  res.status(201).json(newCourse);
});

app.listen(PORT, function () {
  console.log('API server running at http://localhost:' + PORT);
});

// Helpers for the "dummy database": seed accounts from a JSON file,
// plus anything saved for real through our Express API server
// (server.js), with localStorage as a fallback if that server isn't
// running (e.g. previewing a production build with no API attached).

const DATA = import.meta.env.BASE_URL + 'data/';

export async function fetchJson(fileName) {
  const response = await fetch(DATA + fileName);
  if (!response.ok) throw new Error('Could not load ' + fileName);
  return response.json();
}

export async function getAllUsers() {
  const seedUsers = await fetchJson('users.json');
  const registered = JSON.parse(localStorage.getItem('olms_registered_users') || '[]');
  return seedUsers.concat(registered);
}

// Saves a newly registered user. Tries the real API server first
// (server.js writes it straight into public/data/users.json), and only
// falls back to localStorage if that request fails.
export async function saveNewUser(user) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Server rejected the request');
  } catch (err) {
    const registered = JSON.parse(localStorage.getItem('olms_registered_users') || '[]');
    registered.push(user);
    localStorage.setItem('olms_registered_users', JSON.stringify(registered));
  }
}

// ----- Enrollments -----
// Seed enrollments come from public/data/enrollments.json.
// A new enrollment is written for real through the API server, with the
// same localStorage fallback pattern as saveNewUser above.

function getLocalEnrollments() {
  return JSON.parse(localStorage.getItem('olms_enrollments') || '[]');
}

// Every enrollment for one student (seed + newly enrolled), no duplicates.
export async function getEnrollmentsFor(email) {
  const seed = await fetchJson('enrollments.json');
  const mine = seed.concat(getLocalEnrollments()).filter((e) => e.email === email);

  const seen = new Set();
  return mine.filter((e) => {
    if (seen.has(e.courseId)) return false;
    seen.add(e.courseId);
    return true;
  });
}

// Saves a brand-new enrollment (progress starts at 0%).
export async function saveEnrollment(email, courseId) {
  try {
    const response = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, courseId }),
    });
    if (!response.ok) throw new Error('Server rejected the request');
  } catch (err) {
    const local = getLocalEnrollments();
    local.push({ email, courseId, progress: 0 });
    localStorage.setItem('olms_enrollments', JSON.stringify(local));
  }
}

// ----- Courses -----
// Seed courses come from public/data/courses.json. A course an instructor
// adds is written for real through the API server, with the same
// localStorage fallback pattern as everything else above.

function getLocallyAddedCourses() {
  return JSON.parse(localStorage.getItem('olms_added_courses') || '[]');
}

export async function getAllCourses() {
  const seedCourses = await fetchJson('courses.json');
  return seedCourses.concat(getLocallyAddedCourses());
}

export async function addCourse(course) {
  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    if (!response.ok) throw new Error('Server rejected the request');
    return response.json();
  } catch (err) {
    const allCourses = await getAllCourses();
    const nextId = allCourses.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    const newCourse = { id: nextId, students: 0, ...course };

    const local = getLocallyAddedCourses();
    local.push(newCourse);
    localStorage.setItem('olms_added_courses', JSON.stringify(local));
    return newCourse;
  }
}

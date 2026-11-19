import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllCourses, addCourse } from '../utils/storage.js';

const EMPTY_FORM = { title: '', level: '', duration: '' };

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [status, setStatus] = useState('loading');

  const [form, setForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadMyCourses = useCallback(() => {
    setStatus('loading');
    getAllCourses()
      .then((courses) => {
        setMyCourses(courses.filter((c) => c.instructor === user.name));
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [user.name]);

  useEffect(() => {
    loadMyCourses();
  }, [loadMyCourses]);

  const totalStudents = myCourses.reduce((sum, c) => sum + c.students, 0);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.title.trim().length < 3 || !form.level || form.duration.trim().length < 2) {
      setFeedback({ text: 'Please fill in a title, level, and duration.', type: 'error' });
      return;
    }

    setSubmitting(true);
    await addCourse({
      title: form.title.trim(),
      level: form.level,
      duration: form.duration.trim(),
      instructor: user.name,
    });
    setSubmitting(false);

    setFeedback({ text: 'Course added!', type: 'success' });
    setForm(EMPTY_FORM);
    loadMyCourses(); // refresh the list + stats to include the new course
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Here's an overview of your teaching activity.</p>
      </div>

      <main>
        <section>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-number">{myCourses.length}</div>
              <div className="stat-label">Courses Taught</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalStudents.toLocaleString()}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>
        </section>

        <section>
          <h2>Your Courses</h2>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'error' && <p>Sorry, your courses could not be loaded.</p>}
          {status === 'ready' && myCourses.length === 0 && (
            <p>You are not teaching any courses yet. Add your first one below.</p>
          )}
          {status === 'ready' && myCourses.length > 0 && (
            <div className="card-grid">
              {myCourses.map((course) => (
                <article className="card course-card" key={course.id}>
                  <span className="level">{course.level}</span>
                  <h3>{course.title}</h3>
                  <div className="meta">
                    <span>{course.duration}</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="form-box">
            <h2>Add a New Course</h2>
            <p className="form-subtext">Create a course and it will appear under your courses and in the catalog.</p>

            {feedback.text && <p className={'form-message ' + feedback.type}>{feedback.text}</p>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="title">Course Title</label>
                <input
                  type="text" id="title" name="title" placeholder="e.g. Intro to Cybersecurity"
                  value={form.title} onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="level">Level</label>
                <select id="level" name="level" value={form.level} onChange={handleChange}>
                  <option value="">Select a level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="duration">Duration</label>
                <input
                  type="text" id="duration" name="duration" placeholder="e.g. 6 weeks"
                  value={form.duration} onChange={handleChange}
                />
              </div>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Course'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

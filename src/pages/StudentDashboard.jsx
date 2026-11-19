import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllCourses, getEnrollmentsFor } from '../utils/storage.js';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    Promise.all([getAllCourses(), getEnrollmentsFor(user.email)])
      .then(([courses, enrollments]) => {
        const mine = enrollments
          .map((e) => ({ ...e, course: courses.find((c) => c.id === e.courseId) }))
          .filter((e) => e.course);
        setEnrolled(mine);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [user.email]);

  return (
    <>
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Here's where you left off.</p>
      </div>

      <main>
        <section>
          <h2>Your Enrolled Courses</h2>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'error' && <p>Sorry, your courses could not be loaded.</p>}
          {status === 'ready' && enrolled.length === 0 && (
            <p>
              You are not enrolled in any courses yet.{' '}
              <Link to="/courses">Browse courses</Link> to get started.
            </p>
          )}
          {status === 'ready' && enrolled.length > 0 && (
            <div className="card-grid">
              {enrolled.map((e) => (
                <article className="card course-card" key={e.courseId}>
                  <h3>{e.course.title}</h3>
                  <p>Instructor: {e.course.instructor}</p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: e.progress + '%' }}></div>
                  </div>
                  <p className="progress-label">{e.progress}% complete</p>
                </article>
              ))}
            </div>
          )}
          <Link to="/courses" className="section-link">Browse more courses &rarr;</Link>
        </section>
      </main>
    </>
  );
}

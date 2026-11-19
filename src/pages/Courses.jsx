import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAllCourses, getEnrollmentsFor, saveEnrollment } from '../utils/storage.js';

export default function Courses() {
  const { user } = useAuth();
  const isStudent = user && user.role === 'student';

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [status, setStatus] = useState('loading');
  const [justEnrolled, setJustEnrolled] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    const loads = [getAllCourses()];
    if (isStudent) loads.push(getEnrollmentsFor(user.email));

    Promise.all(loads)
      .then(([courseList, mine]) => {
        setCourses(courseList);
        setEnrolledIds(mine ? mine.map((e) => e.courseId) : []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [isStudent, user?.email]);

  // async because saveEnrollment() now waits on a real request to the
  // API server, instead of an instant localStorage write.
  async function handleEnroll(course) {
    setEnrollingId(course.id);
    await saveEnrollment(user.email, course.id);
    setEnrolledIds((ids) => [...ids, course.id]);
    setJustEnrolled(course);
    setEnrollingId(null);
  }

  function renderAction(course) {
    if (!user) return <Link to="/login" className="btn-enroll">Log in to enroll</Link>;
    if (!isStudent) return null;
    if (enrolledIds.includes(course.id)) return <span className="enrolled-badge">Enrolled</span>;
    return (
      <button
        type="button"
        className="btn-enroll"
        disabled={enrollingId === course.id}
        onClick={() => handleEnroll(course)}
      >
        {enrollingId === course.id ? 'Enrolling...' : 'Enroll'}
      </button>
    );
  }

  return (
    <main>
      <section id="courses-intro">
        <h1>Explore Our Courses</h1>
        <p>Browse a growing catalog of courses across technology, business, and design.</p>
      </section>

      <section>
        {justEnrolled && (
          <p className="form-message success">
            You are now enrolled in <strong>{justEnrolled.title}</strong>.{' '}
            <Link to="/student-dashboard">Go to your dashboard</Link>
          </p>
        )}

        {status === 'loading' && <p>Loading courses...</p>}
        {status === 'error' && <p>Sorry, courses could not be loaded right now.</p>}
        {status === 'ready' && (
          <div className="card-grid">
            {courses.map((course) => (
              <article className="card course-card" key={course.id}>
                <span className="level">{course.level}</span>
                <h3>{course.title}</h3>
                <p>Taught by {course.instructor}</p>
                <div className="meta">
                  <span>{course.duration}</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="enroll-area">{renderAction(course)}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

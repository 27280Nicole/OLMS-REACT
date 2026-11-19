import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  { icon: '\u{1F4DA}', title: 'Interactive Courses', text: 'Learn through videos, quizzes, and hands-on assignments designed by industry experts.' },
  { icon: '\u{1F4C8}', title: 'Progress Tracking', text: "See exactly how far you've come with a personal dashboard for every course you take." },
  { icon: '\u{1F393}', title: 'Certificates', text: 'Earn a shareable certificate of completion for every course you finish.' },
  { icon: '\u{1F468}\u200D\u{1F3EB}', title: 'Expert Instructors', text: 'Courses are taught by qualified instructors with real industry experience.' },
  { icon: '\u231B', title: 'Flexible Learning', text: 'Study at your own pace, on your own schedule, from any device.' },
  { icon: '\u{1F4AC}', title: '24/7 Support', text: 'Our support team and community forums are available whenever you need help.' },
];

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { user } = useAuth();

  const greeting = user
    ? `${timeGreeting()}, ${user.name}! Welcome back.`
    : `${timeGreeting()}! Ready to start learning?`;

  return (
    <>
      <section className="hero">
        <h1>Learn anything, anytime, anywhere</h1>
        <p>{greeting}</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary">Get Started Free</Link>
          <Link to="/courses" className="btn btn-outline">Browse Courses</Link>
        </div>
      </section>

      <main>
        <section id="features">
          <h2>Why learn with us</h2>
          <div className="card-grid">
            {FEATURES.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

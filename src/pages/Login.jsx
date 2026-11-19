import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPathFor } from '../context/AuthContext.jsx';
import { useFormValidation } from '../hooks/useFormValidation.js';
import { getAllUsers } from '../utils/storage.js';
import FormField from '../components/FormField.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const errors = {};
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = 'Please enter a valid email address.';
  if (v.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  return errors;
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const form = useFormValidation({ email: '', password: '' }, validate);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    form.touchAll();

    if (!form.isValid) {
      setFeedback({ text: 'Please fix the errors below.', type: 'error' });
      return;
    }

    const allUsers = await getAllUsers();
    const match = allUsers.find(
      (u) => u.email === form.values.email.trim() && u.password === form.values.password
    );

    if (!match) {
      setFeedback({ text: 'Incorrect email or password.', type: 'error' });
      return;
    }

    setFeedback({ text: 'Login successful! Redirecting...', type: 'success' });
    login({ name: match.name, email: match.email, role: match.role });
    setTimeout(() => navigate(dashboardPathFor(match.role)), 800);
  }

  const { values, handleChange, handleBlur, errorFor } = form;

  return (
    <main>
      <section>
        <div className="form-box">
          <h2>Welcome Back</h2>
          <p className="form-subtext">Log in to continue your learning journey.</p>

          {feedback.text && <p className={'form-message ' + feedback.type}>{feedback.text}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Email Address" id="email" error={errorFor('email')}>
              <input type="email" id="email" name="email" placeholder="you@example.com"
                value={values.email} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('email') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Password" id="password" error={errorFor('password')}>
              <input type="password" id="password" name="password" placeholder="Enter your password"
                value={values.password} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('password') ? 'field-invalid' : ''} />
            </FormField>

            <button type="submit">Log In</button>
          </form>

          <p className="form-footer-link">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>

          <p className="form-subtext" style={{ marginTop: '1.5rem' }}>
            Demo accounts - Student: <strong>alice@example.com</strong> / <strong>student123</strong>,
            Instructor: <strong>bob@example.com</strong> / <strong>teach123</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

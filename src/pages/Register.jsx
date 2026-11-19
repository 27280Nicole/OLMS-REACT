import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation.js';
import { getAllUsers, saveNewUser } from '../utils/storage.js';
import FormField from '../components/FormField.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INITIAL = {
  fullname: '', email: '', phone: '', role: '',
  password: '', confirmPassword: '', terms: false,
};

function validate(v) {
  const errors = {};
  if (!/^[A-Za-z ]{2,}$/.test(v.fullname.trim())) errors.fullname = 'Letters and spaces only, minimum 2 characters.';
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!/^[0-9]{9,15}$/.test(v.phone.trim())) errors.phone = 'Digits only, 9-15 numbers.';
  if (!v.role) errors.role = 'Please choose a role.';
  if (!/^(?=.*\d)(?=.*[A-Za-z]).{8,}$/.test(v.password)) errors.password = 'At least 8 characters, with a letter and a number.';
  if (v.confirmPassword === '' || v.confirmPassword !== v.password) errors.confirmPassword = 'Passwords do not match.';
  if (!v.terms) errors.terms = 'You must agree to continue.';
  return errors;
}

export default function Register() {
  const navigate = useNavigate();
  const form = useFormValidation(INITIAL, validate);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    form.touchAll();

    if (!form.isValid) {
      setFeedback({ text: 'Please fix the errors below.', type: 'error' });
      return;
    }

    const email = form.values.email.trim();
    const allUsers = await getAllUsers();

    if (allUsers.some((u) => u.email === email)) {
      setFeedback({ text: 'An account with that email already exists. Try logging in instead.', type: 'error' });
      return;
    }

    await saveNewUser({
      username: email,
      password: form.values.password,
      role: form.values.role,
      name: form.values.fullname.trim(),
      email,
    });

    setFeedback({ text: 'Account created! Redirecting you to login...', type: 'success' });
    setTimeout(() => navigate('/login'), 1200);
  }

  const { values, handleChange, handleBlur, errorFor } = form;

  return (
    <main>
      <section>
        <div className="form-box">
          <h2>Create Your Account</h2>
          <p className="form-subtext">Join as a student or an instructor. It's free.</p>

          {feedback.text && <p className={'form-message ' + feedback.type}>{feedback.text}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Full Name" id="fullname" error={errorFor('fullname')}>
              <input type="text" id="fullname" name="fullname" placeholder="Jane Doe"
                value={values.fullname} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('fullname') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Email Address" id="email" error={errorFor('email')}>
              <input type="email" id="email" name="email" placeholder="you@example.com"
                value={values.email} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('email') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Phone Number" id="phone" error={errorFor('phone')}>
              <input type="tel" id="phone" name="phone" placeholder="0788123456"
                value={values.phone} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('phone') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="I am registering as a" id="role" error={errorFor('role')}>
              <select id="role" name="role" value={values.role}
                onChange={handleChange} onBlur={handleBlur}
                className={errorFor('role') ? 'field-invalid' : ''}>
                <option value="">Select an option</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </FormField>

            <FormField label="Password" id="password" error={errorFor('password')}>
              <input type="password" id="password" name="password" placeholder="Create a password"
                value={values.password} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('password') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Confirm Password" id="confirmPassword" error={errorFor('confirmPassword')}>
              <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password"
                value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('confirmPassword') ? 'field-invalid' : ''} />
            </FormField>

            <div className="field checkbox-field">
              <input type="checkbox" id="terms" name="terms"
                checked={values.terms} onChange={handleChange} onBlur={handleBlur} />
              <label htmlFor="terms">I agree to the Terms of Service and Privacy Policy</label>
            </div>
            <small className="error-text">{errorFor('terms')}</small>

            <button type="submit">Create Account</button>
          </form>

          <p className="form-footer-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

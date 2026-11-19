import { useState } from 'react';
import { useFormValidation } from '../hooks/useFormValidation.js';
import FormField from '../components/FormField.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!EMAIL_PATTERN.test(v.email.trim())) errors.email = 'Please enter a valid email address.';
  if (v.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters.';
  if (v.message.trim().length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const form = useFormValidation({ name: '', email: '', subject: '', message: '' }, validate);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  function handleSubmit(e) {
    e.preventDefault();
    form.touchAll();

    if (!form.isValid) {
      setFeedback({ text: 'Please fix the errors below before submitting.', type: 'error' });
      return;
    }
    setFeedback({ text: 'Thanks! Your message has been sent (demo only, not actually emailed).', type: 'success' });
    form.reset();
  }

  const { values, handleChange, handleBlur, errorFor } = form;

  return (
    <main>
      <section id="contact-info">
        <h1>Contact Us</h1>
        <address>
          <p><strong>Address:</strong> 123 Knowledge Avenue, Kigali, Rwanda</p>
          <p><strong>Telephone:</strong> <a href="tel:+250788000000">+250 788 000 000</a></p>
          <p><strong>Email:</strong> <a href="mailto:support@olms.com">support@olms.com</a></p>
        </address>
      </section>

      <section>
        <div className="form-box">
          <h2>Send Us a Message</h2>
          <p className="form-subtext">We usually reply within 1-2 business days.</p>

          {feedback.text && <p className={'form-message ' + feedback.type}>{feedback.text}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Full Name" id="name" error={errorFor('name')}>
              <input type="text" id="name" name="name" placeholder="Your name"
                value={values.name} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('name') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Email Address" id="email" error={errorFor('email')}>
              <input type="email" id="email" name="email" placeholder="you@example.com"
                value={values.email} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('email') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Subject" id="subject" error={errorFor('subject')}>
              <input type="text" id="subject" name="subject" placeholder="What is this regarding?"
                value={values.subject} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('subject') ? 'field-invalid' : ''} />
            </FormField>

            <FormField label="Message" id="message" error={errorFor('message')}>
              <textarea id="message" name="message" rows="5" placeholder="Write your message here..."
                value={values.message} onChange={handleChange} onBlur={handleBlur}
                className={errorFor('message') ? 'field-invalid' : ''} />
            </FormField>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
}

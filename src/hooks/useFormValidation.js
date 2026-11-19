import { useState } from 'react';

// Reusable form helper. Each form gives it starting values and a
// validate(values) function that returns an object like { email: 'message' }.
export function useFormValidation(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  // Only show a field's error after the user has visited it (or tried to submit).
  function errorFor(name) {
    return touched[name] ? errors[name] || '' : '';
  }

  function touchAll() {
    const all = {};
    Object.keys(initialValues).forEach((key) => { all[key] = true; });
    setTouched(all);
  }

  function reset() {
    setValues(initialValues);
    setTouched({});
  }

  return { values, isValid, handleChange, handleBlur, errorFor, touchAll, reset };
}

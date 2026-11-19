// One label + input + error message. Keeps the form pages short.
export default function FormField({ label, id, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      <small className="error-text">{error}</small>
    </div>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth, dashboardPathFor } from '../context/AuthContext.jsx';

// Wraps a page so only the right kind of user can see it.
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={dashboardPathFor(user.role)} replace />;

  return children;
}

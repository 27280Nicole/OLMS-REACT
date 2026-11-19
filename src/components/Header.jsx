import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth, dashboardPathFor } from '../context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <header>
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="logo-mark">OL</span>
          Online Learning Management System
        </Link>
        <nav>
          <ul id="nav-list">
            <li><NavLink to="/" end>Home</NavLink></li>
            <li><NavLink to="/courses">Courses</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li className="nav-auth-slot">
              {user ? (
                <>
                  <NavLink to={dashboardPathFor(user.role)}>Dashboard</NavLink>
                  <a href="#" className="btn-nav" onClick={handleLogout}>Logout</a>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register" className="btn-nav">Register</NavLink>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

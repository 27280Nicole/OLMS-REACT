import { createContext, useContext, useState } from 'react';

// Context lets any component ask "who is logged in?" without
// passing the user down through props on every page.
const AuthContext = createContext(null);

const STORAGE_KEY = 'olms_current_user';

function readStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  function login(userInfo) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userInfo));
    setUser(userInfo);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function dashboardPathFor(role) {
  return role === 'instructor' ? '/instructor-dashboard' : '/student-dashboard';
}

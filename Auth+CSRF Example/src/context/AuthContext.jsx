import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Mock auth state - stored in React state (in-memory, not persistent)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [csrfToken, setCsrfToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCsrfToken = async () => {
    try {
      const res = await fetch('/api/get_token', {
        credentials: 'include',
      });
      const data = await res.json();
      setCsrfToken(data.csrfToken);
      return data.csrfToken;
    }
    catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.isLoggedIn) {
        setIsLoggedIn(true);
        setToken(data.token);
      }
    }
    catch (err) {
      console.error('Failed to check auth status:', err);
    }
    finally {
      setIsLoading(false);
    }
  }

  // Fake login function (updated backend)
  const login = (email, password) => {
    // Simulate API call - accept any non-empty credentials
    if (email && password) {
      setIsLoggedIn(true);
      setToken('fake-jwt-token-' + Date.now());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
  };

  const value = {
    isLoggedIn,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
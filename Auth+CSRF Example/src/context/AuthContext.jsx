import { createContext, useContext, useState, useEffect } from 'react';

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
      setCsrfToken(data.csrf_token);
      return data.csrf_token;
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
  const login = async (email, password) => {
    try {
      // Ensure we have a CSRF token
      const token = csrfToken || await fetchCsrfToken();
      if (!token) {
        throw new Error('Failed to get CSRF token');
      }
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      setIsLoggedIn(true);
      setToken('jwt-token-in-cookie');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const token = csrfToken || await fetchCsrfToken();
      
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': token,
        },
        credentials: 'include',
      });
      setIsLoggedIn(false);
      setToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);
  
  const value = {
    isLoggedIn,
    token,
    isLoading,
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
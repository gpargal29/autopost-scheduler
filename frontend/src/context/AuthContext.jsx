import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('autopost_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check auth state on initial mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error('Failed to authenticate token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register Handler
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('autopost_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login Handler
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('autopost_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout Handler
  const logout = () => {
    localStorage.removeItem('autopost_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

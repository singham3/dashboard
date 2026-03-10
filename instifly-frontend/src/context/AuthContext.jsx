import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import store from '../redux/store';
import { clearUser } from '../redux/userSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const navigate = useNavigate();

  const login = (token) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    store.dispatch(clearUser());
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
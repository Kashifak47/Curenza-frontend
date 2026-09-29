// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Back to null
  const [isLoading, setIsLoading] = useState(true); // Starts true

  useEffect(() => {
    const token = localStorage.getItem('curenza_token');
    const savedUser = localStorage.getItem('curenza_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false); // Tells the app we are done checking
  }, []);

  const saveAuthData = (data) => {
    localStorage.setItem('curenza_token', data.token);
    localStorage.setItem('curenza_user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    saveAuthData(response.data);
    return response.data;
  };

  const register = async (fullName, email, password) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    saveAuthData(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('curenza_token');
    localStorage.removeItem('curenza_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
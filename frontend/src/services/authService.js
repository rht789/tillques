// src/services/authService.js

import api from './api';
import axios from 'axios';

const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const authService = {
  login,
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  setupAuthHeader: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  forgotPassword: async (email) => {
    try {
      const response = await api.post('/users/forget-password', { email });
      console.log('Forgot password response:', response);
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error.response || error);
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/users/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;

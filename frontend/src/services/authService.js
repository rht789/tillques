// src/services/authService.js

import api from './api';
import axios from 'axios';

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  setupAuthHeader: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
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

// src/services/profileService.js

import api from './api';

const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const updateUserProfile = async (updateData) => {
  const response = await api.put('/users/profile', updateData);
  return response.data;
};

export default {
  getUserProfile,
  updateUserProfile,
};

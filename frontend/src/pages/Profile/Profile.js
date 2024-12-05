// src/pages/Profile/Profile.js

import React, { useState, useEffect } from 'react';
import profileService from '../../services/profileService';
import { toast } from 'react-toastify';
import { Container, Typography, TextField, Button } from '@mui/material';
import './Profile.css'; // Ensure correct CSS path

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getUserProfile();
      setUser(data.user);
      setFormData({ username: data.user.username, email: data.user.email });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await profileService.updateUserProfile(formData);
      setUser(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Profile
      </Typography>
      {isLoading ? (
        <Typography variant="body1">Loading...</Typography>
      ) : (
        <form onSubmit={handleUpdateProfile}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          {isEditing ? (
            <>
              <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                Save Changes
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </form>
      )}
    </Container>
  );
};

export default Profile;

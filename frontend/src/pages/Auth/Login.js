// src/pages/Auth/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../../services/authService';
import logo from '../../assets/images/logo.png';
import './login.css';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        loginUser(response.data.user);
        toast.success('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.googleAuth(credentialResponse.credential);
      if (response.success) {
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        loginUser(response.data.user);
        toast.success('Login successful!');
        navigate('/home');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="login-card">
      <img src={logo} alt="QuizMaster Logo" className="logo" />
      <h2>Log In to QuizMaster</h2>

      <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast.error('Google login failed');
          }}
          size="large"
          width="300"
          text="signin_with"
          shape="rectangular"
          useOneTap={false}
          cookiePolicy={'single_host_origin'}
        />
      </div>

      <div className="divider">or</div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Link to="/forgot-password" className="forgot-password-link">
          Forgot Password?
        </Link>
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="signup-prompt">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;

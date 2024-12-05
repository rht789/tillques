// src/components/Navbar/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, PersonOutline } from '@mui/icons-material';
import logo from '../../assets/images/logo.png';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="brand">
          <img src={logo} alt="QuizMaster" className="brand-logo" />
          <span className="brand-text">QuizMaster</span>
        </Link>

        {/* Right Section */}
        <div className="nav-items">
          {/* Search Bar */}
          {isAuthenticated && (
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="search"
                placeholder="Search quizzes..."
                className="search-input"
              />
            </div>
          )}

          {isAuthenticated ? (
            // Logged in state
            <div className="auth-buttons">
              <Link 
                to="/dashboard"
                className="nav-link"
              >
                Dashboard
              </Link>
              <div className="relative">
                <button 
                  onClick={handleProfileClick}
                  className="profile-button"
                >
                  <div className="profile-circle">
                    <PersonOutline className="h-5 w-5" />
                  </div>
                </button>
                {showDropdown && (
                  <div className="profile-dropdown">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Not logged in state
            <div className="auth-buttons">
              <Link 
                to="/login"
                className="nav-link login-button"
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="signup-button"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
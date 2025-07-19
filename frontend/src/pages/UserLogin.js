// src/pages/UserLogin.js
import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const UserLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      alert(`Welcome ${result.user.displayName}`);
      navigate('/user-dashboard'); 
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      <button onClick={handleLogin} className="login-btn">Login with Google</button>
    </div>
  );
};

export default UserLogin;

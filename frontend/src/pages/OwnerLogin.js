// src/pages/OwnerLogin.js
import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const OwnerLogin = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email === "suhanasulfeekker04@gmail.com") {
        alert("Owner Login Successful");
        navigate('/owner-dashboard'); 
      } else {
        alert("Access denied. You are not the owner.");
        await auth.signOut();
      }

    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2>Owner Login</h2>
      <button onClick={handleLogin} className="login-btn">Login with Google</button>
    </div>
  );
};

export default OwnerLogin;

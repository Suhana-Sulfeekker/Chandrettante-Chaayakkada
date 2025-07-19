import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import landingImage from './assets/landingpageimage.png';
import './App.css';
import OwnerLogin from './pages/OwnerLogin';
import UserLogin from './pages/UserLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import UserDashboard from './pages/UserDashboard'

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <button className="owner-login" onClick={() => navigate('/owner-login')}>
        OWNER LOGIN
      </button>

      <div className="left-panel">
        <h1 className="main-heading">CANTEEN</h1>
        <button className="order-button" onClick={() => navigate('/user-login')}>
          ORDER NOW!!
        </button>
      </div>

      <div className="right-panel">
        <img src={landingImage} alt="Chandrettante Chaayakkada" className="landing-image" />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/owner-login" element={<OwnerLogin />} />
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
    </Routes>
  );
}

export default App;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import Logo from '../styles/wallet-icon.png';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="left-content">
        <h1 className="page-title">DompetKu</h1>
        <p className="description">
          DompetKu adalah aplikasi keuangan digital modern untuk UMKM. Kelola kasbon, reputasi, dan transaksi harianmu dengan mudah dan aman di platform berbasis blockchain.
        </p>
        <div className="button-container">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      <div className="logo-container">
        <img src={Logo} alt="DompetKu Logo" />
      </div>

      <footer className="landing-footer">
        © 2025 DompetKu. Semua Hak Dilindungi.
      </footer>
    </div>
  );
}

export default LandingPage;

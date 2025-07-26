import React, { useEffect, useState } from 'react';
import '../pages/Home.css';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyBillWave, FaUserFriends, FaHistory, FaStar,
  FaChartLine, FaExchangeAlt
} from 'react-icons/fa';
import { db, auth } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setNama(data.nama || '');
          setSaldo(data.saldo || 0);
        }
      } catch (error) {
        console.error('Gagal mengambil data user:', error);
      }
    };

    fetchUserData();
  }, []);

  const fiturList = [
    { name: 'Kasbon', icon: <FaMoneyBillWave />, path: '/kasbon', color: '#abcedfff' },
    { name: 'Transfer', icon: <FaExchangeAlt />, path: '/transfer', color: '#a0dbb6ff' },
    { name: 'Riwayat', icon: <FaHistory />, path: '/riwayat', color: '#d4c68dff' },
    { name: 'Reputasi', icon: <FaChartLine />, path: '/reputasi', color: '#e2a8c6ff' },
    { name: 'Reward', icon: <FaStar />, path: '/reward', color: '#b0a3d6ff' },
    { name: 'Teman', icon: <FaUserFriends />, path: '/teman', color: '#ebc09dff' },
  ];

  return (
    <div className="home-page">
      <div className="greeting-box">
        <h1>Selamat Datang, {nama}!</h1>
        <div className="saldo-box">
          <span>Saldo Dompet:</span>
          <h2>Rp {saldo.toLocaleString()}</h2>
        </div>
      </div>

      <div className="fitur-grid">
        {fiturList.map((fitur, index) => (
          <div
            key={index}
            className="fitur-card"
            style={{ backgroundColor: fitur.color }}
            onClick={() => navigate(fitur.path)}
          >
            <div className="icon">{fitur.icon}</div>
            <div className="text">{fitur.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

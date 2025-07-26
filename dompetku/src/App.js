import './App.css';
import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Kasbon from './pages/Kasbon';
import Transfer from './pages/Transfer';
import Riwayat from './pages/Riwayat';
import Reputasi from './pages/Reputasi';
import Reward from './pages/Reward';
import Teman from './pages/Teman';

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, nama: 'Budi', saldo: 100000, reputasi: 50 },
    { id: 2, nama: 'Ani', saldo: 50000, reputasi: 50 },
  ]);
  const [riwayat, setRiwayat] = useState([]);
  const navigate = useNavigate();

  const handleLogin = (data) => {
    setUser(data);
    navigate('/');
  };

  const handleRegister = (data) => {
    const newUser = {
      id: users.length + 1,
      saldo: 0,
      reputasi: 50,
      ...data,
    };
    setUsers([...users, newUser]);
    setUser(newUser);
    navigate('/');
  };

  const handleTransfer = (namaPenerima, jumlah) => {
    const pengirimIndex = users.findIndex((u) => u.nama === user.nama);
    const penerimaIndex = users.findIndex((u) => u.nama === namaPenerima);

    if (pengirimIndex !== -1 && penerimaIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[pengirimIndex].saldo -= jumlah;
      updatedUsers[penerimaIndex].saldo += jumlah;

      setUsers(updatedUsers);
      setUser(updatedUsers[pengirimIndex]);

      const newRiwayat = [
        ...riwayat,
        {
          type: 'transfer',
          to: namaPenerima,
          amount: jumlah,
          date: new Date().toISOString(),
        },
        {
          type: 'terima',
          from: user.nama,
          amount: jumlah,
          date: new Date().toISOString(),
        },
      ];
      setRiwayat(newRiwayat);

      alert('Transfer berhasil!');
    }
  };

  const updateReputasi = (nama, nilai) => {
    const updatedUsers = users.map((u) =>
      u.nama === nama
        ? { ...u, reputasi: (u.reputasi || 50) + nilai }
        : u
    );
    setUsers(updatedUsers);

    const updatedUser = updatedUsers.find((u) => u.nama === nama);
    setUser(updatedUser);

    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <Home user={user} /> : <Navigate to="/start" />
        }
      />
      <Route path="/start" element={<LandingPage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      <Route path="/kasbon" element={<Kasbon />} />
      <Route
        path="/transfer"
        element={
          <Transfer
            currentUser={user}
            users={users}
            onTransfer={handleTransfer}
          />
        }
      />
      <Route path="/riwayat" element={<Riwayat riwayat={riwayat} />} />
      <Route path="/reputasi" element={<Reputasi user={user} />} />
      <Route
        path="/reward"
        element={
          <Reward
            currentUser={user}
            updateReputasi={updateReputasi}
          />
        }
      />
      <Route path="/teman" element={<Teman />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

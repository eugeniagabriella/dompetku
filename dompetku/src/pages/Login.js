import React, { useState } from 'react';
import '../pages/Login.css';
import { FaSignInAlt } from 'react-icons/fa';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Login = ({ onLogin }) => {
  const [hp, setHp] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const fakeEmail = `${hp}@dompetku.fake`; // HARUS sama kayak register
      const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, password);
      const user = userCredential.user;

      // Ambil data pengguna dari Firestore
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        alert('Data pengguna tidak ditemukan.');
        return;
      }

      const userData = snapshot.docs[0].data();
      localStorage.setItem('nama', userData.nama);

      alert('Login berhasil!');
      onLogin && onLogin(userData);
    } catch (error) {
      console.error('Login error:', error.message);
      alert('Login gagal: pastikan nomor HP dan password benar.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2><FaSignInAlt /> Masuk ke DompetKu</h2>
        <form onSubmit={handleLogin}>
          <input
            type="tel"
            placeholder="Nomor HP"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Masuk</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

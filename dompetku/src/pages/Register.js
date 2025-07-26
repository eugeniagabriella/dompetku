import React, { useState } from 'react';
import '../pages/Register.css';
import { FaUserPlus } from 'react-icons/fa';
import { db, auth } from './firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const Register = ({ onRegister }) => {
  const [nama, setNama] = useState('');
  const [hp, setHp] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Cek apakah nomor HP sudah terdaftar di Firestore
      const q = query(collection(db, 'users'), where('hp', '==', hp));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert('Nomor HP sudah terdaftar!');
        return;
      }

      // Gunakan HP sebagai email tiruan untuk Firebase Auth
      const fakeEmail = `${hp}@dompetku.fake`;

      // Buat akun di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
      const user = userCredential.user;

      // Simpan data tambahan ke Firestore
      const docRef = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        nama,
        hp,
        saldo: 0,
        reputasi: 50,
      });

      // Simpan nama ke localStorage agar muncul di halaman Home
      localStorage.setItem('nama', nama);

      // Panggil callback
      onRegister && onRegister({ nama, hp, id: docRef.id });
      alert('Pendaftaran berhasil!');
    } catch (error) {
      console.error('Gagal mendaftar:', error);
      alert('Terjadi kesalahan saat mendaftar.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2><FaUserPlus /> Daftar DompetKu</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
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
          <button type="submit">Daftar</button>
        </form>
      </div>
    </div>
  );
};

export default Register;

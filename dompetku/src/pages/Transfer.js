import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import './Transfer.css';

const Transfer = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [tujuan, setTujuan] = useState('');
  const [jumlah, setJumlah] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);
      } catch (error) {
        console.error("Gagal ambil user:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    const nominal = parseInt(jumlah);

    if (!tujuan || isNaN(nominal) || nominal <= 0) {
      return alert('Input tidak valid.');
    }

    if (!currentUser) {
      return alert('Pengguna tidak ditemukan (belum login?).');
    }

    const pengirim = users.find((u) => u.uid === currentUser.uid);
    const penerima = users.find((u) => u.hp === tujuan);

    if (!pengirim) return alert('Pengirim tidak ditemukan.');
    if (!penerima) return alert('User tujuan tidak ditemukan.');
    if (pengirim.uid === penerima.uid) return alert('Tidak bisa transfer ke diri sendiri.');
    if (pengirim.saldo < nominal) return alert('Saldo tidak cukup.');

    try {
      await addDoc(collection(db, 'transfer'), {
  from: pengirim.nama,
  to: penerima.nama,
  pengirimUid: pengirim.uid,
  penerimaUid: penerima.uid,
  amount: nominal,
  tanggal: new Date().toLocaleString(),
});

      // Update saldo pengirim & penerima
      await updateDoc(doc(db, 'users', pengirim.id), {
        saldo: pengirim.saldo - nominal,
      });

      await updateDoc(doc(db, 'users', penerima.id), {
        saldo: penerima.saldo + nominal,
      });

      // Simpan ke riwayat pengirim
      await addDoc(collection(db, 'riwayat'), {
        uid: pengirim.uid,
        tipe: 'Transfer Keluar',
        deskripsi: `Ke ${penerima.nama}`,
        jumlah: -nominal,
        tanggal: new Date().toLocaleString(),
      });

      // Simpan ke riwayat penerima
      await addDoc(collection(db, 'riwayat'), {
        uid: penerima.uid,
        tipe: 'Transfer Masuk',
        deskripsi: `Dari ${pengirim.nama}`,
        jumlah: nominal,
        tanggal: new Date().toLocaleString(),
      });

      alert('Transfer berhasil!');
      setJumlah('');
      setTujuan('');
    } catch (err) {
      console.error("Gagal transfer:", err);
      alert("Terjadi kesalahan saat transfer.");
    }
  };

  return (
    <div className="page-background">
      <div className="kasbon-container">
        <div className="kasbon-header">
          <h3>Transfer Uang</h3>
        </div>

        <div className="kasbon-form">
          <input
            type="text"
            placeholder="Nomor HP penerima"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
            className="kasbon-input"
          />

          <input
            type="number"
            placeholder="Jumlah (Rp)"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="kasbon-input"
          />

          <button onClick={handleSubmit} className="kasbon-button">
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;

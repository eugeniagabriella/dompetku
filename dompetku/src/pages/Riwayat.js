import React, { useEffect, useState } from 'react';
import './Riwayat.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';

const Riwayat = () => {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('User belum login');
          return;
        }

        const q = query(
          collection(db, 'riwayat'),
          where('uid', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sorted = [...data].sort((a, b) => {
          return new Date(b.tanggal) - new Date(a.tanggal);
        });

        setRiwayat(sorted);
      } catch (error) {
        console.error('Gagal memuat riwayat:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  return (
    <div className="page-background">
      <div className="riwayat-container">
        <h2>Riwayat Transaksi</h2>
        <div className="riwayat-list">
          {loading ? (
            <p>Memuat data...</p>
          ) : riwayat.length === 0 ? (
            <p>Belum ada transaksi.</p>
          ) : (
            riwayat.map((item) => (
              <div key={item.id} className="riwayat-item">
                <p><strong>{item.tipe}</strong> - {item.deskripsi}</p>
                <p className={item.jumlah < 0 ? 'jumlah-negatif' : 'jumlah-positif'}>
                  Rp {Math.abs(item.jumlah).toLocaleString()}
                </p>
                <p className="tanggal">{item.tanggal}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Riwayat;

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import './Reward.css';
import { db, auth } from './firebase';

const Reward = () => {
  const [sudahKlaim, setSudahKlaim] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const userDoc = snapshot.docs[0];
          const data = userDoc.data();

          setUserDocId(userDoc.id);

          const today = new Date().toDateString();
          if (data.lastRewardClaim === today) {
            setSudahKlaim(true);
          }
        }
      } catch (err) {
        console.error("Gagal memuat data reward:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleKlaim = async () => {
    if (!userDocId) {
      alert("User belum terautentikasi.");
      return;
    }

    try {
      const docRef = doc(db, 'users', userDocId);

      const q = query(collection(db, 'users'), where('__name__', '==', userDocId));
      const snapshot = await getDocs(q);
      const data = snapshot.docs[0].data();
      const currentReputasi = data.reputasi ?? 50;

      await updateDoc(docRef, {
        reputasi: currentReputasi + 2,
        lastRewardClaim: new Date().toDateString(),
      });

      setSudahKlaim(true);
      alert('Reward berhasil diklaim! 🎉 Reputasimu bertambah 2 poin.');
    } catch (err) {
      console.error("Gagal klaim reward:", err);
      alert("Terjadi kesalahan saat klaim reward.");
    }
  };

  return (
    <div className="page-background">
      <div className="reward-container">
        <h2>Reward Harian</h2>
        {loading ? (
          <p className="reward-info">Memuat data...</p>
        ) : sudahKlaim ? (
          <p className="reward-info sudah">
            Kamu sudah klaim hari ini. Datang lagi besok!
          </p>
        ) : (
          <button onClick={handleKlaim} className="klaim-btn">
            🎁 Klaim Reward Sekarang
          </button>
        )}
      </div>
    </div>
  );
};

export default Reward;

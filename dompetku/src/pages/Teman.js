import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Teman.css';

const Teman = () => {
  const [temanList, setTemanList] = useState([]);

  useEffect(() => {
    const fetchTeman = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const uid = user.uid;
      const temanSet = new Set();

      const transferSnapshot = await getDocs(collection(db, 'transfer'));
      transferSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.pengirimUid === uid) {
          temanSet.add(data.penerimaUid);
        } else if (data.penerimaUid === uid) {
          temanSet.add(data.pengirimUid);
        }
      });

      const kasbonSnapshot = await getDocs(collection(db, 'kasbon', uid, 'data'));
      kasbonSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.peminjamUid) temanSet.add(data.peminjamUid);
        if (data.pemberiUid) temanSet.add(data.pemberiUid);
      });

      const userSnapshot = await getDocs(collection(db, 'users'));
      const allUsers = userSnapshot.docs.map(doc => doc.data());

      const teman = allUsers.filter(u => temanSet.has(u.uid) && u.uid !== uid);

      setTemanList(teman);
    };

    fetchTeman();
  }, []);

  return (
    <div className="page-background">
      <div className="kasbon-container">
        <div className="kasbon-header">
          <h3>Daftar Teman</h3>
        </div>

        {temanList.length === 0 ? (
          <div className="teman-empty">Belum ada teman tercatat.</div>
        ) : (
          <ul className="teman-list">
            {temanList.map((t, idx) => (
              <li key={idx} className="teman-item">
                <div>
                  <div className="teman-item-nama">{t.nama}</div>
                  <div className="teman-item-hp">{t.hp}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Teman;

import React, { useEffect, useState } from 'react';
import './Reputasi.css';
import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

const Reputasi = () => {
  const [reputasi, setReputasi] = useState(50);
  const [userData, setUserData] = useState(null);
  const [userDocId, setUserDocId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(collection(db, 'users'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setUserData(docSnap.data());
          setUserDocId(docSnap.id);
          setReputasi(docSnap.data().reputasi ?? 50);
        }
      } catch (error) {
        console.error('Gagal mengambil data user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const cekPenalti = async () => {
      if (!userData || !userDocId) return;

      try {
        const kasbonSnapshot = await getDocs(collection(db, 'kasbon'));
        const overdueKasbon = [];
        const today = new Date();

        for (const docItem of kasbonSnapshot.docs) {
          const kasbon = docItem.data();
          const kasbonId = docItem.id;

          if (
            kasbon.nama === userData.nama &&
            kasbon.status === 'Belum Lunas' &&
            !kasbon.penaltiDiberikan
          ) {
            const tanggalKasbon = new Date(kasbon.tanggal);
            const selisihHari = Math.floor((today - tanggalKasbon) / (1000 * 60 * 60 * 24));

            if (selisihHari > 10) {
              overdueKasbon.push({ id: kasbonId });
            }
          }
        }

        if (overdueKasbon.length > 0) {
          const reputasiBaru = Math.max((userData.reputasi ?? 50) - 10 * overdueKasbon.length, 0);
          setReputasi(reputasiBaru);

          await updateDoc(doc(db, 'users', userDocId), {
            reputasi: reputasiBaru,
          });

          for (const kasbon of overdueKasbon) {
            await updateDoc(doc(db, 'kasbon', kasbon.id), {
              penaltiDiberikan: true,
            });
          }
        }
      } catch (error) {
        console.error('Gagal mengecek reputasi:', error);
      }
    };

    cekPenalti();
  }, [userData, userDocId]);

  return (
    <div className="page-background">
      <div className="kasbon-container">
        <div className="kasbon-header">
          <h3>Reputasi Pengguna</h3>
        </div>

        <div className={`reputasi-box ${reputasi >= 80 ? 'baik' : reputasi >= 50 ? 'sedang' : 'buruk'}`}>
          <span className="reputasi-nilai">{reputasi}</span>
          <p className="reputasi-deskripsi">
            {
              reputasi >= 80
                ? "Reputasi Anda sangat baik. Terus pertahankan!"
                : reputasi >= 50
                ? "Reputasi Anda cukup. Bayar tepat waktu untuk meningkatkannya."
                : "Reputasi Anda rendah. Anda tidak bisa mengajukan kasbon untuk sementara."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reputasi;

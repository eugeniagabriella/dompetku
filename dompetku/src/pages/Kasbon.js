import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import './Kasbon.css';

const Kasbon = () => {
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [kasbonList, setKasbonList] = useState([]);

  useEffect(() => {
    const fetchKasbon = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const kasbonRef = collection(db, "kasbon", user.uid, "data");
        const q = query(kasbonRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setKasbonList(data);
      } catch (error) {
        console.error("Gagal mengambil kasbon:", error);
      }
    };

    fetchKasbon();
  }, []);

  const handleTambahKasbon = async () => {
    if (!nama || !jumlah || jumlah <= 0) {
      alert("Isi nama dan jumlah dengan benar.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const kasbonRef = collection(db, "kasbon", user.uid, "data");

      // Cari peminjam dari koleksi 'users' berdasarkan nama atau no hp
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const targetUser = usersSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.nama === nama || data.hp === nama;
      });

      let peminjamUid = null;
      if (targetUser) {
        peminjamUid = targetUser.data().uid;
      }

      const newKasbon = {
        nama,
        jumlah: parseInt(jumlah),
        tanggal: new Date().toLocaleDateString(),
        status: "Belum Lunas",
        createdAt: new Date(),
        pemberiUid: user.uid,
        peminjamUid: peminjamUid, // nullable jika tidak ditemukan
      };

      const docRef = await addDoc(kasbonRef, newKasbon);

      setKasbonList((prev) => [{ ...newKasbon, id: docRef.id }, ...prev]);
      setNama("");
      setJumlah("");
      alert("Kasbon berhasil ditambahkan!");
    } catch (error) {
      console.error("Gagal menambahkan kasbon:", error);
    }
  };

  const handleLunas = async (id) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const kasbonDoc = doc(db, "kasbon", user.uid, "data", id);
      await updateDoc(kasbonDoc, {
        status: "Lunas",
      });

      setKasbonList((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "Lunas" } : k))
      );
    } catch (error) {
      console.error("Gagal memperbarui status:", error);
    }
  };

  return (
    <div className="page-background">
      <div className="kasbon-container">
        <div className="kasbon-header">
          <h3>Tambah Kasbon</h3>
        </div>

        <div className="kasbon-form">
          <input
            type="text"
            placeholder="Nama atau No HP Pengutang"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="kasbon-input"
          />
          <input
            type="number"
            placeholder="Jumlah (Rp)"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="kasbon-input"
          />
          <button onClick={handleTambahKasbon} className="kasbon-button">
            Tambah
          </button>
        </div>

        <div className="kasbon-header">
          <h4>Daftar Kasbon</h4>
        </div>

        <ul className="kasbon-list">
          {kasbonList.map((k) => (
            <li key={k.id} className="kasbon-item">
              <div>
                <div className="kasbon-item-header">{k.nama}</div>
                <div className="kasbon-item-sub">
                  Rp {k.jumlah.toLocaleString()} - {k.tanggal} [{k.status}]
                </div>
              </div>
              {k.status === "Belum Lunas" && (
                <div className="kasbon-actions">
                  <button className="lunas-btn" onClick={() => handleLunas(k.id)}>
                    Sudah Lunas
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Kasbon;

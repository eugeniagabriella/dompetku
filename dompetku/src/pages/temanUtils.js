import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export const tambahTeman = async (userId, temanId) => {
  if (userId === temanId) return;

  const temanDocRef = doc(db, "teman", userId);
  const snapshot = await getDoc(temanDocRef);

  if (snapshot.exists()) {
    await updateDoc(temanDocRef, {
      teman: arrayUnion(temanId),
    });
  } else {
    await setDoc(temanDocRef, {
      teman: [temanId],
    });
  }
};

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDqLu_-D8L64jdJxRXlss52YcNTyd8My-I",
  authDomain: "dompetku-72008.firebaseapp.com",
  projectId: "dompetku-72008",
  storageBucket: "dompetku-72008.appspot.com",
  messagingSenderId: "813555970200",
  appId: "1:813555970200:web:433f4e73336920ce01e0ed",
  measurementId: "G-9F1KPZJ4C7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

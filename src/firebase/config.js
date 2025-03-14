import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTNkDjV8_hz5uTktGyg76Btu3750y4Vn8",
  authDomain: "miniblog-ref-7018e.firebaseapp.com",
  projectId: "miniblog-ref-7018e",
  storageBucket: "miniblog-ref-7018e.firebasestorage.app",
  messagingSenderId: "666985246072",
  appId: "1:666985246072:web:c048b0e5f7d698dbba6c8d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };

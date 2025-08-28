// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCM4DMFjQr0UmfjeAvNjxp8EIaVfSrzG3k",
  authDomain: "bess-b914c.firebaseapp.com",
  projectId: "bess-b914c",
  storageBucket: "bess-b914c.firebasestorage.app",
  messagingSenderId: "900871766513",
  appId: "1:900871766513:web:eb7afbc58c801b48168450",
  measurementId: "G-X7KEGELE9B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

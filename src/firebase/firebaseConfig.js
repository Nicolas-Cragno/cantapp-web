// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0Q8YE-WZK-9tawD8Kv-HxYrDXY6ethSw",
  authDomain: "cantarini-cc3f6.firebaseapp.com",
  projectId: "cantarini-cc3f6",
  storageBucket: "cantarini-cc3f6.appspot.com",
  messagingSenderId: "488509947338",
  appId: "1:488509947338:web:9cbf42adba8411ec02a333",
  measurementId: "G-X6TM356M40"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

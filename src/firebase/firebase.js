// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0Q8YE-WZK-9tawD8Kv-HxYrDXY6ethSw",
  authDomain: "cantarini-cc3f6.firebaseapp.com",
  projectId: "cantarini-cc3f6",
  storageBucket: "cantarini-cc3f6.firebasestorage.app",
  messagingSenderId: "488509947338",
  appId: "1:488509947338:web:9cbf42adba8411ec02a333",
  measurementId: "G-X6TM356M40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
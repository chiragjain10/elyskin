// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_W55460erZbsWVohW8vr0N-DC_lDchhk",
  authDomain: "elyskin-e5583.firebaseapp.com",
  projectId: "elyskin-e5583",
  storageBucket: "elyskin-e5583.firebasestorage.app",
  messagingSenderId: "445884675565",
  appId: "1:445884675565:web:e5037e434380f29d06a3e4",
  measurementId: "G-8N1CYW47V0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

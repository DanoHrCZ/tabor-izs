
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD65cha8EuskAmqW9BivLq9p5i6rBNpWxI",
  authDomain: "tabor-izs.firebaseapp.com",
  projectId: "tabor-izs",
  storageBucket: "tabor-izs.firebasestorage.app",
  messagingSenderId: "19913054232",
  appId: "1:19913054232:web:beb704dc44be41f1108b6d",
  measurementId: "G-ZS767CJ7DS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
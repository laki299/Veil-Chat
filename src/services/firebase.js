import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB_AdvQW2Cq2GDD7lMWzbc1HVhRWZsYz-I",
  authDomain: "veil-chat-f3248.firebaseapp.com",
  projectId: "veil-chat-f3248",
  storageBucket: "veil-chat-f3248.firebasestorage.app",
  messagingSenderId: "980025457761",
  appId: "1:980025457761:web:62f06a18383773e8417e20",
  measurementId: "G-ZXZC7H2BPC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

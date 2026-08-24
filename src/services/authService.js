import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function registerUser(email, password, phone, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // ইউজার প্রোফাইল Firestore-এ সেভ
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: email,
    phone: phone,
    displayName: displayName || "",
    age: null,
    gender: null,
    bio: "",
    profileCompleted: false,
    balance: 0,
    createdAt: serverTimestamp(),
    lastActive: serverTimestamp()
  });

  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  await signOut(auth);
}

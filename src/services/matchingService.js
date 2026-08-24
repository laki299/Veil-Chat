import {
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  writeBatch,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";

export async function joinWaitingQueue(userId, preferences) {
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000));

  await setDoc(doc(db, "waitingQueue", userId), {
    genderPreference: preferences.genderPreference,
    ageRange: preferences.ageRange,
    chatType: preferences.chatType,
    myGender: preferences.myGender,
    myAgeRange: preferences.myAgeRange,
    joinedAt: serverTimestamp(),
    expiresAt
  });
}

export async function leaveWaitingQueue(userId) {
  await deleteDoc(doc(db, "waitingQueue", userId));
}

export async function findMatch(userId, preferences) {
  const q = query(
    collection(db, "waitingQueue"),
    where("chatType", "==", preferences.chatType),
    orderBy("joinedAt", "asc"),
    limit(30)
  );

  const snapshot = await getDocs(q);
  let matchedUser = null;

  for (const docSnap of snapshot.docs) {
    if (docSnap.id === userId) continue;

    const data = docSnap.data();

    const genderOk =
      preferences.genderPreference === "any" ||
      data.myGender === preferences.genderPreference;

    const myGenderOk =
      data.genderPreference === "any" ||
      data.genderPreference === preferences.myGender;

    if (genderOk && myGenderOk) {
      matchedUser = { id: docSnap.id, ...data };
      break;
    }
  }

  if (!matchedUser) return null;

  // ম্যাচ তৈরি
  const chatId = `\( {userId}_ \){matchedUser.id}_${Date.now()}`;
  const batch = writeBatch(db);

  const chatRef = doc(db, "activeChats", chatId);
  batch.set(chatRef, {
    user1: userId,
    user2: matchedUser.id,
    chatType: preferences.chatType,
    status: "active",
    createdAt: serverTimestamp()
  });

  batch.delete(doc(db, "waitingQueue", userId));
  batch.delete(doc(db, "waitingQueue", matchedUser.id));

  await batch.commit();

  return {
    chatId,
    partnerId: matchedUser.id
  };
}

export async function endChat(chatId) {
  const chatRef = doc(db, "activeChats", chatId);
  await setDoc(
    chatRef,
    {
      status: "ended",
      endedAt: serverTimestamp()
    },
    { merge: true }
  );
}

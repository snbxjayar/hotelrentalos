import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import type { Room, Booking } from "../types/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fetch all rooms
export async function getRooms(): Promise<Room[]> {
  const snapshot = await getDocs(collection(db, "rooms"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Room));
}

// Fetch today's check-ins
export async function getTodayCheckIns(): Promise<Booking[]> {
  const today = new Date().toISOString().split("T")[0];
  const q = query(
    collection(db, "bookings"),
    where("checkIn", "==", today),
    where("status", "==", "confirmed")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
}

// Fetch today's check-outs
export async function getTodayCheckOuts(): Promise<Booking[]> {
  const today = new Date().toISOString().split("T")[0];
  const q = query(
    collection(db, "bookings"),
    where("checkOut", "==", today),
    where("status", "==", "checked-in")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
}

// Fetch recent bookings
export async function getRecentBookings(): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Booking));
}
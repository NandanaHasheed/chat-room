import { initializeApp } from "firebase/app";

import {
  getFirestore
} from "firebase/firestore";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBlYD7Ax_KFJ0H0lwpp1M8m4SXbI1Y1NMY",
  authDomain: "chat-room-a4b13.firebaseapp.com",
  projectId: "chat-room-a4b13",
  storageBucket: "chat-room-a4b13.firebasestorage.app",
  messagingSenderId: "685636390965",
  appId: "1:685636390965:web:b5e3a7fc2be73d0452a17c"
};


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
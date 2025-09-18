// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB58vfG5jRcyTlliehGoQZfdJrrj2pPZqg",
  authDomain: "rd-biz-backend.firebaseapp.com",
  projectId: "rd-biz-backend",
  storageBucket: "rd-biz-backend.firebasestorage.app",
  messagingSenderId: "758325667895",
  appId: "1:758325667895:web:aac63b57f248d8b5a737b2",
  measurementId: "G-7LR7G3XZ1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
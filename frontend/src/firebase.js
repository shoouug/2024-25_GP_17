// firebase.js or firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // If you're using Firestore
import { getAuth } from "firebase/auth"; // If you're using Firebase Authentication

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDDQhqQAXP5_kuR9Jg0poh9EEOparuy9ac",
    authDomain: "gennews-2e5b4.firebaseapp.com",
    projectId: "gennews-2e5b4",
    storageBucket: "gennews-2e5b4.appspot.com",
    messagingSenderId: "683783578270",
    appId: "1:683783578270:web:412d2ec688104a4889d18f",
    measurementId: "G-P6W8NS36GK"
  };
  

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth if needed
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
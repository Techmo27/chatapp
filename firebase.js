/**
 * This file is to be used for firebase configuration. 
 */
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { collection, addDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore"; 

// firebase config credentials
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyBA8JfGJlneemNummlt1VvL4Tyl4L1bY5Y",
  authDomain: "chat-app-d8756.firebaseapp.com",
  projectId: "chat-app-d8756",
  storageBucket: "chat-app-d8756.appspot.com",
  messagingSenderId: "345183361524",
  appId: "1:345183361524:web:cfec4f3f24efffde1c41a1"
});


const db = getFirestore();
const auth = getAuth();
  
export { db, auth, onAuthStateChanged, signInAnonymously, collection, addDoc,  doc, onSnapshot, orderBy, query };
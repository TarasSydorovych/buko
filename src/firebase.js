import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_YDhfzxc6JGYN79Q4tzKcK4B7OfWHC_o",
  authDomain: "buko-4f2d7.firebaseapp.com",
  projectId: "buko-4f2d7",
  storageBucket: "buko-4f2d7.appspot.com",
  messagingSenderId: "995186306537",
  appId: "1:995186306537:web:a325eb4c0ff24945ae6f78",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

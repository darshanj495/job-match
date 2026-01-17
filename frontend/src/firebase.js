// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQXPu4_7IvWfZ3jDVEDLaswnghPrO9XJM",
  authDomain: "job-match-6fdd6.firebaseapp.com",
  projectId: "job-match-6fdd6",
  storageBucket: "job-match-6fdd6.firebasestorage.app",
  messagingSenderId: "163551534655",
  appId: "1:163551534655:web:80a297a7d4dd6dcd66628a",
  measurementId: "G-J1CG2RQ5VQ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
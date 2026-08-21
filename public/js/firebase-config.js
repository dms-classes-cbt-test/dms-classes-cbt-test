import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRR1E8fcVM-kWAdU_B7nA9hUS0vfWr9R8",
  authDomain: "dms-classes-cbt-test.firebaseapp.com",
  projectId: "dms-classes-cbt-test",
  storageBucket: "dms-classes-cbt-test.firebasestorage.app",
  messagingSenderId: "377863051336",
  appId: "1:377863051336:web:8b8c6d1ca2b6a67476607d",
  measurementId: "G-3ES8VS3WJ6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
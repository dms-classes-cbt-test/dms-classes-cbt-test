import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNJNs2seyUgDrqW3r-U3kSQfOBTuETBVU",
  authDomain: "dms-classes-cbt-test-4e6dd.firebaseapp.com",
  projectId: "dms-classes-cbt-test-4e6dd",
  storageBucket: "dms-classes-cbt-test-4e6dd.firebasestorage.app",
  messagingSenderId: "1046455506247",
  appId: "1:1046455506247:web:da408418a032074b382862"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

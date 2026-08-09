// ======================================
// FIREBASE-CONFIG.JS
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyBNJNs2seyUgDrqW3r-U3kSQfOBTuETBVU",

    authDomain: "dms-classes-cbt-test-4e6dd.firebaseapp.com",

    projectId: "dms-classes-cbt-test-4e6dd",

    storageBucket: "dms-classes-cbt-test-4e6dd.firebasestorage.app",

    messagingSenderId: "1046455506247",

    appId: "1:1046455506247:web:da408418a032074b382862",

    measurementId: "G-MFJYCFKZ2R"

};

const app = initializeApp(firebaseConfig);

// Firestore

const db = getFirestore(app);

// Authentication

const auth = getAuth(app);

// Export

export { app, db, auth };
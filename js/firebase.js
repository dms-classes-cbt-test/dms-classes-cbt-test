import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


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


export const auth = getAuth(app);

export const db = getFirestore(app);


/* Firestore functions */

export {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
};

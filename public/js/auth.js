// ======================================
// AUTH.JS (PART 1)
// Firebase Authentication
// ======================================

import { auth } from "./firebase-config.js";

import {

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ======================================
// LOGIN
// ======================================

export async function login(email, password){

    try{

        const userCredential = await signInWithEmailAndPassword(

            auth,

            email,

            password

        );

        return userCredential.user;

    }

    catch(error){

        console.error(error);

        throw error;

    }

}

// ======================================
// LOGOUT
// ======================================

export async function logout(){

    await signOut(auth);

}

// ======================================
// CURRENT USER
// ======================================

export function checkUser(callback){

    onAuthStateChanged(auth, function(user){

        callback(user);

    });

}
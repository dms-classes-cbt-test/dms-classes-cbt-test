import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const ADMIN_EMAIL = "sandeepkr61062@gmail.com";

const loginBtn = document.getElementById("loginBtn");

console.log("ADMIN LOGIN JS LOADED");
console.log("Firebase auth:", auth);

loginBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    console.log("LOGIN BUTTON CLICKED");
    console.log("Email:", email);

    if (!email || !password) {
        alert("Email aur password enter karein.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {

        const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("Firebase login successful:", result.user.email);

        if (
            result.user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {
            await auth.signOut();

            alert("Access denied. This account is not an admin.");

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";
            return;
        }

        localStorage.setItem("adminLoggedIn", "true");

        window.location.href = "admin-dashboard.html";

    } catch (error) {

        console.error("FIREBASE LOGIN ERROR:", error);

        alert(
            "Login failed\n\nCode: " +
            error.code +
            "\n\nMessage: " +
            error.message
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});

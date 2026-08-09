import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const ADMIN_EMAIL = "sandeepkr61062@signInWithEmailAndPassword.com";

document.getElementById("loginBtn").addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }

    try {

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (userCredential.user.email !== ADMIN_EMAIL) {

            await auth.signOut();

            alert("Access denied. This account is not an admin.");

            return;
        }

        localStorage.setItem("adminLoggedIn", "true");

        window.location.href = "admin/admin-dashboard.html";

    } catch (error) {

        alert(error.message);

    }

});
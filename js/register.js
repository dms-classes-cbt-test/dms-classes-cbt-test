import { auth } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(userCredential.user, {
            displayName: name
        });

        alert("Registration Successful!");

        window.location.href = "login.html";

    } catch (error) {

        switch (error.code) {

            case "auth/email-already-in-use":
                alert("This email is already registered.");
                break;

            case "auth/invalid-email":
                alert("Invalid email address.");
                break;

            case "auth/weak-password":
                alert("Password is too weak.");
                break;

            default:
                alert(error.message);

        }

    }

});
import { auth } from "./firebase-config.js";
import {
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", async () => {

    const email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Please enter your registered email.");
        return;
    }

    try {

        await sendPasswordResetEmail(auth, email);

        alert("✅ Password reset email has been sent. Please check your inbox.");

        window.location.href = "login.html";

    } catch (error) {

        let message = "Failed to send password reset email.";

        switch (error.code) {

            case "auth/user-not-found":
                message = "No account found with this email.";
                break;

            case "auth/invalid-email":
                message = "Please enter a valid email address.";
                break;

            case "auth/too-many-requests":
                message = "Too many requests. Please try again later.";
                break;

            default:
                message = error.message;
        }

        alert(message);
    }

});
import { auth } from "./firebase-config.js";

import {
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const changeBtn = document.getElementById("changeBtn");

changeBtn.addEventListener("click", async () => {

    const newPassword =
    document.getElementById("newPassword").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if (!newPassword || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        alert("Please login again.");
        window.location.href = "login.html";
        return;
    }

    try {

        await updatePassword(user, newPassword);

        alert("✅ Password changed successfully.");

        window.location.href = "login.html";

    } catch (error) {

        if (error.code === "auth/requires-recent-login") {

            alert("For security reasons, please login again and then change your password.");

        } else {

            alert(error.message);

        }

    }

});
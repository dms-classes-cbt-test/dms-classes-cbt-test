import { login } from "./auth.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {

        const user = await login(email, password);

        // =====================================
        // STUDENT INFORMATION
        // =====================================

        const studentName =
            user.displayName ||
            email.split("@")[0] ||
            "Student";

        localStorage.setItem(
            "studentName",
            studentName
        );

        localStorage.setItem(
            "studentEmail",
            user.email || email
        );

        // =====================================
        // ADMIN
        // =====================================

        if (email === "sandeepkr61062@gmail.com") {

            window.location.href =
                "admin/admin-dashboard.html";

            return;
        }

        // =====================================
        // STUDENT
        // =====================================

        window.location.href =
            "student/dashboard.html";

    }

    catch (error) {

        console.error(error);

        switch (error.code) {

            case "auth/invalid-credential":
                alert("Invalid email or password.");
                break;

            case "auth/invalid-email":
                alert("Invalid email address.");
                break;

            case "auth/too-many-requests":
                alert("Too many attempts. Try again later.");
                break;

            default:
                alert(error.message);
        }
    }

});

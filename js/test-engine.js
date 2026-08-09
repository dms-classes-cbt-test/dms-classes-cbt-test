import { loadQuestionsFirebase } from "./firebase-question.js";
import { saveResultFirebase } from "./firebase-result.js";

let questions = [];
let currentQuestion = 0;
let answers = [];

let timer = 0;
let timerInterval = null;
let testSubmitted = false;
window.onload = async function () {

    await loadTest();

};
async function loadTest() {

    questions = await loadQuestionsFirebase();

    if (questions.length === 0) {

        alert("No Questions Found");

        return;

    }

    showQuestion();

}
// ======================================
// TEST-ENGINE.JS (PART 2)
// Show Question + Save Answer + Navigation
// ======================================

// Show Current Question

function showQuestion() {

    if (questions.length === 0) return;

    const q = questions[currentQuestion];

    document.getElementById("questionNo").innerHTML =
        "Question " + (currentQuestion + 1) + " / " + questions.length;

    document.getElementById("questionText").innerHTML =
        q.question;

    document.getElementById("option1").innerHTML = q.options[0];
    document.getElementById("option2").innerHTML = q.options[1];
    document.getElementById("option3").innerHTML = q.options[2];
    document.getElementById("option4").innerHTML = q.options[3];

    const saved = answers[currentQuestion];

    document.querySelectorAll("input[name='answer']").forEach(function (radio) {

        radio.checked = (radio.value === saved);

    });

}

// Save Selected Answer

function saveAnswer() {

    const selected =
        document.querySelector("input[name='answer']:checked");

    if (selected) {

        answers[currentQuestion] = selected.value;

    }

}

// Next Question

function nextQuestion() {

    saveAnswer();

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

}

// Previous Question

function previousQuestion() {

    saveAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

}

// Global Functions

window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
// ======================================
// TEST-ENGINE.JS (PART 3)
// Timer + Submit + Score + Save Result
// ======================================

// Start Timer

function startTimer(minutes = 10) {

    timer = minutes * 60;

    updateTimer();

    timerInterval = setInterval(function () {

        timer--;

        updateTimer();

        if (timer <= 0) {

            clearInterval(timerInterval);

            submitTest();

        }

    }, 1000);

}

// Update Timer

function updateTimer() {

    const min = Math.floor(timer / 60);
    const sec = timer % 60;

    const timerBox = document.getElementById("timer");

    if (timerBox) {

        timerBox.innerHTML =
            "Time Left : " +
            String(min).padStart(2, "0") +
            ":" +
            String(sec).padStart(2, "0");

    }

    const progress = document.getElementById("progress");

    if (progress) {

        const total = 600; // 10 minutes

        const percent =
            ((total - timer) / total) * 100;

        progress.style.width = percent + "%";

    }

}

// Submit Test

async function submitTest() {

    if (testSubmitted) return;

    testSubmitted = true;

    clearInterval(timerInterval);

    saveAnswer();

    let score = 0;

    questions.forEach(function (q, index) {

        if (answers[index] === q.answer) {

            score++;

        }

    });

    const total = questions.length;

    const percentage =
        total === 0
            ? 0
            : ((score / total) * 100).toFixed(2);

    const status =
        percentage >= 40 ? "PASS" : "FAIL";

    const resultData = {

        score: score,
        total: total,
        percentage: Number(percentage),
        status: status,
        date: new Date().toLocaleString(),
        answers: answers

    };

    try {

        // Firebase Save
        if (typeof saveResultFirebase === "function") {

            await saveResultFirebase(resultData);

        }

    } catch (error) {

        console.error(error);

    }

    // Backup in LocalStorage

    let history =
        JSON.parse(localStorage.getItem("resultHistory")) || [];

    history.push(resultData);

    localStorage.setItem(
        "resultHistory",
        JSON.stringify(history)
    );

    alert(
        "Test Submitted Successfully\n\n" +
        "Score : " + score + "/" + total
    );

    window.location.href = "result.html";

}

// Submit Button

const submitBtn =
    document.getElementById("submitBtn");

if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        submitTest
    );

}

// Start Timer

startTimer(10);

// Global

window.submitTest = submitTest;
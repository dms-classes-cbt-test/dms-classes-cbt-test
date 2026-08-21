import { loadQuestionsFirebase } from "./firebase-question.js";
import { saveResultFirebase } from "./firebase-result.js";

let questions = [];
let currentQuestion = 0;
let answers = [];
let reviewQuestions = [];
let timer = 600;
let timerInterval = null;
let testSubmitted = false;

const questionNo = document.getElementById("questionNo");
const questionText = document.getElementById("questionText");

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

const palette = document.getElementById("palette");
const progress = document.getElementById("progress");
const timerBox = document.getElementById("timer");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const reviewBtn = document.getElementById("reviewBtn");
const submitBtn = document.getElementById("submitBtn");

console.log("CBT TEST ENGINE JS LOADED");

window.addEventListener("load", loadTest);

async function loadTest() {

    console.log("===== CBT TEST START =====");

    questions = [];

    // Firebase
    try {

        questions = await loadQuestionsFirebase();
        alert("Firebase Questions: " + questions.length);

        console.log(
            "Firebase questions:",
            questions
        );

    } catch (error) {

        console.error(
            "Firebase questions error:",
            error
        );

        questions = [];
    }

    // LocalStorage fallback
    if (!Array.isArray(questions) || questions.length === 0) {

        try {

            const localData =
                JSON.parse(
                    localStorage.getItem("questions")
                ) || [];

            questions = convertQuestions(localData);

            console.log(
                "LocalStorage questions:",
                questions
            );

        } catch (error) {

            console.error(
                "LocalStorage error:",
                error
            );

            questions = [];
        }
    }

    // Validate
    questions = questions.filter(function(q) {

        return (
            q &&
            String(q.question || "").trim() !== "" &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.options.every(function(option) {
                return String(option || "").trim() !== "";
            })
        );

    });

    console.log(
        "VALID QUESTIONS:",
        questions.length
    );

    // No questions
    if (questions.length === 0) {

        questionNo.textContent =
            "No Questions";

        questionText.textContent =
            "❌ No questions available.";

        timerBox.textContent =
            "Time Left : 10:00";

        return;
    }

    // Initialize
    currentQuestion = 0;
    testSubmitted = false;

    answers =
        new Array(questions.length).fill(null);

    reviewQuestions =
        new Array(questions.length).fill(false);

    showQuestion();
    createPalette();
    updateProgress();

    // START TIMER
    startTimer();

    console.log(
        "✅ TEST STARTED"
    );
}


// ==================================================
// CONVERT OLD QUESTIONS
// ==================================================

function convertQuestions(data) {

    if (!Array.isArray(data)) {
        return [];
    }

    return data.map(function(q) {

        let options = [];

        if (Array.isArray(q.options)) {

            options = [
                q.options[0],
                q.options[1],
                q.options[2],
                q.options[3]
            ];

        } else {

            options = [
                q.option1,
                q.option2,
                q.option3,
                q.option4
            ];
        }

        return {

            id: q.id || "",

            subjectId: q.subjectId || "",
            subjectName: q.subjectName || "",

            topicId: q.topicId || "",
            topicName: q.topicName || "",

            question:
                String(q.question || ""),

            options: options.map(function(option) {
                return String(option || "");
            }),

            answer:
                String(q.answer || ""),

            marks:
                Number(q.marks) || 1
        };

    });
}


// ==================================================
// SHOW QUESTION
// ==================================================

function showQuestion() {

    if (
        !questions.length ||
        !questions[currentQuestion]
    ) {
        return;
    }

    const q =
        questions[currentQuestion];

    questionNo.textContent =
        "Question " +
        (currentQuestion + 1) +
        " / " +
        questions.length;

    questionText.textContent =
        q.question || "";

    option1.textContent =
        q.options[0] || "";

    option2.textContent =
        q.options[1] || "";

    option3.textContent =
        q.options[2] || "";

    option4.textContent =
        q.options[3] || "";

    const radios =
        document.querySelectorAll(
            "input[name='answer']"
        );

    radios.forEach(function(radio, index) {

        radio.checked = false;

        radio.value =
            q.options[index] || "";

    });

    // Restore answer
    if (
        answers[currentQuestion] !== null
    ) {

        radios.forEach(function(radio) {

            if (
                radio.value ===
                answers[currentQuestion]
            ) {

                radio.checked = true;
            }

        });
    }

    if (reviewBtn) {

        reviewBtn.textContent =
            reviewQuestions[currentQuestion]
            ? "⭐ Remove Review"
            : "⭐ Mark For Review";
    }

    if (prevBtn) {

        prevBtn.disabled =
            currentQuestion === 0;
    }

    createPalette();
    updateProgress();
}


// ==================================================
// SAVE ANSWER
// ==================================================

function saveAnswer() {

    const selected =
        document.querySelector(
            "input[name='answer']:checked"
        );

    if (selected) {

        answers[currentQuestion] =
            selected.value;
    }

    updateProgress();
    createPalette();
}


// ==================================================
// RADIO CHANGE
// ==================================================

document
    .querySelectorAll(
        "input[name='answer']"
    )
    .forEach(function(radio) {

        radio.addEventListener(
            "change",
            saveAnswer
        );

    });


// ==================================================
// TIMER
// ==================================================

function startTimer() {

    clearInterval(timerInterval);

    timer = 600;

    updateTimer();

    timerInterval =
        setInterval(function() {

            if (testSubmitted) {

                clearInterval(timerInterval);
                return;
            }

            timer--;

            if (timer < 0) {
                timer = 0;
            }

            updateTimer();

            if (timer === 0) {

                clearInterval(timerInterval);

                alert(
                    "⏰ Time is over!"
                );

                submitTest();
            }

        }, 1000);
}


// ==================================================
// UPDATE TIMER
// ==================================================

function updateTimer() {

    if (!timerBox) {
        return;
    }

    const minutes =
        Math.floor(timer / 60);

    const seconds =
        timer % 60;

    timerBox.textContent =
        "Time Left : " +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


// ==================================================
// PALETTE
// ==================================================

function createPalette() {

    if (!palette) {
        return;
    }

    palette.innerHTML = "";

    questions.forEach(function(q, index) {

        const btn =
            document.createElement("button");

        btn.type = "button";

        btn.className =
            "paletteBtn";

        btn.textContent =
            index + 1;

        if (
            index === currentQuestion
        ) {
            btn.classList.add("current");
        }

        if (
            answers[index] !== null &&
            answers[index] !== ""
        ) {
            btn.classList.add("answered");
        }

        if (
            reviewQuestions[index]
        ) {
            btn.classList.add("review");
        }

        btn.addEventListener(
            "click",
            function() {

                saveAnswer();

                currentQuestion =
                    index;

                showQuestion();
            }
        );

        palette.appendChild(btn);

    });
}


// ==================================================
// PROGRESS
// ==================================================

function updateProgress() {

    if (!progress) {
        return;
    }

    if (!questions.length) {

        progress.style.width =
            "0%";

        return;
    }

    const answered =
        answers.filter(function(answer) {

            return (
                answer !== null &&
                answer !== ""
            );

        }).length;

    const percentage =
        (answered / questions.length) * 100;

    progress.style.width =
        percentage + "%";
}


// ==================================================
// PREVIOUS
// ==================================================

if (prevBtn) {

    prevBtn.addEventListener(
        "click",
        function() {

            saveAnswer();

            if (currentQuestion > 0) {

                currentQuestion--;

                showQuestion();
            }

        }
    );
}


// ==================================================
// NEXT
// ==================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        function() {

            saveAnswer();

            if (
                currentQuestion <
                questions.length - 1
            ) {

                currentQuestion++;

                showQuestion();

            } else {

                alert(
                    "This is the last question."
                );
            }

        }
    );
}


// ==================================================
// REVIEW
// ==================================================

if (reviewBtn) {

    reviewBtn.addEventListener(
        "click",
        function() {

            saveAnswer();

            reviewQuestions[currentQuestion] =
                !reviewQuestions[currentQuestion];

            showQuestion();

        }
    );
}


// ==================================================
// SUBMIT BUTTON
// ==================================================

if (submitBtn) {

    submitBtn.addEventListener(
        "click",
        submitTest
    );
}


// ==================================================
// SUBMIT TEST
// ==================================================

async function submitTest() {

    if (testSubmitted) {
        return;
    }

    saveAnswer();

    const unanswered =
        answers.filter(function(answer) {

            return (
                answer === null ||
                answer === ""
            );

        }).length;

    if (
        unanswered > 0 &&
        timer > 0
    ) {

        const ok =
            confirm(
                unanswered +
                " questions are unanswered.\n\nSubmit test?"
            );

        if (!ok) {
            return;
        }
    }

    testSubmitted = true;

    clearInterval(timerInterval);

    let score = 0;

    questions.forEach(
        function(q, index) {

            const selected =
                String(
                    answers[index] || ""
                ).trim();

            const answer =
                String(
                    q.answer || ""
                ).trim()
                .toUpperCase();

            let correct = "";

            if (answer === "A") {
                correct = q.options[0];
            } else if (answer === "B") {
                correct = q.options[1];
            } else if (answer === "C") {
                correct = q.options[2];
            } else if (answer === "D") {
                correct = q.options[3];
            } else {
                correct = q.answer;
            }

            if (
                selected.toLowerCase() ===
                String(correct || "")
                    .trim()
                    .toLowerCase()
            ) {

                score++;
            }

        }
    );

    const total =
        questions.length;

    const percentage =
        total > 0
        ? (score / total) * 100
        : 0;

    const studentName =
        localStorage.getItem(
            "studentName"
        ) || "Student";

    const studentEmail =
        localStorage.getItem(
            "studentEmail"
        ) || "";

    localStorage.setItem(
        "score",
        String(score)
    );

    localStorage.setItem(
        "total",
        String(total)
    );

    localStorage.setItem(
        "percentage",
        percentage.toFixed(2)
    );

    const history =
        JSON.parse(
            localStorage.getItem(
                "resultHistory"
            )
        ) || [];

    history.push({

        studentName,
        studentEmail,
        score,
        total,

        percentage:
            percentage.toFixed(2),

        date:
            new Date().toISOString()

    });

    localStorage.setItem(
        "resultHistory",
        JSON.stringify(history)
    );

    try {

        await saveResultFirebase({

            studentName,
            studentEmail,
            score,
            total,

            percentage:
                percentage.toFixed(2)

        });

    } catch (error) {

        console.error(
            "Firebase result error:",
            error
        );
    }

    window.location.href =
        "result.html";
}

console.log(
    "CBT Test Engine Loaded Successfully"
);

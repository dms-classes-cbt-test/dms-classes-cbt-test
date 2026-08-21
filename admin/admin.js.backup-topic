// ======================================
// ADMIN.JS (PART 1)
// Imports + Variables + Initialization
// Subject Loading + Topic Loading
// Save Question + Reset Form
// ======================================

import {
    saveQuestionFirebase,
    loadQuestionsFirebase,
    deleteQuestionFirebase,
    updateQuestionFirebase
} from "./firebase-question.js";

// --------------------------------------
// Global Variables
// --------------------------------------

let editingId = null;

let currentPage = 1;

const questionsPerPage = 10;

// --------------------------------------
// Window Load
// --------------------------------------

window.onload = async function () {

    loadSubjects();

    loadTopics();

    await showQuestions();

};

// --------------------------------------
// Load Subjects
// --------------------------------------

function loadSubjects() {

    const subject = document.getElementById("subject");

    if (!subject) return;

    const subjects =
        JSON.parse(localStorage.getItem("subjects")) || [];

    subject.innerHTML = "";

    if (subjects.length === 0) {

        subject.innerHTML =
            "<option value=''>No Subject</option>";

        return;
    }

    subjects.forEach(function (item) {

        subject.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;

    });

}

// --------------------------------------
// Load Topics
// --------------------------------------

function loadTopics() {

    const topic = document.getElementById("topic");

    if (!topic) return;

    const topics =
        JSON.parse(localStorage.getItem("topics")) || [];

    topic.innerHTML = "";

    if (topics.length === 0) {

        topic.innerHTML =
            "<option value=''>No Topic</option>";

        return;
    }

    topics.forEach(function (item) {

        topic.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;

    });

}

// --------------------------------------
// Save Question
// --------------------------------------

async function saveQuestion() {

    const subject =
        document.getElementById("subject").value;

    const topic =
        document.getElementById("topic").value;

    const question =
        document.getElementById("question").value.trim();

    const option1 =
        document.getElementById("option1").value.trim();

    const option2 =
        document.getElementById("option2").value.trim();

    const option3 =
        document.getElementById("option3").value.trim();

    const option4 =
        document.getElementById("option4").value.trim();

    const answer =
        document.getElementById("answer").value.trim();

    // Validation

    if (
        subject === "" ||
        topic === "" ||
        question === "" ||
        option1 === "" ||
        option2 === "" ||
        option3 === "" ||
        option4 === "" ||
        answer === ""
    ) {

        alert("Please fill all fields.");

        return;

    }

    // Correct Answer Validation

    const options = [
        option1,
        option2,
        option3,
        option4
    ];

    if (!options.includes(answer)) {

        alert("Answer must match one of the four options.");

        return;

    }

    const data = {

        subject,

        topic,

        question,

        options,

        answer

    };

    try {

        if (editingId) {

            await updateQuestionFirebase(
                editingId,
                data
            );

            alert("Question Updated Successfully.");

            editingId = null;

        } else {

            await saveQuestionFirebase(data);

            alert("Question Saved Successfully.");

        }

        resetForm();

        await showQuestions();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// --------------------------------------
// Reset Form
// --------------------------------------

function resetForm() {

    document.getElementById("question").value = "";

    document.getElementById("option1").value = "";

    document.getElementById("option2").value = "";

    document.getElementById("option3").value = "";

    document.getElementById("option4").value = "";

    document.getElementById("answer").value = "";

}

// Global

window.saveQuestion = saveQuestion;
// ======================================
// ADMIN.JS (PART 2)
// Show Questions + Edit + Delete + Pagination
// ======================================

// Show Questions

async function showQuestions() {

    const list = document.getElementById("questionList");

    if (!list) return;

    const questions = await loadQuestionsFirebase();

    list.innerHTML = "";

    if (questions.length === 0) {

        list.innerHTML = "<h3>No Questions Found</h3>";

        const pageInfo = document.getElementById("pageInfo");

        if (pageInfo) {
            pageInfo.innerHTML = "Page 1 of 1";
        }

        return;
    }

    const totalPages = Math.max(
        1,
        Math.ceil(questions.length / questionsPerPage)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * questionsPerPage;
    const end = start + questionsPerPage;

    const pageQuestions = questions.slice(start, end);

    pageQuestions.forEach(function (q, index) {

        const realIndex = start + index;

        list.innerHTML += `

<div style="border:1px solid #ccc;padding:15px;margin:10px;border-radius:8px;">

<h3>${realIndex + 1}. ${q.question}</h3>

<p><b>Subject:</b> ${q.subject}</p>

<p><b>Topic:</b> ${q.topic}</p>

<p>A. ${q.options[0]}</p>
<p>B. ${q.options[1]}</p>
<p>C. ${q.options[2]}</p>
<p>D. ${q.options[3]}</p>

<p><b>Answer:</b> ${q.answer}</p>

<button onclick="editQuestion('${q.id}')">
✏ Edit
</button>

<button onclick="deleteQuestion('${q.id}')">
🗑 Delete
</button>

</div>

`;

    });

    const pageInfo = document.getElementById("pageInfo");

    if (pageInfo) {

        pageInfo.innerHTML =
            `Page ${currentPage} of ${totalPages}`;

    }

}

// Delete Question

async function deleteQuestion(id) {

    if (!confirm("Delete this question?")) {
        return;
    }

    await deleteQuestionFirebase(id);

    alert("Question Deleted Successfully");

    showQuestions();

}

// Edit Question

async function editQuestion(id) {

    const questions = await loadQuestionsFirebase();

    const q = questions.find(item => item.id === id);

    if (!q) return;

    editingId = id;

    document.getElementById("subject").value = q.subject;
    document.getElementById("topic").value = q.topic;
    document.getElementById("question").value = q.question;

    document.getElementById("option1").value = q.options[0];
    document.getElementById("option2").value = q.options[1];
    document.getElementById("option3").value = q.options[2];
    document.getElementById("option4").value = q.options[3];

    document.getElementById("answer").value = q.answer;

}

// Pagination

async function nextPage() {

    const questions = await loadQuestionsFirebase();

    const totalPages = Math.max(
        1,
        Math.ceil(questions.length / questionsPerPage)
    );

    if (currentPage < totalPages) {

        currentPage++;

        showQuestions();

    }

}

function prevPage() {

    if (currentPage > 1) {

        currentPage--;

        showQuestions();

    }

}
// ======================================
// ADMIN.JS (PART 3)
// Search + Export + Import + Global
// ======================================

// Search Questions

async function searchQuestions() {

    const keyword = document
        .getElementById("searchBox")
        .value
        .toLowerCase()
        .trim();

    const list = document.getElementById("questionList");

    if (!list) return;

    const questions = await loadQuestionsFirebase();

    list.innerHTML = "";

    const filtered = questions.filter(function (q) {

        return (
            q.question.toLowerCase().includes(keyword) ||
            q.subject.toLowerCase().includes(keyword) ||
            q.topic.toLowerCase().includes(keyword)
        );

    });

    if (filtered.length === 0) {

        list.innerHTML = "<h3>No Matching Questions Found</h3>";

        return;

    }

    filtered.forEach(function (q, index) {

        list.innerHTML += `

<div style="border:1px solid #ccc;padding:15px;margin:10px;border-radius:8px;">

<h3>${index + 1}. ${q.question}</h3>

<p><b>Subject:</b> ${q.subject}</p>

<p><b>Topic:</b> ${q.topic}</p>

<p><b>Answer:</b> ${q.answer}</p>

<button onclick="editQuestion('${q.id}')">
✏ Edit
</button>

<button onclick="deleteQuestion('${q.id}')">
🗑 Delete
</button>

</div>

`;

    });

}

// Export Questions

async function exportQuestions() {

    const questions = await loadQuestionsFirebase();

    if (questions.length === 0) {

        alert("No Questions Available");

        return;

    }

    const blob = new Blob(
        [JSON.stringify(questions, null, 2)],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "questions.json";

    a.click();

    URL.revokeObjectURL(url);

}

// Import (Placeholder)

function importQuestions() {

    alert("Import Module Coming Soon");

}

// Global Functions

window.saveQuestion = saveQuestion;
window.showQuestions = showQuestions;
window.editQuestion = editQuestion;
window.deleteQuestion = deleteQuestion;

window.searchQuestions = searchQuestions;

window.exportQuestions = exportQuestions;
window.importQuestions = importQuestions;

window.nextPage = nextPage;
window.prevPage = prevPage;
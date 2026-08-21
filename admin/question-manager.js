import {
  saveQuestionFirebase,
  loadQuestionsFirebase,
  deleteQuestionFirebase,
  updateQuestionFirebase
} from "../js/firebase-question.js";

const subject = document.getElementById("subject");
const topic = document.getElementById("topic");
const question = document.getElementById("question");

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

const answer = document.getElementById("answer");
const questionId = document.getElementById("questionId");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const clearBtn = document.getElementById("clearBtn");
const table = document.getElementById("questionTable");

let questionList = [];

// ======================================
// LOAD QUESTIONS
// ======================================

async function loadQuestions() {

  try {

    table.innerHTML =
      `<tr><td colspan="5">Loading...</td></tr>`;

    questionList = await loadQuestionsFirebase();

    table.innerHTML = "";

    if (questionList.length === 0) {

      table.innerHTML =
        `<tr><td colspan="5">No questions found.</td></tr>`;

      return;
    }

    questionList.forEach((q, i) => {

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHTML(q.subject)}</td>
        <td>${escapeHTML(q.topic)}</td>
        <td>${escapeHTML(q.question)}</td>
        <td>
          <button class="editBtn"
            onclick="editQuestion('${q.id}')">
            ✏ Edit
          </button>

          <button class="deleteBtn"
            onclick="deleteQuestion('${q.id}')">
            🗑 Delete
          </button>
        </td>
      `;

      table.appendChild(row);

    });

  } catch (error) {

    console.error(error);

    table.innerHTML =
      `<tr><td colspan="5">Error loading questions.</td></tr>`;

    alert("Unable to load questions.");

  }

}

// ======================================
// SAVE QUESTION
// ======================================

saveBtn.onclick = async function () {

  if (!validateForm()) {
    return;
  }

  const options = [
    option1.value.trim(),
    option2.value.trim(),
    option3.value.trim(),
    option4.value.trim()
  ];

  const correctIndex = Number(answer.value);

  const obj = {

    subject: subject.value.trim(),

    topic: topic.value.trim(),

    question: question.value.trim(),

    options: options,

    answer: options[correctIndex],

    answerIndex: correctIndex

  };

  try {

    saveBtn.disabled = true;

    saveBtn.textContent = "Saving...";

    await saveQuestionFirebase(obj);

    alert("Question Saved Successfully ✅");

    clearForm();

    await loadQuestions();

  } catch (error) {

    console.error(error);

    alert("Save failed: " + error.message);

  } finally {

    saveBtn.disabled = false;

    saveBtn.textContent = "💾 Save Question";

  }

};

// ======================================
// EDIT QUESTION
// ======================================

window.editQuestion = function (id) {

  const q = questionList.find(item => item.id === id);

  if (!q) {

    alert("Question not found.");

    return;

  }

  questionId.value = q.id;

  subject.value = q.subject || "";
  topic.value = q.topic || "";
  question.value = q.question || "";

  option1.value = q.options?.[0] || "";
  option2.value = q.options?.[1] || "";
  option3.value = q.options?.[2] || "";
  option4.value = q.options?.[3] || "";

  // Correct answer index
  let index = q.answerIndex;

  if (
    index === undefined ||
    index === null ||
    index === ""
  ) {

    index = q.options
      ? q.options.indexOf(q.answer)
      : -1;

  }

  answer.value = index >= 0 ? String(index) : "";

  saveBtn.style.display = "none";
  updateBtn.style.display = "inline-block";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};

// ======================================
// UPDATE QUESTION
// ======================================

updateBtn.onclick = async function () {

  if (!questionId.value) {

    alert("Please select a question to update.");

    return;

  }

  if (!validateForm()) {
    return;
  }

  const options = [
    option1.value.trim(),
    option2.value.trim(),
    option3.value.trim(),
    option4.value.trim()
  ];

  const correctIndex = Number(answer.value);

  const obj = {

    subject: subject.value.trim(),

    topic: topic.value.trim(),

    question: question.value.trim(),

    options: options,

    answer: options[correctIndex],

    answerIndex: correctIndex

  };

  try {

    updateBtn.disabled = true;

    updateBtn.textContent = "Updating...";

    await updateQuestionFirebase(
      questionId.value,
      obj
    );

    alert("Question Updated Successfully ✅");

    clearForm();

    await loadQuestions();

  } catch (error) {

    console.error(error);

    alert("Update failed: " + error.message);

  } finally {

    updateBtn.disabled = false;

    updateBtn.textContent = "✏ Update Question";

  }

};

// ======================================
// DELETE QUESTION
// ======================================

window.deleteQuestion = async function (id) {

  const q = questionList.find(item => item.id === id);

  const text = q
    ? `Delete this question?\n\n${q.question}`
    : "Delete this question?";

  if (!confirm(text)) {
    return;
  }

  try {

    await deleteQuestionFirebase(id);

    alert("Question Deleted Successfully ✅");

    await loadQuestions();

  } catch (error) {

    console.error(error);

    alert("Delete failed: " + error.message);

  }

};

// ======================================
// CLEAR FORM
// ======================================

function clearForm() {

  questionId.value = "";

  subject.value = "";
  topic.value = "";
  question.value = "";

  option1.value = "";
  option2.value = "";
  option3.value = "";
  option4.value = "";

  answer.value = "";

  saveBtn.style.display = "inline-block";
  updateBtn.style.display = "none";

}

// ======================================
// CLEAR BUTTON
// ======================================

clearBtn.onclick = function () {

  clearForm();

};

// ======================================
// VALIDATION
// ======================================

function validateForm() {

  if (!subject.value.trim()) {

    alert("Please enter Subject.");

    subject.focus();

    return false;

  }

  if (!topic.value.trim()) {

    alert("Please enter Topic.");

    topic.focus();

    return false;

  }

  if (!question.value.trim()) {

    alert("Please enter Question.");

    question.focus();

    return false;

  }

  const options = [
    option1.value.trim(),
    option2.value.trim(),
    option3.value.trim(),
    option4.value.trim()
  ];

  if (options.some(value => !value)) {

    alert("Please fill all 4 options.");

    return false;

  }

  if (
    answer.value === "" ||
    !["0", "1", "2", "3"].includes(answer.value)
  ) {

    alert("Please select Correct Answer.");

    answer.focus();

    return false;

  }

  return true;

}

// ======================================
// HTML ESCAPE
// ======================================

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

// ======================================
// START
// ======================================

loadQuestions();

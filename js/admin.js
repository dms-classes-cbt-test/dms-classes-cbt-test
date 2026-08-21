
import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("ADMIN JS LOADED");
/* =================================================
   SUBJECT ADD
   ================================================= */

const subjectForm = document.getElementById("subjectForm");

if (subjectForm) {

    subjectForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const subjectName =
            document.getElementById("subjectName").value.trim();

        if (!subjectName) {
            alert("Subject name enter karein");
            return;
        }

        try {

            await addDoc(collection(db, "subjects"), {
                subjectName: subjectName,
                createdAt: new Date()
            });

            alert("Subject Added Successfully");

            subjectForm.reset();

            loadSubjects();

        } catch (error) {

            console.error(error);
            alert("Subject add nahi hua: " + error.message);

        }

    });

}


/* =================================================
   SUBJECT LIST
   ================================================= */

async function loadSubjects() {

    const subjectList =
        document.getElementById("subjectList");

    if (!subjectList) return;

    subjectList.innerHTML = "";

    try {

        const snapshot =
            await getDocs(collection(db, "subjects"));

        snapshot.forEach((subject) => {

            const data = subject.data();

            subjectList.innerHTML += `
                <div style="border:1px solid gray;padding:10px;margin:10px;">
                    <b>${data.subjectName || "Unnamed Subject"}</b>

                    <br><br>

                    <button onclick="deleteSubject('${subject.id}')">
                        Delete
                    </button>
                </div>
            `;

        });

    } catch (error) {

        console.error("Subject list error:", error);

    }

}


window.deleteSubject = async function (id) {

    try {

        await deleteDoc(
            doc(db, "subjects", id)
        );

        alert("Subject Deleted");

        loadSubjects();

    } catch (error) {

        console.error(error);
        alert("Delete error: " + error.message);

    }

};


/* =================================================
   ADD QUESTION
   SUBJECT DROPDOWN
   ================================================= */

const questionSubject =
    document.getElementById("subject");

const questionTopic =
    document.getElementById("topic");


async function loadQuestionSubjects() {

    if (!questionSubject) return;

    try {

        questionSubject.innerHTML =
            '<option value="">Select Subject</option>';

        const snapshot =
            await getDocs(
                collection(db, "subjects")
            );
alert("Subjects found: " + snapshot.size);

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            const option =
                document.createElement("option");

            option.value = docSnap.id;

            option.textContent =
                data.subjectName || "Unnamed Subject";

            questionSubject.appendChild(option);

        });

        console.log(
            "Subjects loaded:",
            snapshot.size
        );

    } catch (error) {

        console.error(
            "Subject loading error:",
            error
        );

        alert(
            "Subjects load nahi ho rahe: " +
            error.message
        );

    }

}


/* =================================================
   TOPIC DROPDOWN
   ================================================= */

async function loadQuestionTopics(subjectId) {

    if (!questionTopic) return;

    questionTopic.innerHTML =
        '<option value="">Select Topic</option>';

    if (!subjectId) return;

    try {

        const snapshot =
            await getDocs(
                collection(db, "topics")
            );

        let topicFound = false;

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            /*
             * Topic document me subjectId
             * Subject document ke ID ke equal hona chahiye.
             */

            if (data.subjectId === subjectId) {

                topicFound = true;

                const option =
                    document.createElement("option");

                option.value = docSnap.id;

                option.textContent =
                    data.topicName || "Unnamed Topic";

                questionTopic.appendChild(option);

            }

        });

        console.log(
            "Topics loaded:",
            topicFound
        );

        if (!topicFound) {

            questionTopic.innerHTML =
                '<option value="">No Topic Found</option>';

        }

    } catch (error) {

        console.error(
            "Topic loading error:",
            error
        );

        alert(
            "Topics load nahi ho rahe: " +
            error.message
        );

    }

}


/* =================================================
   SUBJECT CHANGE
   ================================================= */

if (questionSubject) {

    questionSubject.addEventListener(
        "change",
        () => {

            const subjectId =
                questionSubject.value;

            console.log(
                "Selected Subject ID:",
                subjectId
            );

            loadQuestionTopics(subjectId);

        }
    );

}


/* =================================================
   PAGE LOAD
   ================================================= */

loadSubjects();

loadQuestionSubjects();



/* =================================================
   SAVE QUESTION
   ================================================= */

window.saveQuestion = async function () {

    const subject = document.getElementById("subject");
    const topic = document.getElementById("topic");
    const question = document.getElementById("question");
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    const option3 = document.getElementById("option3");
    const option4 = document.getElementById("option4");
    const answer = document.getElementById("answer");

    if (!subject.value) {
        alert("Please select Subject.");
        return;
    }

    if (!topic.value) {
        alert("Please select Topic.");
        return;
    }

    if (!question.value.trim()) {
        alert("Please enter Question.");
        return;
    }

    if (!option1.value.trim() ||
        !option2.value.trim() ||
        !option3.value.trim() ||
        !option4.value.trim()) {
        alert("Please enter all four options.");
        return;
    }

    if (!answer.value.trim()) {
        alert("Please enter Correct Answer.");
        return;
    }

    const subjectName =
        subject.options[subject.selectedIndex].textContent;

    const topicName =
        topic.options[topic.selectedIndex].textContent;

    try {

        await addDoc(collection(db, "questions"), {

            subjectId: subject.value,
            subjectName: subjectName,

            topicId: topic.value,
            topicName: topicName,

            question: question.value.trim(),

            option1: option1.value.trim(),
            option2: option2.value.trim(),
            option3: option3.value.trim(),
            option4: option4.value.trim(),

            answer: answer.value.trim(),

            createdAt: new Date()

        });

        alert("Question Saved Successfully ✅");

        question.value = "";
        option1.value = "";
        option2.value = "";
        option3.value = "";
        option4.value = "";
        answer.value = "";

    } catch (error) {

        console.error("Question save error:", error);

        alert(
            "Question save nahi hua: " +
            error.message
        );

    }

};


const saveQuestionBtn = document.getElementById("saveQuestionBtn");

if (saveQuestionBtn) {
    saveQuestionBtn.addEventListener("click", window.saveQuestion);
}


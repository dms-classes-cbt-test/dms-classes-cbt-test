import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const subjectForm = document.getElementById("subjectForm");

if (subjectForm) {
  subjectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subjectName = document.getElementById("subjectName").value;

    try {
      await addDoc(collection(db, "subjects"), {
        subjectName: subjectName,
        createdAt: new Date()
      });

      alert("Subject Added Successfully");

      subjectForm.reset();

    } catch (error) {
      alert(error.message);
    }
  });
}import {
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function loadSubjects() {

    const subjectList = document.getElementById("subjectList");

    if(!subjectList) return;

    subjectList.innerHTML = "";

    const querySnapshot = await getDocs(collection(db,"subjects"));

    querySnapshot.forEach((subject)=>{

        const data = subject.data();

        subjectList.innerHTML += `
        <div style="border:1px solid gray;padding:10px;margin:10px;">
            <b>${data.subjectName}</b>

            <br><br>

            <button onclick="deleteSubject('${subject.id}')">
            Delete
            </button>
        </div>
        `;

    });

}

window.deleteSubject = async(id)=>{

await deleteDoc(doc(db,"subjects",id));

alert("Subject Deleted");

loadSubjects();

}

loadSubjects();
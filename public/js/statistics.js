import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function loadStatistics(){

    try{

        const studentsSnap =
        await getDocs(collection(db,"students"));

        const subjectsSnap =
        await getDocs(collection(db,"subjects"));

        const topicsSnap =
        await getDocs(collection(db,"topics"));

        const questionsSnap =
        await getDocs(collection(db,"questions"));

        const resultsSnap =
        await getDocs(collection(db,"results"));

        document.getElementById("students").textContent =
        studentsSnap.size;

        document.getElementById("subjects").textContent =
        subjectsSnap.size;

        document.getElementById("topics").textContent =
        topicsSnap.size;

        document.getElementById("questions").textContent =
        questionsSnap.size;

        document.getElementById("tests").textContent =
        resultsSnap.size;

        let highest = 0;
        let lowest = null;
        let totalScore = 0;

        resultsSnap.forEach((doc)=>{

            const data = doc.data();

            const score = Number(data.score || 0);

            totalScore += score;

            if(score > highest){

                highest = score;

            }

            if(lowest === null || score < lowest){

                lowest = score;

            }

        });

        const average =
        resultsSnap.size > 0
        ? (totalScore / resultsSnap.size).toFixed(2)
        : "0.00";

        document.getElementById("highest").textContent =
        highest;

        document.getElementById("lowest").textContent =
        lowest ?? 0;

        document.getElementById("average").textContent =
        average;

    }catch(error){

        console.error("Statistics Error:", error);

        alert("Failed to load statistics.");

    }

}

document.getElementById("refreshBtn")
.addEventListener("click", loadStatistics);

loadStatistics();

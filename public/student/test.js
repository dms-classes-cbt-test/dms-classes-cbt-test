// ==========================================
// FINAL TEST.JS - PART 1
// Firebase + Variables + Start Test
// ==========================================

import {
    loadQuestionsFirebase
} from "../js/firebase-question.js";

import {
    saveResultFirebase
} from "../js/firebase-result.js";

// -------------------------------
// VARIABLES
// -------------------------------

let questions = [];

let current = 0;

let answers = [];

let reviewQuestions = [];

let time = 600;

let timer = null;

const questionBox =
document.getElementById("questionBox");

const palette =
document.getElementById("palette");

// -------------------------------
// START TEST
// -------------------------------

async function startTest(){

    try{

        questions =
        await loadQuestionsFirebase();

    }catch(error){

        console.log(error);

        questions = [];

    }

    if(questions.length===0){

        questions =
        JSON.parse(
            localStorage.getItem("questions")
        ) || [];

    }

    if(questions.length===0){

        alert("No Questions Available");

        window.location.href =
        "dashboard.html";

        return;

    }

    // Random Questions

    questions.sort(
        () => Math.random() - 0.5
    );

    // Random Options

    questions.forEach(function(q){

        q.options.sort(
            () => Math.random() - 0.5
        );

    });

    loadQuestion();

    startTimer();

}

// -------------------------------
// LOAD QUESTION
// -------------------------------

function loadQuestion(){

    let q = questions[current];

    questionBox.innerHTML = `

<h3>
Question ${current+1} of ${questions.length}
</h3>

<p>
<b>${q.question}</b>
</p>

${q.options.map(option=>`

<label>

<input
type="radio"
name="answer"
value="${option}"
${answers[current]===option?"checked":""}>

${option}

</label>

<br><br>

`).join("")}

`;

    createPalette();

    updateProgress();

}

// ==========================================
// FINAL TEST.JS - PART 2
// Timer + Navigation + Palette
// ==========================================

// -------------------------------
// SAVE ANSWER
// -------------------------------

function saveAnswer(){

    let selected =
    document.querySelector(
        'input[name="answer"]:checked'
    );

    if(selected){

        answers[current] =
        selected.value;

    }

}

// -------------------------------
// TIMER
// -------------------------------

function startTimer(){

    if(timer){

        clearInterval(timer);

    }

    timer = setInterval(function(){

        let min = Math.floor(time / 60);

        let sec = time % 60;

        document.getElementById("timer").innerHTML =
        "Time Left : " +
        min + ":" +
        (sec < 10 ? "0" : "") + sec;

        time--;

        if(time < 0){

            clearInterval(timer);

            submitTest();

        }

    },1000);

}

// -------------------------------
// NEXT BUTTON
// -------------------------------

document.getElementById("nextBtn").onclick = function(){

    saveAnswer();

    if(current < questions.length - 1){

        current++;

        loadQuestion();

    }

};

// -------------------------------
// PREVIOUS BUTTON
// -------------------------------

document.getElementById("prevBtn").onclick = function(){

    saveAnswer();

    if(current > 0){

        current--;

        loadQuestion();

    }

};

// -------------------------------
// MARK FOR REVIEW
// -------------------------------

document.getElementById("reviewBtn").onclick = function(){

    reviewQuestions[current] = true;

    createPalette();

    alert("Question Marked For Review");

};

// -------------------------------
// QUESTION PALETTE
// -------------------------------

function createPalette(){

    palette.innerHTML = "";

    for(let i=0;i<questions.length;i++){

        let className = "notAnswered";

        if(answers[i]){

            className = "answered";

        }

        if(reviewQuestions[i]){

            className = "review";

        }

        if(i===current){

            className = "current";

        }

        palette.innerHTML += `

<button
class="paletteBtn ${className}"
onclick="goQuestion(${i})">

${i+1}

</button>

`;

    }

}

// -------------------------------
// GO TO QUESTION
// -------------------------------

window.goQuestion = function(index){

    saveAnswer();

    current = index;

    loadQuestion();

};

// ==========================================
// FINAL TEST.JS - PART 3
// Progress + Score + Submit
// ==========================================

// -------------------------------
// PROGRESS BAR
// -------------------------------

function updateProgress(){

    let progress =
    document.getElementById("progress");

    if(!progress) return;

    let percent =
    ((current + 1) / questions.length) * 100;

    progress.style.width =
    percent + "%";

}

// -------------------------------
// CALCULATE SCORE
// -------------------------------

function calculateScore(){

    let score = 0;

    questions.forEach(function(q,index){

        if(answers[index] === q.answer){

            score += 1;

        }
        else if(answers[index]){

            score -= 0.25;

        }

    });

    return score;

}

// -------------------------------
// SUBMIT TEST
// -------------------------------

async function submitTest(){

    saveAnswer();

    if(timer){

        clearInterval(timer);

    }

    let score = calculateScore();

    localStorage.setItem("score", score);

    localStorage.setItem("total", questions.length);

    await saveResultFirebase({

        studentName:
        localStorage.getItem("studentName") || "",

        studentEmail:
        localStorage.getItem("studentEmail") || "",

        score: score,

        total: questions.length,

        percentage:
        ((score/questions.length)*100).toFixed(2),

        date:
        new Date().toLocaleString()

    });

    window.location.href =
    "result.html";

}

// -------------------------------
// SUBMIT BUTTON
// -------------------------------

document.getElementById("submitBtn").onclick =
function(){

    if(confirm(
        "Are you sure you want to submit the test?"
    )){

        submitTest();

    }

};


// ==========================================
// FINAL TEST.JS - PART 4
// Final Initialization
// ==========================================

// -------------------------------
// PREVENT EMPTY ANSWERS ARRAY
// -------------------------------

answers = new Array(questions.length);

reviewQuestions = new Array(questions.length);

// -------------------------------
// PREVENT PAGE LEAVE
// -------------------------------

window.onbeforeunload = function(){

    return "Your test is still running. Are you sure you want to leave?";

};

// -------------------------------
// DISABLE RIGHT CLICK
// -------------------------------

document.addEventListener("contextmenu", function(e){

    e.preventDefault();

});

// -------------------------------
// DISABLE COPY
// -------------------------------

document.addEventListener("copy", function(e){

    e.preventDefault();

});

// -------------------------------
// DISABLE CUT
// -------------------------------

document.addEventListener("cut", function(e){

    e.preventDefault();

});

// -------------------------------
// DISABLE PASTE
// -------------------------------

document.addEventListener("paste", function(e){

    e.preventDefault();

});

// -------------------------------
// START TEST
// -------------------------------

startTest();if (questions.length === 0) {
    ...
}

// यहाँ जोड़ें
answers = new Array(questions.length);
reviewQuestions = new Array(questions.length);

// फिर Randomize
questions.sort(() => Math.random() - 0.5);

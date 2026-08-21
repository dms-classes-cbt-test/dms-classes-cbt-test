import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ==========================================
// FIRESTORE QUESTIONS COLLECTION
// ==========================================

const questionCollection = collection(db, "questions");


// ==========================================
// LOAD QUESTIONS
// ==========================================

export async function loadQuestionsFirebase() {

    console.log("Loading questions from Firebase...");

    try {

        const snapshot =
            await getDocs(questionCollection);

        console.log(
            "Firebase question count:",
            snapshot.size
        );

        const questions = [];

        snapshot.forEach(function(docSnap) {

            const data = docSnap.data();

            console.log(
                "Question document:",
                docSnap.id,
                data
            );

            // ----------------------------------
            // SUPPORT BOTH DATA FORMATS
            // ----------------------------------

            let options = [];

            if (Array.isArray(data.options)) {

                options = [
                    data.options[0] || "",
                    data.options[1] || "",
                    data.options[2] || "",
                    data.options[3] || ""
                ];

            } else {

                options = [
                    data.option1 || "",
                    data.option2 || "",
                    data.option3 || "",
                    data.option4 || ""
                ];

            }


            const question = {

                id: docSnap.id,

                subjectId:
                    data.subjectId || "",

                subjectName:
                    data.subjectName || "",

                topicId:
                    data.topicId || "",

                topicName:
                    data.topicName || "",

                question:
                    String(data.question || ""),

                options: options,

                option1:
                    String(options[0] || ""),

                option2:
                    String(options[1] || ""),

                option3:
                    String(options[2] || ""),

                option4:
                    String(options[3] || ""),

                answer:
                    String(data.answer || ""),

                marks:
                    Number(data.marks) || 1

            };


            // ----------------------------------
            // ONLY ADD VALID QUESTIONS
            // ----------------------------------

            if (
                question.question.trim() !== "" &&
                question.options.length === 4 &&
                question.options.every(function(option) {

                    return String(option).trim() !== "";

                })
            ) {

                questions.push(question);

            } else {

                console.warn(
                    "Invalid question skipped:",
                    docSnap.id,
                    question
                );

            }

        });


        console.log(
            "Converted questions:",
            questions
        );

        console.log(
            "Valid Firebase questions:",
            questions.length
        );


        return questions;


    } catch (error) {

        console.error(
            "loadQuestionsFirebase ERROR:",
            error
        );

        throw error;

    }

}


// ==========================================
// UPDATE QUESTION
// ==========================================

export async function updateQuestion(
    id,
    data
) {

    if (!id) {

        throw new Error(
            "Question ID missing"
        );

    }


    const questionRef =
        doc(
            db,
            "questions",
            id
        );


    await updateDoc(
        questionRef,
        data
    );

}


// ==========================================
// DELETE QUESTION
// ==========================================

export async function deleteQuestionFirebase(
    id
) {

    if (!id) {

        throw new Error(
            "Question ID missing"
        );

    }


    const questionRef =
        doc(
            db,
            "questions",
            id
        );


    await deleteDoc(
        questionRef
    );

}

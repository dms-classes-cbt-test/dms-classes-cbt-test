// ======================================
// FIREBASE-QUESTION.JS (PART 1)
// Firestore Setup + Save Question
// ======================================

import { db } from "./firebase-config.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firestore Collection

const questionCollection = collection(db, "questions");

// ======================================
// Save Question
// ======================================

export async function saveQuestionFirebase(questionData) {

    try {

        const docRef = await addDoc(
            questionCollection,
            {
                ...questionData,
                createdAt: Date.now()
            }
        );

        return docRef.id;

    } catch (error) {

        console.error(
            "Save Question Error:",
            error
        );

        throw error;

    }

}
// ======================================
// FIREBASE-QUESTION.JS (PART 2)
// Load Questions + Delete Question
// ======================================

import {
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================
// Load Questions
// ======================================

export async function loadQuestionsFirebase() {

    try {

        const q = query(
            questionCollection,
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const questions = [];

        snapshot.forEach(function(docSnap){

            questions.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        return questions;

    }

    catch(error){

        console.error(
            "Load Question Error:",
            error
        );

        return [];

    }

}

// ======================================
// Delete Question
// ======================================

export async function deleteQuestionFirebase(id){

    try{

        await deleteDoc(
            doc(db, "questions", id)
        );

    }

    catch(error){

        console.error(
            "Delete Question Error:",
            error
        );

        throw error;

    }

}
// ======================================
// FIREBASE-QUESTION.JS (PART 3)
// Update Question
// ======================================

import {
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================
// Update Question
// ======================================

export async function updateQuestionFirebase(id, questionData) {

    try {

        const questionRef = doc(db, "questions", id);

        await updateDoc(questionRef, {

            ...questionData,

            updatedAt: Date.now()

        });

    }

    catch (error) {

        console.error(
            "Update Question Error:",
            error
        );

        throw error;

    }

}

// ======================================
// FIREBASE-RESULT.JS
// Save / Load Test Results
// ======================================

import {
    db
} from "./firebase-config.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const resultCollection = collection(db, "results");

// ===========================
// Save Result
// ===========================

export async function saveResultFirebase(resultData) {

    try {

        const docRef = await addDoc(
            resultCollection,
            {
                ...resultData,
                createdAt: Date.now()
            }
        );

        return docRef.id;

    } catch (error) {

        console.error("Save Result Error:", error);

        throw error;

    }

}

// ===========================
// Load Results
// ===========================

export async function loadResultsFirebase() {

    try {

        const q = query(
            resultCollection,
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const results = [];

        snapshot.forEach(function (docSnap) {

            results.push({
                id: docSnap.id,
                ...docSnap.data()
            });

        });

        return results;

    } catch (error) {

        console.error("Load Result Error:", error);

        return [];

    }

}

// ===========================
// Delete Result
// ===========================

export async function deleteResultFirebase(id) {

    try {

        await deleteDoc(
            doc(db, "results", id)
        );

    } catch (error) {

        console.error("Delete Result Error:", error);

        throw error;

    }

}
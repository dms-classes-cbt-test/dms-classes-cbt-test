import { loadResultsFirebase } from "./firebase-result.js";

let allResults = [];

const table = document.getElementById("resultTable");
const searchBox = document.getElementById("searchBox");
const refreshBtn = document.getElementById("refreshBtn");

async function loadResults(){

    table.innerHTML = `
    <tr>
        <td colspan="7">Loading...</td>
    </tr>
    `;

    try{

        allResults = await loadResultsFirebase();

        showResults(allResults);

    }catch(error){

        console.error(error);

        table.innerHTML = `
        <tr>
            <td colspan="7">
            Error Loading Results
            </td>
        </tr>
        `;

    }

}
// ======================================
// RESULTS.JS - PART 2
// Show Results + Search + Refresh
// ======================================

// SHOW RESULTS

function showResults(results){

    if(results.length===0){

        table.innerHTML=`
        <tr>
            <td colspan="7">
            No Results Available
            </td>
        </tr>
        `;

        return;

    }

    table.innerHTML="";

    results.forEach(function(item,index){

        let percentage =
        item.percentage ??
        ((item.score/item.total)*100).toFixed(2);

        table.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.studentName || "-"}</td>

<td>${item.studentEmail || "-"}</td>

<td>${item.score}</td>

<td>${item.total}</td>

<td>${percentage}%</td>

<td>${item.date || "-"}</td>

</tr>

`;

    });

}

// SEARCH

searchBox.addEventListener("keyup",function(){

    let keyword =
    searchBox.value.toLowerCase();

    let filtered =
    allResults.filter(function(item){

        return (

            (item.studentName || "")
            .toLowerCase()
            .includes(keyword)

            ||

            (item.studentEmail || "")
            .toLowerCase()
            .includes(keyword)

        );

    });

    showResults(filtered);

});

// REFRESH

refreshBtn.addEventListener("click",function(){

    loadResults();

});

// AUTO LOAD

loadResults();
const tests = [
    {
        id: 1,
        name: "Computer Networking MCQ Test"
    },
    {
        id: 2,
        name: "Computer Fundamentals Test"
    }
];


let testList = document.getElementById("testList");


tests.forEach(test => {

    testList.innerHTML += `
        <h4>${test.name}</h4>
        <button onclick="location.href='test.html'">
    Start Test
</button>
        <hr>
    `;

});
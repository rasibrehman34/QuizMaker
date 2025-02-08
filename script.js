
// // ✅ Handle Quiz Setup Page (quiz.html)
// document.addEventListener("DOMContentLoaded", function () {
//     if (document.getElementById("fileInput")) {
//         setupQuizPage();
//     } else if (document.getElementById("question")) {
//         startQuiz();
//     }
// });

// // ✅ Setup Page Logic (File Upload & Player Name Entry)
// function setupQuizPage() {
//     const totalPlayers = localStorage.getItem("totalPlayers") || "1";

//     // Show Player 2 input field if multiplayer mode is selected
//     if (totalPlayers === "2") {
//         document.getElementById("player2Div").style.display = "block";
//     }

//     document.getElementById("startQuizBtn").addEventListener("click", function () {
//         const file = document.getElementById("fileInput").files[0];
//         const mcqCount = document.getElementById("mcqCount").value;
//         const player1Name = document.getElementById("player1Name").value.trim();
//         const player2Name = document.getElementById("player2Name").value.trim();

//         if (!file) {
//             alert("Please upload a CSV file.");
//             return;
//         }

//         if (player1Name === "") {
//             alert("Please enter Player 1's name.");
//             return;
//         }

//         if (totalPlayers === "2" && player2Name === "") {
//             alert("Please enter Player 2's name.");
//             return;
//         }

//         // Store values in localStorage
//         localStorage.setItem("mcqCount", mcqCount);
//         localStorage.setItem("player1Name", player1Name);
//         localStorage.setItem("player2Name", totalPlayers === "2" ? player2Name : "");

//         // Read and store CSV content
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             localStorage.setItem("quizData", e.target.result);
//             window.location.href = "play.html"; // Move to quiz page
//         };
//         reader.readAsText(file);
//     });
// }

// // ✅ Quiz Game Logic (play.html)
// function startQuiz() {
//     let quizData = [];
//     let selectedQuestionsPlayer1 = [];
//     let selectedQuestionsPlayer2 = [];
//     let currentIndex = 0;
//     let timer;
//     let timeLeft = 30;

//     let player1Score = { correct: 0, wrong: 0 };
//     let player2Score = { correct: 0, wrong: 0 };
//     let totalPlayers = parseInt(localStorage.getItem("totalPlayers"), 10) || 1;
//     let mcqCount = parseInt(localStorage.getItem("mcqCount"), 10) || 12;
//     let currentPlayer = 1;

//     let player1Name = localStorage.getItem("player1Name") || "Player 1";
//     let player2Name = localStorage.getItem("player2Name") || "Player 2";

//     const csvData = localStorage.getItem("quizData");

//     if (csvData) {
//         Papa.parse(csvData, {
//             header: true,
//             skipEmptyLines: true,
//             complete: function (result) {
//                 quizData = result.data;
//                 if (quizData.length < mcqCount * totalPlayers) {
//                     alert("Not enough questions in CSV for both players!");
//                     return;
//                 }

//                 let shuffledData = shuffleArray(quizData);
//                 selectedQuestionsPlayer1 = shuffledData.slice(0, mcqCount);
//                 selectedQuestionsPlayer2 = shuffledData.slice(mcqCount, mcqCount * 2);

//                 loadQuestion();
//             }
//         });
//     }

//     function loadQuestion() {
//         if (currentPlayer === 1 && currentIndex >= selectedQuestionsPlayer1.length) {
//             if (totalPlayers === 2) {
//                 currentPlayer = 2;
//                 currentIndex = 0;
//                 alert(`${player1Name} finished! Now it's ${player2Name}'s turn.`);
//                 loadQuestion();
//                 return;
//             } else {
//                 showFinalResult();
//                 return;
//             }
//         } else if (currentPlayer === 2 && currentIndex >= selectedQuestionsPlayer2.length) {
//             showFinalResult();
//             return;
//         }

//         resetTimer();

//         const qData = currentPlayer === 1 ? selectedQuestionsPlayer1[currentIndex] : selectedQuestionsPlayer2[currentIndex];
//         document.getElementById("player-name").innerText = `${currentPlayer === 1 ? player1Name : player2Name}'s Turn`;
//         document.getElementById("question").innerText = `Q${currentIndex + 1}: ${qData.question}`;

//         const options = [
//             { label: 'A', option: qData.option1 },
//             { label: 'B', option: qData.option2 },
//             { label: 'C', option: qData.option3 },
//             { label: 'D', option: qData.option4 }
//         ];

//         // Now, grouping options A & B in one row and C & D in another row
//         document.getElementById("options").innerHTML = `
//             <div class="options-row">
//                 <button class="option-btn">${options[0].label}. ${options[0].option}</button>
//                 <button class="option-btn">${options[1].label}. ${options[1].option}</button>
//             </div>
//             <div class="options-row">
//                 <button class="option-btn">${options[2].label}. ${options[2].option}</button>
//                 <button class="option-btn">${options[3].label}. ${options[3].option}</button>
//             </div>
//         `;

//         document.querySelectorAll(".option-btn").forEach(button => {
//             button.addEventListener("click", function () {
//                 checkAnswer(this, button.innerText.split('. ')[1], qData.correct);
//             });
//         });
//     }

//     function checkAnswer(button, selected, correct) {
//         clearInterval(timer);

//         let buttons = document.querySelectorAll("#options button");
//         buttons.forEach(btn => btn.disabled = true);

//         if (selected.trim().toLowerCase() === correct.trim().toLowerCase()) {
//             button.style.backgroundColor = "green";
//             currentPlayer === 1 ? player1Score.correct++ : player2Score.correct++;
//         } else {
//             button.style.backgroundColor = "red";
//             currentPlayer === 1 ? player1Score.wrong++ : player2Score.wrong++;

//             buttons.forEach(btn => {
//                 if (btn.innerText.trim().toLowerCase().includes(correct.trim().toLowerCase())) {
//                     btn.style.backgroundColor = "green";
//                 }
//             });
//         }

//         setTimeout(() => {
//             currentIndex++;
//             loadQuestion();
//         }, 2000);
//     }

//     function resetTimer() {
//         clearInterval(timer);
//         timeLeft = 25;
//         document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

//         timer = setInterval(() => {
//             timeLeft--;
//             document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

//             if (timeLeft <= 0) {
//                 clearInterval(timer);
//                 // alert("⏳ Time's up!");
//                 currentIndex++;
//                 loadQuestion();
//             }
//         }, 1000);
//     }

//     function showFinalResult() {
//         document.body.innerHTML = `
//             <div class="result-container">
//                 <h2>Game Over! 🎉</h2>
//                 <div class="result-card">
//                     <p><span>${player1Name}</span></p>
//                     <p>✅ Correct: <span>${player1Score.correct}</span></p>
//                     <p>❌ Wrong: <span>${player1Score.wrong}</span></p>
//                 </div>
//                 ${totalPlayers === 2 ? `
//                 <div class="result-card red">
//                     <p><span>${player2Name}</span></p>
//                     <p>✅ Correct: <span>${player2Score.correct}</span></p>
//                     <p>❌ Wrong: <span>${player2Score.wrong}</span></p>
//                 </div>
//                 ` : ''}
//                 <button class="restart-btn" onclick="location.href='index.html'">🔄 Restart</button>
//             </div>
//         `;
//     }

//     function shuffleArray(array) {
//         return array.sort(() => Math.random() - 0.5);
//     }
// }

// ✅ Handle Quiz Setup Page (quiz.html)
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("fileInput")) {
        setupQuizPage();
    } else if (document.getElementById("question")) {
        startQuiz();
    }
});

// ✅ Setup Page Logic (File Upload & Player Name Entry)
function setupQuizPage() {
    const totalPlayers = localStorage.getItem("totalPlayers") || "1";

    // Show Player 2 input field if multiplayer mode is selected
    if (totalPlayers === "2") {
        document.getElementById("player2Div").style.display = "block";
    }

    document.getElementById("startQuizBtn").addEventListener("click", function () {
        const file = document.getElementById("fileInput").files[0];
        const mcqCount = document.getElementById("mcqCount").value;
        const player1Name = document.getElementById("player1Name").value.trim();
        const player2Name = document.getElementById("player2Name").value.trim();
        const userTimer = document.getElementById("userTimer").value || 30; // Default 30 sec

        if (!file) {
            alert("Please upload a CSV file.");
            return;
        }

        if (player1Name === "") {
            alert("Please enter Player 1's name.");
            return;
        }

        if (totalPlayers === "2" && player2Name === "") {
            alert("Please enter Player 2's name.");
            return;
        }

        // Store values in localStorage
        localStorage.setItem("mcqCount", mcqCount);
        localStorage.setItem("player1Name", player1Name);
        localStorage.setItem("player2Name", totalPlayers === "2" ? player2Name : "");
        localStorage.setItem("userTimer", userTimer); // Save timer setting

        // Read and store CSV content
        const reader = new FileReader();
        reader.onload = function (e) {
            localStorage.setItem("quizData", e.target.result);
            window.location.href = "play.html"; // Move to quiz page
        };
        reader.readAsText(file);
    });
}

// ✅ Quiz Game Logic (play.html)
function startQuiz() {
    let quizData = [];
    let selectedQuestionsPlayer1 = [];
    let selectedQuestionsPlayer2 = [];
    let currentIndex = 0;
    let timer;
    let userTimer = parseInt(localStorage.getItem("userTimer"), 10) || 30; // Get user-defined timer
    let timeLeft = userTimer;

    let player1Score = { correct: 0, wrong: 0 };
    let player2Score = { correct: 0, wrong: 0 };
    let totalPlayers = parseInt(localStorage.getItem("totalPlayers"), 10) || 1;
    let mcqCount = parseInt(localStorage.getItem("mcqCount"), 10) || 12;
    let currentPlayer = 1;

    let player1Name = localStorage.getItem("player1Name") || "Player 1";
    let player2Name = localStorage.getItem("player2Name") || "Player 2";

    const csvData = localStorage.getItem("quizData");

    if (csvData) {
        Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            complete: function (result) {
                quizData = result.data;
                if (quizData.length < mcqCount * totalPlayers) {
                    alert("Not enough questions in CSV for both players!");
                    return;
                }

                let shuffledData = shuffleArray(quizData);
                selectedQuestionsPlayer1 = shuffledData.slice(0, mcqCount);
                selectedQuestionsPlayer2 = shuffledData.slice(mcqCount, mcqCount * 2);

                loadQuestion();
            }
        });
    }

    function loadQuestion() {
        if (currentPlayer === 1 && currentIndex >= selectedQuestionsPlayer1.length) {
            if (totalPlayers === 2) {
                currentPlayer = 2;
                currentIndex = 0;
                alert(`${player1Name} finished! Now it's ${player2Name}'s turn.`);
                loadQuestion();
                return;
            } else {
                showFinalResult();
                return;
            }
        } else if (currentPlayer === 2 && currentIndex >= selectedQuestionsPlayer2.length) {
            showFinalResult();
            return;
        }

        resetTimer();

        const qData = currentPlayer === 1 ? selectedQuestionsPlayer1[currentIndex] : selectedQuestionsPlayer2[currentIndex];
        document.getElementById("player-name").innerText = `${currentPlayer === 1 ? player1Name : player2Name}'s Turn`;
        document.getElementById("question").innerText = `Q${currentIndex + 1}: ${qData.question}`;

        const options = [
            { label: 'A', option: qData.option1 },
            { label: 'B', option: qData.option2 },
            { label: 'C', option: qData.option3 },
            { label: 'D', option: qData.option4 }
        ];

        document.getElementById("options").innerHTML = `
            <div class="options-row">
                <button class="option-btn">${options[0].label}. ${options[0].option}</button>
                <button class="option-btn">${options[1].label}. ${options[1].option}</button>
            </div>
            <div class="options-row">
                <button class="option-btn">${options[2].label}. ${options[2].option}</button>
                <button class="option-btn">${options[3].label}. ${options[3].option}</button>
            </div>
        `;

        document.querySelectorAll(".option-btn").forEach(button => {
            button.addEventListener("click", function () {
                checkAnswer(this, button.innerText.split('. ')[1], qData.correct);
            });
        });
    }

    function checkAnswer(button, selected, correct) {
        clearInterval(timer);

        let buttons = document.querySelectorAll("#options button");
        buttons.forEach(btn => btn.disabled = true);

        if (selected.trim().toLowerCase() === correct.trim().toLowerCase()) {
            button.style.backgroundColor = "green";
            currentPlayer === 1 ? player1Score.correct++ : player2Score.correct++;
        } else {
            button.style.backgroundColor = "red";
            currentPlayer === 1 ? player1Score.wrong++ : player2Score.wrong++;

            buttons.forEach(btn => {
                if (btn.innerText.trim().toLowerCase().includes(correct.trim().toLowerCase())) {
                    btn.style.backgroundColor = "green";
                }
            });
        }

        setTimeout(() => {
            currentIndex++;
            loadQuestion();
        }, 2000);
    }

    function resetTimer() {
        clearInterval(timer);
        timeLeft = userTimer; // Reset timer based on user input
        document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

        timer = setInterval(() => {
            timeLeft--;
            document.getElementById("timer").innerText = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                currentIndex++;
                loadQuestion();
            }
        }, 1000);
    }

    function showFinalResult() {
        document.body.innerHTML = `
            <div class="result-container">
                <h2>Game Over! 🎉</h2>
                <div class="result-card">
                    <p><span>${player1Name}</span></p>
                    <p>✅ Correct: <span>${player1Score.correct}</span></p>
                    <p>❌ Wrong: <span>${player1Score.wrong}</span></p>
                </div>
                ${totalPlayers === 2 ? `
                <div class="result-card red">
                    <p><span>${player2Name}</span></p>
                    <p>✅ Correct: <span>${player2Score.correct}</span></p>
                    <p>❌ Wrong: <span>${player2Score.wrong}</span></p>
                </div>
                ` : ''}
                <button class="restart-btn" onclick="location.href='index.html'">🔄 Restart</button>
            </div>
        `;
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
}

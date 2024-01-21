const questionElement = document.getElementById('question');
const optionsElement = document.querySelector('.quiz-options');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const resultElement = document.getElementById('result');
const totalQuestionElement = document.getElementById('total-question');
const askedQuestionElement = document.getElementById('asked-question');
const details = document.getElementById('details')
const viewAnswerElement = document.getElementById('view-details');
if (viewAnswerElement)
{
viewAnswerElement.style.display="none";
};
//details.style.display="none"

let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;
let totalQuestion = 10;



async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(APIUrl);
    const data = await result.json();
    resultElement.innerHTML = '';
    showQuestion(data.results[0]);
}

function addEventListeners() {
    checkBtn.addEventListener('click', checkAnswer);
    playAgainBtn.addEventListener('click', restartQuiz);
    viewAnswerElement.addEventListener('click', viewDetails);
}
if (totalQuestionElement && askedQuestionElement)
{
document.addEventListener('DOMContentLoaded', function () {
    loadQuestion();
    askedQuestionElement.textContent = askedCount;
    totalQuestionElement.textContent = totalQuestion;

    addEventListeners();
});
}
function showQuestion(data) {
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    const incorrectAnswer = data.incorrect_answers;
    const optionsList = [...incorrectAnswer];
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    questionElement.innerHTML = `${data.question} <br> <span class="category"> ${data.category} </span>`;
    optionsElement.innerHTML = optionsList.map((option, index) => `
        <li> ${index + 1}. <span>${option}</span> </li>
    `).join('');
    selectOption();
}

function selectOption() {
    optionsElement.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            const activeOption = optionsElement.querySelector('.selected');
            if (activeOption) {
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

async function checkAnswer() {
    checkBtn.disabled = true;
    const selectedOption = optionsElement.querySelector('.selected');
    const playerScoreCell = document.querySelector(`#player-${username} .score`);
            if (playerScoreCell) {
                playerScoreCell.textContent = correctScore;
            }
    if (selectedOption) {
        const selectedAnswer = selectedOption.querySelector('span').textContent;
        const isCorrect = selectedAnswer === HTMLDecode(correctAnswer);
        // Send the user's answer to the server
        try {
            const response = await fetch('http://127.0.0.1:8080/quiz', {
                method: 'POST',  // Use POST method for inserting data
                headers: {
                    'Content-Type': 'application/json',  // Set the Content-Type header
                },
                body: JSON.stringify({
                    player: username,  // Use the retrieved username from URL
                    question: questionElement.textContent,
                    correctAnswer: correctAnswer,
                    score: correctScore,
                }),
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result); // You can log the response from the server if needed
            } else {
                const errorText = await response.text(); // Read the response content as text
                console.error('Error:', errorText); // Log the error text
            }
            console.log(result);  // You can log the response from the server if needed
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
            if (isCorrect) {
                correctScore++;
                resultElement.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
            } else {
                resultElement.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
            }
            checkCount();
        
    } else {
        resultElement.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
        checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    const doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
function showEndScreen() {
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'block';
}

function checkCount() {
    askedCount++;
    setCount();
    if (askedCount === totalQuestion) {
        setTimeout(function () {
            console.log(""); // What is the purpose of this empty console.log?
        }, 8080);
        resultElement.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        playAgainBtn.style.display = "block";
        viewAnswerElement.style.display = "block";
        checkBtn.style.display = "none";
        showEndScreen();
    } else {
        setTimeout(function () {
            loadQuestion();
        }, 300);
    }
}

const deleteProfileButton = document.getElementById('delete-profile');

if (deleteProfileButton) {
    deleteProfileButton.addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const player = urlParams.get('username'); // Get the player's username from URL

        if (!player) {
            console.error('Username not found in URL.');
            return;
        }

        try {
            const deleteResponse = await fetch(`http://127.0.0.1:8080/quiz/${player}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (deleteResponse.ok) {
                // Redirect to the homepage or a different appropriate page after successful deletion
                window.location.href = 'index.html';
                alert(player+' deleted !!') // Change this to your desired URL
            } else {
                const errorText = await deleteResponse.text();
                console.error('Error deleting profile:', errorText);
            }
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    });
}



function setCount() {
    totalQuestionElement.textContent = totalQuestion;
    askedQuestionElement.textContent = askedCount;
}

function restartQuiz() {
    correctScore = 0;
    askedCount = 0;
    playAgainBtn.style.display = "none";
    viewAnswerElement.style.display = "none"; // Hide the View Details button
    checkBtn.style.display = "block";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
    resultElement.innerHTML = ''; // Clear the result message

    const playerScoreCell = document.querySelector(`#player-${username} .score`);
    if (playerScoreCell) {
        playerScoreCell.textContent = 0;
    }
}

// ... Your existing functions ...

async function viewDetails() {
    try {
        const response = await fetch('http://127.0.0.1:8080/quiz', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();

            // Process the player details to remove duplicates and keep highest scores
            const processedDetails = {};
            for (const detail of result) {
                if (!processedDetails[detail.player] || detail.score > processedDetails[detail.player].score) {
                    processedDetails[detail.player] = detail;
                }
            }

            const modalDetails = document.getElementById('modal-details');
            modalDetails.innerHTML = ''; // Clear any previous content

            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Player</th>
                    <th>Score</th>
                </tr>
            `;

            // Sort the processed details by score in descending order
            const sortedDetails = Object.values(processedDetails).sort((a, b) => b.score - a.score);

            for (const detail of sortedDetails) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detail.player}</td>
                    <td>${detail.score}</td>
                `;
                table.appendChild(row);
            }

            modalDetails.appendChild(table);

            const modal = document.getElementById('details-modal');
            modal.style.display = 'block';

            const modalClose = document.getElementById('modal-close');
            modalClose.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        } else {
            const errorText = await response.text();
            console.error('Error:', errorText);
        }
    } catch (error) {
        console.error('Error fetching player details:', error);
    }
}







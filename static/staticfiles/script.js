// Pages
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");

// Splash Page
const startForm = document.getElementById("start-form");
const radioContainers = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");

// Countdown Page
const countdown = document.querySelector('.countdown');

// Game Page
const itemContainer = document.querySelector(".item-container");
const options = document.querySelectorAll(".option");

// Score Page
const finalCorrectScore = document.querySelector(".final-correct-score");
const finalIncorrectScore = document.querySelector(".final-incorrect-score");
const playAgainBtn = document.querySelector(".play-again");
const rowsContainer = document.querySelector(".rows-container");


// Words
let keyword = "";
let wordList = [];
let englishWords = [];
let germanWords = [];
let translationDict = {};
let position = 0;


// Scoring
let wordSelection = {};
let correctNumber = 0;
let incorrectNumber = 0;


// Play again
function playAgain() {
    scorePage.hidden = true;
    splashPage.hidden = false;
    resetScores();
}


// Bring Table to DOM
function scoresToDOM(finalScores) {
    finalScores.forEach(score => {
        // Create Row
        const item = document.createElement('div');
        item.classList.add("row")

        if (score['is_correct']) {
            item.classList.add('correct');
        } else {
            item.classList.add('incorrect');
        }

        // Create Inner Content
        const goal = document.createElement('div');
        goal.textContent = score['goal'];

        const selected = document.createElement('div');
        selected.textContent = score['selection'];

        const correctValue = document.createElement('div');
        if (!score['is_correct']) {
            correctValue.textContent = score['correct_value'];
        }

        // Bring div's together
        item.append(goal, selected, correctValue);
        rowsContainer.append(item);
    });
}


// Calculate Score
function calculateScore() {
    let finalScoreScreen = [];
    for(const [key, value] of Object.entries(wordSelection)) {
        let toPush = {
            'goal': key,
            'selection': value,
            'correct_value': translationDict[key]
        };

        if (value == translationDict[key]) {
            correctNumber++;
            toPush['is_correct'] = true;
        } else {
            incorrectNumber++;
            toPush['is_correct'] = false;
        }
        finalScoreScreen.push(toPush);
    }
    return finalScoreScreen;
}


// Display Final Screen
function transitionToFinalScreen() {
    gamePage.hidden = true;
    scorePage.hidden = false;

    let final = calculateScore();
    finalCorrectScore.textContent = `Correct: ${correctNumber}`;
    finalIncorrectScore.textContent = `Incorrect: ${incorrectNumber}`;
    
    scoresToDOM(final);
}


// Update Score
function updateGameDisplay(optionButtonId) {
    let optionButton = document.getElementById(optionButtonId);
    let optionValue = optionButton.value;

    let wordDisplay = itemContainer.textContent;
    wordSelection[wordDisplay] = optionValue;
    // Move to next Word and selection
    if (germanWords.length > position) {
        displayValue();
    } else {
        transitionToFinalScreen();
    }
}


// Show Game Page
function showGamePage() {
    gamePage.hidden = false;
    countdownPage.hidden = true;
}


// Display 3, 2, 1, GO!
function countdownStart() {
    let count = 3;
    countdown.textContent = count;
    const timeCountDown = setInterval(() => {
        count--;
        if (count == 0) {
            countdown.textContent = "GO!";
        } else if (count === -1) {
            showGamePage();
            clearInterval(timeCountDown);
        } else {
            countdown.textContent = count;
        }
    }, 1000);
}


// Display Game Screen
function displayValue() {
    let selectedWord = germanWords[position];

    itemContainer.textContent = selectedWord;

    let optionList = [];

    // Add correct answer
    let correctWord = translationDict[selectedWord];
    optionList.push(correctWord);

    let tempEnglishWords = [];
    englishWords.forEach(word => {
        if (word !== correctWord) {
            tempEnglishWords.push(word);
        }
    });

    // Add Two other Random English
    let randomNumber1 = Math.floor(Math.random()*tempEnglishWords.length);
    optionList.push(tempEnglishWords[randomNumber1]);

    // Remove added word
    tempEnglishWords.splice(randomNumber1, 1);
    let randomNumber2 = Math.floor(Math.random()*tempEnglishWords.length);

    optionList.push(tempEnglishWords[randomNumber2]);

    // Shuffle Option List
    shuffle(optionList);

    let i = 0;
    options.forEach((option) => {
        option.textContent = optionList[i];
        option.value = optionList[i];
        i++;
    });
    position++;
}


// Populate the Game Page
function populateGamePage() {
    wordList.forEach(word => {
        englishWords.push(word['English']);
        germanWords.push(word['German']);
        translationDict[word['German']] = word['English'];
    })

    shuffle(germanWords)
    shuffle(englishWords)
    
    displayValue();
}


// Countdown
function showCountDown() {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    populateGamePage();
    countdownStart();
}


// Gets the words list
function getSelectedWords() {
    let radioValue;
    radioInputs.forEach(radio => {
        if (radio.checked) {
            radioValue = radio.value;
        }
    });
    return radioValue;
}


// Resetting Scores
function resetScores() {
    germanWords = [];
    englishWords = [];
    position = 0;
    wordSelection = {};
    correctNumber = 0;
    incorrectNumber = 0;
    rowsContainer.innerHTML = '';
}


// Form that decides word list to use
function selectWordList(e) {
    e.preventDefault();
    resetScores();
    keyword = getSelectedWords();
    if (keyword) {
        $.ajax({
            type: "GET",
            url: "/process-data",
            contentType: 'application/json',
            data: {
                keyword: keyword
            },
            success: function(data) {
                wordList = JSON.parse(data);
                showCountDown();
            }
        });
    }
}



// Event Listeners
startForm.addEventListener("click", () => {
    radioContainers.forEach(radio => {
        radio.classList.remove("selected-label");

        if (radio.children[1].checked) {
            radio.classList.add("selected-label");
        }
    });
});

startForm.addEventListener("submit", selectWordList);
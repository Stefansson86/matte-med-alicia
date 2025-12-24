// ===== GAME STATE =====
let currentMode = null; // 'transitions' or 'division'
let currentAnswer = 0;
let currentNum1 = 0;
let currentNum2 = 0;
let currentOperation = null; // '+', '-', or '÷' for operation

// ===== DOM ELEMENTS =====
// Modals and screens
const modeMenu = document.getElementById('mode-menu');
const gameContainer = document.getElementById('game-container');

// Mode selection
const selectTransitionsModeBtn = document.getElementById('select-transitions-mode');
const selectDivisionModeBtn = document.getElementById('select-division-mode');
const switchModeBtn = document.getElementById('switch-mode-btn');
const modeText = document.getElementById('mode-text');

// Game elements
const questionEl = document.getElementById('question');
const answerGrid = document.getElementById('answer-grid');
const feedbackEl = document.getElementById('feedback');

// ===== INITIALIZATION =====
function init() {
    // Load saved data
    loadSavedData();

    // Set up event listeners
    setupEventListeners();

    // Show mode menu
    showModeMenu();
}

function loadSavedData() {
    // No saved data needed for current modes
}

function setupEventListeners() {
    // Mode selection
    selectTransitionsModeBtn.addEventListener('click', () => startMode('transitions'));
    selectDivisionModeBtn.addEventListener('click', () => startMode('division'));
    switchModeBtn.addEventListener('click', showModeMenu);
}

// ===== MODE MANAGEMENT =====
function showModeMenu() {
    modeMenu.classList.add('show');
    gameContainer.style.display = 'none';
}

function startMode(mode) {
    currentMode = mode;

    // Hide all modals
    modeMenu.classList.remove('show');

    // Show game container
    gameContainer.style.display = 'block';

    if (mode === 'transitions') {
        setupTransitionsMode();
    } else if (mode === 'division') {
        setupDivisionMode();
    }

    // Generate first problem
    generateProblem();
}

function setupTransitionsMode() {
    // Update UI
    document.body.classList.remove('division-mode');
    modeText.textContent = '📊 Övergångar';
}

function setupDivisionMode() {
    // Update UI
    document.body.classList.add('division-mode');
    modeText.textContent = '➗ Delat med';
}

// ===== PROBLEM GENERATION =====
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTransitionProblem() {
    // Randomly choose addition or subtraction
    const isAddition = Math.random() < 0.5;

    if (isAddition) {
        // Generate addition that crosses a ten
        do {
            currentNum1 = randomInt(11, 89);
        } while (currentNum1 % 10 === 0);

        const nextTen = Math.ceil(currentNum1 / 10) * 10;
        const distanceToTen = nextTen - currentNum1;
        currentNum2 = randomInt(distanceToTen + 1, Math.min(distanceToTen + 10, 20));

        currentOperation = '+';
        currentAnswer = currentNum1 + currentNum2;
    } else {
        // Generate subtraction that crosses a ten
        do {
            currentNum1 = randomInt(11, 90);
        } while (currentNum1 % 10 === 0);

        const prevTen = Math.floor(currentNum1 / 10) * 10;
        const distanceFromTen = currentNum1 - prevTen;
        currentNum2 = randomInt(distanceFromTen + 1, Math.min(distanceFromTen + 10, 20));

        currentOperation = '-';
        currentAnswer = currentNum1 - currentNum2;
    }
}

function generateDivisionProblem() {
    // Generate division with whole number result
    // Divisor: 1-10
    currentNum2 = randomInt(1, 10);

    // Quotient (answer): chosen so that dividend ≤ 100
    const maxQuotient = Math.floor(100 / currentNum2);
    currentAnswer = randomInt(1, maxQuotient);

    // Dividend: divisor × quotient
    currentNum1 = currentNum2 * currentAnswer;

    currentOperation = '÷';
}

function generateProblem() {
    // Clear feedback
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    // Generate numbers based on mode
    if (currentMode === 'transitions') {
        // Transitions mode - generate addition or subtraction that crosses tens
        generateTransitionProblem();
    } else if (currentMode === 'division') {
        // Division mode - generate division with whole number results
        generateDivisionProblem();
    }

    // Display question
    questionEl.textContent = `${currentNum1} ${currentOperation} ${currentNum2}`;

    // Generate and display answers
    const answers = generateAnswers(currentAnswer);
    shuffleArray(answers);

    const answerButtons = answerGrid.querySelectorAll('.answer-btn');
    answerButtons.forEach((btn, index) => {
        btn.textContent = answers[index];
        btn.dataset.answer = answers[index];
        btn.disabled = false;
        btn.className = 'answer-btn';

        // Remove old event listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Add click listener
        newBtn.addEventListener('click', () => handleAnswer(parseInt(newBtn.dataset.answer)));
    });
}

function generateAnswers(correctAnswer) {
    const answers = [correctAnswer];
    const wrongAnswers = new Set();

    while (wrongAnswers.size < 3) {
        let wrongAnswer;

        if (currentOperation === '+' || currentOperation === '-') {
            // Transitions-style wrong answers (for addition/subtraction)
            const strategy = randomInt(1, 3);

            if (strategy === 1) {
                wrongAnswer = correctAnswer + randomInt(-5, 5);
            } else if (strategy === 2) {
                if (currentOperation === '+') {
                    wrongAnswer = currentNum1 + currentNum2 - 10;
                } else {
                    wrongAnswer = currentNum1 - currentNum2 + 10;
                }
            } else {
                wrongAnswer = correctAnswer + randomInt(-8, 8);
            }
        } else if (currentOperation === '÷') {
            // Division-style wrong answers
            const strategy = randomInt(1, 3);

            if (strategy === 1) {
                wrongAnswer = correctAnswer + randomInt(-3, 3);
            } else if (strategy === 2) {
                wrongAnswer = correctAnswer + randomInt(-5, 5);
            } else {
                // Generate a random quotient
                const maxQuotient = Math.floor(100 / currentNum2);
                wrongAnswer = randomInt(1, maxQuotient);
            }
        }

        if (wrongAnswer > 0 &&
            wrongAnswer <= 120 &&
            wrongAnswer !== correctAnswer &&
            !wrongAnswers.has(wrongAnswer)) {
            wrongAnswers.add(wrongAnswer);
        }
    }

    return [...answers, ...Array.from(wrongAnswers)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ===== ANSWER HANDLING =====
function handleAnswer(selectedAnswer) {
    // Disable all buttons
    const answerButtons = answerGrid.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => {
        btn.disabled = true;
    });

    // Check if answer is correct
    if (selectedAnswer === currentAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer(selectedAnswer);
    }
}

// ===== POSITIVE FEEDBACK =====
const positiveFeedback = [
    "Rätt! 🎉",
    "Jättebra! ⭐",
    "Perfekt! 🌟",
    "Härligt! 🎈",
    "Superbt! 💪",
    "Fantastiskt! 🚀"
];

function handleCorrectAnswer() {
    // Highlight correct button
    const answerButtons = answerGrid.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => {
        if (parseInt(btn.dataset.answer) === currentAnswer) {
            btn.classList.add('correct');
        }
    });

    // Show positive feedback
    const message = positiveFeedback[randomInt(0, positiveFeedback.length - 1)];
    feedbackEl.textContent = message;
    feedbackEl.classList.add('positive');

    // Wait 1.5 seconds, then generate new problem
    setTimeout(() => {
        generateProblem();
    }, 1500);
}

function handleWrongAnswer(selectedAnswer) {
    // Highlight wrong and correct answers
    const answerButtons = answerGrid.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => {
        if (parseInt(btn.dataset.answer) === selectedAnswer) {
            btn.classList.add('wrong');
        }
        if (parseInt(btn.dataset.answer) === currentAnswer) {
            btn.classList.add('correct');
        }
    });

    // Show correct answer feedback
    feedbackEl.textContent = `Rätt svar är ${currentAnswer}`;
    feedbackEl.classList.add('negative');

    // Wait 2 seconds, then generate new problem
    setTimeout(() => {
        generateProblem();
    }, 2000);
}

// ===== START APPLICATION =====
init();

// ===== GAME STATE =====
let currentMode = null; // 'transitions' or 'division'
let currentStreak = 0;
let bestStreak = 0;
let strikes = 0;
let currentAnswer = 0;
let currentNum1 = 0;
let currentNum2 = 0;
let currentOperation = null; // '+', '-', or '÷' for operation

// Transitions mode state
let transitionStreak = 0; // Current streak (0-5)
let starsEarned = 0; // Stars earned (0-5)

// Division mode state
let divisionStreak = 0; // Current streak (0-5)
let divisionStarsEarned = 0; // Stars earned (0-5)

// ===== DOM ELEMENTS =====
// Modals and screens
const modeMenu = document.getElementById('mode-menu');
const tableSelection = document.getElementById('table-selection');
const gameContainer = document.getElementById('game-container');
const gameOverModal = document.getElementById('game-over-modal');
const referenceTableModal = document.getElementById('reference-table-modal');
const masteryModal = document.getElementById('mastery-modal');

// Mode selection
const selectTransitionsModeBtn = document.getElementById('select-transitions-mode');
const selectDivisionModeBtn = document.getElementById('select-division-mode');
const switchModeBtn = document.getElementById('switch-mode-btn');
const modeText = document.getElementById('mode-text');

// Table selection
const tableGrid = document.getElementById('table-grid');
const selectMixedBtn = document.getElementById('select-mixed');
const tableBackBtn = document.getElementById('table-back-btn');

// Game elements
const questionEl = document.getElementById('question');
const answerGrid = document.getElementById('answer-grid');
const feedbackEl = document.getElementById('feedback');

// Game mode stats
const gameStats = document.getElementById('game-stats');
const currentStreakEl = document.getElementById('current-streak');
const bestStreakEl = document.getElementById('best-streak');
const hearts = [
    document.getElementById('heart-1'),
    document.getElementById('heart-2'),
    document.getElementById('heart-3')
];

// Practice mode stats
const practiceStats = document.getElementById('practice-stats');
const practiceTableName = document.getElementById('practice-table-name');
const consecutiveCorrectEl = document.getElementById('consecutive-correct');
const totalAnsweredEl = document.getElementById('total-answered');
const accuracyEl = document.getElementById('accuracy');
const showTableBtn = document.getElementById('show-table-btn');

// Modals
const restartBtn = document.getElementById('restart-btn');
const finalStreakEl = document.getElementById('final-streak');
const encouragementEl = document.getElementById('encouragement');

// Reference table
const referenceTableTitle = document.getElementById('reference-table-title');
const referenceTable = document.getElementById('reference-table');
const closeTableBtn = document.getElementById('close-table-btn');

// Mastery modal
const masteryMessage = document.getElementById('mastery-message');
const masteryTotal = document.getElementById('mastery-total');
const masteryAccuracy = document.getElementById('mastery-accuracy');
const continuePracticeBtn = document.getElementById('continue-practice');
const newTableBtn = document.getElementById('new-table-btn');
const tryGameBtn = document.getElementById('try-game-btn');

// Transitions mode elements
const transitionsStats = document.getElementById('transitions-stats');
const starsContainer = document.getElementById('stars-container');

// Division mode elements
const divisionStats = document.getElementById('division-stats');
const divisionStarsContainer = document.getElementById('division-stars-container');

// Seven stars modal
const sevenStarsModal = document.getElementById('seven-stars-modal');
const continueAfterSevenBtn = document.getElementById('continue-after-seven');

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

    // Seven stars modal
    continueAfterSevenBtn.addEventListener('click', () => {
        sevenStarsModal.classList.remove('show');
        generateProblem();
    });
}

// ===== MODE MANAGEMENT =====
function showModeMenu() {
    modeMenu.classList.add('show');
    gameContainer.style.display = 'none';
    sevenStarsModal.classList.remove('show');
}

function startMode(mode) {
    currentMode = mode;

    // Hide all modals
    modeMenu.classList.remove('show');
    sevenStarsModal.classList.remove('show');

    // Show game container
    gameContainer.style.display = 'block';

    // Reset state
    resetGameState();

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

    // Show/hide appropriate headers
    gameStats.style.display = 'none';
    practiceStats.style.display = 'none';
    transitionsStats.style.display = 'flex';
    divisionStats.style.display = 'none';

    // Render stars
    renderStars();
}

function setupDivisionMode() {
    // Update UI
    document.body.classList.add('division-mode');
    modeText.textContent = '➗ Delat med';

    // Show/hide appropriate headers
    gameStats.style.display = 'none';
    practiceStats.style.display = 'none';
    transitionsStats.style.display = 'none';
    divisionStats.style.display = 'flex';

    // Render division stars
    renderDivisionStars();
}

function resetGameState() {
    transitionStreak = 0;
    divisionStreak = 0;
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

    if (currentMode === 'transitions') {
        // Transitions mode logic
        transitionStreak++;

        // Check for star (5 in a row)
        if (transitionStreak >= 5 && starsEarned < 5) {
            // Show positive feedback
            const message = positiveFeedback[randomInt(0, positiveFeedback.length - 1)];
            feedbackEl.textContent = message;
            feedbackEl.classList.add('positive');

            // Award star
            transitionStreak = 0;
            starsEarned++;
            renderStars();

            // Check if all 5 stars earned
            if (starsEarned >= 5) {
                setTimeout(() => {
                    showSevenStarsModal();
                }, 1500);
                return;
            } else {
                // Continue to next problem
                setTimeout(() => {
                    generateProblem();
                }, 1500);
                return;
            }
        }
    } else if (currentMode === 'division') {
        // Division mode logic
        divisionStreak++;

        // Check for star (5 in a row)
        if (divisionStreak >= 5 && divisionStarsEarned < 5) {
            // Show positive feedback
            const message = positiveFeedback[randomInt(0, positiveFeedback.length - 1)];
            feedbackEl.textContent = message;
            feedbackEl.classList.add('positive');

            // Award star
            divisionStreak = 0;
            divisionStarsEarned++;
            renderDivisionStars();

            // Check if all 5 stars earned
            if (divisionStarsEarned >= 5) {
                setTimeout(() => {
                    showSevenStarsModal();
                }, 1500);
                return;
            } else {
                // Continue to next problem
                setTimeout(() => {
                    generateProblem();
                }, 1500);
                return;
            }
        }
    }

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

    if (currentMode === 'transitions') {
        // Transitions mode logic - reset streak
        transitionStreak = 0;
    } else if (currentMode === 'division') {
        // Division mode logic - reset streak
        divisionStreak = 0;
    }

    // Wait 2 seconds, then generate new problem
    setTimeout(() => {
        generateProblem();
    }, 2000);
}


// ===== TRANSITIONS MODE FUNCTIONS =====
function renderStars() {
    starsContainer.innerHTML = '';

    // Star colors (rainbow)
    const starColors = [
        '#FF6B6B', // Red
        '#FFA500', // Orange
        '#FFD700', // Gold
        '#6BCF7F', // Green
        '#4ECDC4'  // Turquoise
    ];

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';

        if (i < starsEarned) {
            // Earned star - colored
            star.textContent = '⭐';
            star.style.color = starColors[i];
            star.classList.add('earned');
        } else {
            // Placeholder - white/gray star
            star.textContent = '⭐';
            star.classList.add('placeholder');
        }

        starsContainer.appendChild(star);
    }
}

function renderDivisionStars() {
    divisionStarsContainer.innerHTML = '';

    // Star colors (rainbow)
    const starColors = [
        '#FF6B6B', // Red
        '#FFA500', // Orange
        '#FFD700', // Gold
        '#6BCF7F', // Green
        '#4ECDC4'  // Turquoise
    ];

    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';

        if (i < divisionStarsEarned) {
            // Earned star - colored
            star.textContent = '⭐';
            star.style.color = starColors[i];
            star.classList.add('earned');
        } else {
            // Placeholder - white/gray star
            star.textContent = '⭐';
            star.classList.add('placeholder');
        }

        divisionStarsContainer.appendChild(star);
    }
}

function showSevenStarsModal() {
    sevenStarsModal.classList.add('show');
}

// ===== START APPLICATION =====
init();

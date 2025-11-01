// ===== GAME STATE =====
let currentMode = null; // 'game', 'practice', or 'transitions'
let currentStreak = 0;
let bestStreak = 0;
let strikes = 0;
let currentAnswer = 0;
let currentNum1 = 0;
let currentNum2 = 0;
let currentOperation = null; // '+' or '-' for transitions mode

// Practice mode state
let selectedTable = null; // null means mixed
let consecutiveCorrect = 0;
let totalAnswered = 0;
let correctAnswers = 0;
let practiceProgress = {}; // Stores mastery status for each table

// Transitions mode state
let transitionStreak = 0; // Current streak (0-5)
let starsEarned = 0; // Stars earned (0-5)

// ===== DOM ELEMENTS =====
// Modals and screens
const modeMenu = document.getElementById('mode-menu');
const tableSelection = document.getElementById('table-selection');
const gameContainer = document.getElementById('game-container');
const gameOverModal = document.getElementById('game-over-modal');
const referenceTableModal = document.getElementById('reference-table-modal');
const masteryModal = document.getElementById('mastery-modal');

// Mode selection
const selectGameModeBtn = document.getElementById('select-game-mode');
const selectPracticeModeBtn = document.getElementById('select-practice-mode');
const selectTransitionsModeBtn = document.getElementById('select-transitions-mode');
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
    // Load game mode best streak
    const savedBestStreak = localStorage.getItem('bestStreak');
    if (savedBestStreak) {
        bestStreak = parseInt(savedBestStreak);
    }

    // Load practice progress
    const savedProgress = localStorage.getItem('practiceProgress');
    if (savedProgress) {
        practiceProgress = JSON.parse(savedProgress);
    }
}

function setupEventListeners() {
    // Mode selection
    selectGameModeBtn.addEventListener('click', () => startMode('game'));
    selectPracticeModeBtn.addEventListener('click', () => showTableSelection());
    selectTransitionsModeBtn.addEventListener('click', () => startMode('transitions'));
    switchModeBtn.addEventListener('click', showModeMenu);

    // Table selection
    tableBackBtn.addEventListener('click', showModeMenu);
    selectMixedBtn.addEventListener('click', () => startMode('practice', null));

    // Game over
    restartBtn.addEventListener('click', restartGame);

    // Reference table
    showTableBtn.addEventListener('click', showReferenceTable);
    closeTableBtn.addEventListener('click', () => {
        referenceTableModal.classList.remove('show');
    });

    // Mastery modal
    continuePracticeBtn.addEventListener('click', () => {
        masteryModal.classList.remove('show');
        startMode('practice', selectedTable);
    });

    newTableBtn.addEventListener('click', () => {
        masteryModal.classList.remove('show');
        showTableSelection();
    });

    tryGameBtn.addEventListener('click', () => {
        masteryModal.classList.remove('show');
        startMode('game');
    });

    // Seven stars modal
    continueAfterSevenBtn.addEventListener('click', () => {
        sevenStarsModal.classList.remove('show');
        generateProblem();
    });
}

// ===== MODE MANAGEMENT =====
function showModeMenu() {
    modeMenu.classList.add('show');
    tableSelection.classList.remove('show');
    gameContainer.style.display = 'none';
    gameOverModal.classList.remove('show');
    masteryModal.classList.remove('show');
}

function showTableSelection() {
    modeMenu.classList.remove('show');
    tableSelection.classList.add('show');
    renderTableGrid();
}

function startMode(mode, table = null) {
    currentMode = mode;
    selectedTable = table;

    // Hide all modals
    modeMenu.classList.remove('show');
    tableSelection.classList.remove('show');
    gameOverModal.classList.remove('show');
    masteryModal.classList.remove('show');
    sevenStarsModal.classList.remove('show');

    // Show game container
    gameContainer.style.display = 'block';

    // Reset state
    resetGameState();

    if (mode === 'game') {
        setupGameMode();
    } else if (mode === 'practice') {
        setupPracticeMode();
    } else if (mode === 'transitions') {
        setupTransitionsMode();
    }

    // Generate first problem
    generateProblem();
}

function setupGameMode() {
    // Update UI
    document.body.classList.remove('practice-mode');
    document.body.classList.remove('transitions-mode');
    modeText.textContent = '🎮 Spelläge';

    // Show/hide appropriate headers
    gameStats.style.display = 'flex';
    practiceStats.style.display = 'none';
    transitionsStats.style.display = 'none';

    // Update stats
    bestStreakEl.textContent = bestStreak;
    currentStreakEl.textContent = currentStreak;

    // Reset hearts
    hearts.forEach(heart => heart.classList.remove('faded'));
}

function setupPracticeMode() {
    // Update UI
    document.body.classList.add('practice-mode');
    document.body.classList.remove('transitions-mode');

    if (selectedTable) {
        modeText.textContent = `📖 Övningsläge: ${selectedTable}× Tabellen`;
        practiceTableName.textContent = `${selectedTable}× Tabellen`;
    } else {
        modeText.textContent = '📖 Övningsläge: Blandade';
        practiceTableName.textContent = 'Blandade Tabeller';
    }

    // Show/hide appropriate headers
    gameStats.style.display = 'none';
    practiceStats.style.display = 'block';
    transitionsStats.style.display = 'none';

    // Reset practice stats
    updatePracticeStats();
}

function setupTransitionsMode() {
    // Update UI
    document.body.classList.add('transitions-mode');
    document.body.classList.remove('practice-mode');
    modeText.textContent = '📊 Öva Övergångar';

    // Show/hide appropriate headers
    gameStats.style.display = 'none';
    practiceStats.style.display = 'none';
    transitionsStats.style.display = 'flex';

    // Render stars
    renderStars();
}

function resetGameState() {
    currentStreak = 0;
    strikes = 0;
    consecutiveCorrect = 0;
    totalAnswered = 0;
    correctAnswers = 0;
    transitionStreak = 0;
}

// ===== TABLE SELECTION =====
function renderTableGrid() {
    tableGrid.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'table-btn';
        btn.textContent = i;

        // Check if mastered
        if (practiceProgress[i] && practiceProgress[i].mastered) {
            btn.classList.add('mastered');
        }

        btn.addEventListener('click', () => startMode('practice', i));
        tableGrid.appendChild(btn);
    }
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

function generateProblem() {
    // Clear feedback
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback';

    // Generate numbers based on mode
    if (currentMode === 'transitions') {
        // Transitions mode - generate addition or subtraction that crosses tens
        generateTransitionProblem();
    } else if (currentMode === 'practice' && selectedTable !== null) {
        // Practice mode with specific table
        currentNum1 = selectedTable;
        currentNum2 = randomInt(1, 10);
        currentOperation = '×';

        // 50% chance to swap
        if (Math.random() < 0.5) {
            [currentNum1, currentNum2] = [currentNum2, currentNum1];
        }

        // Calculate correct answer
        currentAnswer = currentNum1 * currentNum2;
    } else {
        // Game mode or mixed practice
        currentNum1 = randomInt(1, 10);
        currentNum2 = randomInt(1, 10);
        currentOperation = '×';

        // Calculate correct answer
        currentAnswer = currentNum1 * currentNum2;
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

        if (currentMode === 'transitions') {
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
        } else {
            const strategy = randomInt(1, 3);

            if (strategy === 1) {
                wrongAnswer = correctAnswer + randomInt(-10, 10);
            } else if (strategy === 2) {
                wrongAnswer = correctAnswer + randomInt(-5, 5);
            } else {
                wrongAnswer = randomInt(1, 10) * randomInt(1, 10);
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

    if (currentMode === 'practice') {
        totalAnswered++;
    }

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

    if (currentMode === 'game') {
        // Game mode logic
        currentStreak++;
        currentStreakEl.textContent = currentStreak;

        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            bestStreakEl.textContent = bestStreak;
            localStorage.setItem('bestStreak', bestStreak);
        }
    } else if (currentMode === 'practice') {
        // Practice mode logic
        correctAnswers++;
        consecutiveCorrect++;
        updatePracticeStats();

        // Check for mastery (5 in a row)
        if (consecutiveCorrect >= 5) {
            // Show positive feedback
            const message = positiveFeedback[randomInt(0, positiveFeedback.length - 1)];
            feedbackEl.textContent = message;
            feedbackEl.classList.add('positive');

            // Mark as mastered
            if (selectedTable !== null) {
                if (!practiceProgress[selectedTable]) {
                    practiceProgress[selectedTable] = {};
                }
                practiceProgress[selectedTable].mastered = true;
                localStorage.setItem('practiceProgress', JSON.stringify(practiceProgress));
            }

            // Wait then show mastery modal
            setTimeout(() => {
                showMasteryModal();
            }, 1500);
            return;
        }
    } else if (currentMode === 'transitions') {
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

    if (currentMode === 'game') {
        // Game mode logic
        strikes++;
        if (strikes <= 3) {
            hearts[strikes - 1].classList.add('faded');
        }

        // Check if game over
        if (strikes >= 3) {
            setTimeout(() => {
                showGameOver();
            }, 2000);
            return;
        }
    } else if (currentMode === 'practice') {
        // Practice mode logic - reset consecutive counter
        consecutiveCorrect = 0;
        updatePracticeStats();
    } else if (currentMode === 'transitions') {
        // Transitions mode logic - reset streak
        transitionStreak = 0;
    }

    // Wait 2 seconds, then generate new problem
    setTimeout(() => {
        generateProblem();
    }, 2000);
}

// ===== PRACTICE MODE STATS =====
function updatePracticeStats() {
    consecutiveCorrectEl.textContent = `${consecutiveCorrect}/5`;
    totalAnsweredEl.textContent = totalAnswered;

    const accuracy = totalAnswered > 0
        ? Math.round((correctAnswers / totalAnswered) * 100)
        : 0;
    accuracyEl.textContent = `${accuracy}%`;
}

// ===== REFERENCE TABLE =====
function showReferenceTable() {
    const table = selectedTable || 7; // Default to 7 if mixed
    referenceTableTitle.textContent = `${table}× Tabellen`;

    referenceTable.innerHTML = '';

    for (let i = 1; i <= 10; i++) {
        const row = document.createElement('div');
        row.className = 'table-row';

        // Highlight current problem if applicable
        if (selectedTable &&
            ((currentNum1 === table && currentNum2 === i) ||
             (currentNum2 === table && currentNum1 === i))) {
            row.classList.add('current-problem');
        }

        const problem = document.createElement('span');
        problem.textContent = `${table} × ${i}`;

        const answer = document.createElement('span');
        answer.textContent = table * i;

        row.appendChild(problem);
        row.appendChild(answer);
        referenceTable.appendChild(row);
    }

    referenceTableModal.classList.add('show');
}

// ===== MASTERY MODAL =====
function showMasteryModal() {
    const tableName = selectedTable
        ? `${selectedTable}× tabellen`
        : 'blandade tabeller';

    masteryMessage.textContent = `Du behärskar ${tableName}!`;
    masteryTotal.textContent = totalAnswered;

    const accuracy = Math.round((correctAnswers / totalAnswered) * 100);
    masteryAccuracy.textContent = `${accuracy}%`;

    masteryModal.classList.add('show');
}

// ===== GAME OVER =====
function showGameOver() {
    finalStreakEl.textContent = currentStreak;

    let encouragement;
    if (currentStreak === 0) {
        encouragement = "Ingen fara! Multiplikation tar lite tid att lära sig. 🌱";
    } else if (currentStreak >= 1 && currentStreak <= 4) {
        encouragement = "Bra början! Fortsätt öva på dina multiplikationstabeller! 🌟";
    } else if (currentStreak >= 5 && currentStreak <= 9) {
        encouragement = "Jättebra! Du håller på att bli expert på multiplikation! 🎈";
    } else {
        encouragement = "Fantastiskt! Du är en riktig multiplikationschampion! 🏆";
    }

    encouragementEl.textContent = encouragement;
    gameOverModal.classList.add('show');
}

function restartGame() {
    gameOverModal.classList.remove('show');
    startMode('game');
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

function showSevenStarsModal() {
    sevenStarsModal.classList.add('show');
}

// ===== START APPLICATION =====
init();

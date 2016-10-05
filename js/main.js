var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var START_PAGE = 'START_PAGE';
var GO_TO_NEXT_LEVEL_PAGE = 'GO_TO_NEXT_LEVEL_PAGE';
var GAME_PAGE = 'GAME_PAGE';
var END_GAME_PAGE = 'END_GAME_PAGE';

var levels = [
    {
        topic: topics.cores,
        time: 5,
        wordsNumber: 15,
        scorePerWord: 50
    },
    {
        topic: topics.frutas,
        time: 4,
        wordsNumber: 12,
        scorePerWord: 55
    },
    {
        topic: topics.animais,
        time: 3,
        wordsNumber: 10,
        scorePerWord: 60
    },
    {
        topic: topics.comidas,
        time: 2,
        wordsNumber: 8,
        scorePerWord: 65
    },
    {
        topic: topics.paises,
        time: 1,
        wordsNumber: 6,
        scorePerWord: 70
    }
];

var uiState = createInitialUiState();
var gameState = createInitialGameState();

main();

function main(){
    registerButtonsListeners();
    goToStartPage();
    animloop();
}

function animloop(){
    crossBrowserRequestAnimatonFrame(animloop);
    frameLoop();
}

// executado 60 vezes por segundo
function frameLoop(){
    clearCanvas();

    switch (gameState.currentPage){
        case START_PAGE: return renderStartPageElements();
        case END_GAME_PAGE: return renderEndGamePageElements();
        case GO_TO_NEXT_LEVEL_PAGE: return renderNextLevelPageElements();
        default: renderGamePageElements();
    }
}

function clearCanvas() {
    context.fillStyle = '#fcfcfc';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderStartPageElements() {
    uiState.startPage.background.doRender();
    uiState.startPage.button.doRender();
    uiState.startPage.text.doRender();
}

function renderNextLevelPageElements() {
    uiState.nextLevelPage.background.doRender();
    uiState.nextLevelPage.button.doRender();
    uiState.nextLevelPage.text.doRender();
}

function renderEndGamePageElements() {
    uiState.endGamePage.background.doRender();
    uiState.endGamePage.endGameText.doRender();
    uiState.endGamePage.yourScoreText.doRender();
    uiState.endGamePage.highscoreText.doRender();
    uiState.endGamePage.button.doRender();
}

function renderGamePageElements() {
    uiState.background.doRender();
    uiState.leftRectangle.doRender();
    uiState.remainingTimeText.doRender();
    uiState.inputBar.doRender();
    uiState.backspaceButton.doRender();
    uiState.scoreText.doRender();
    uiState.topicText.doRender();
    uiState.wordTextTitle.doRender();
    uiState.currentLevelText.doRender();

    uiState.selectedSyllablesButtons.forEach(function (selectedSyllablesButton) {
        selectedSyllablesButton.doRender();
    });

    Object.keys(uiState.syllablesChoicesButtonsMap).forEach(function (key) {
        uiState.syllablesChoicesButtonsMap[key].forEach(function (syllablesChoicesButton) {
            syllablesChoicesButton.doRender();
        });
    });

    Object.keys(uiState.wordsTextsMap).forEach(function (key) {
        uiState.wordsTextsMap[key].doRender();
    });
}

function addButton(button) {
    uiState.buttons.push(button);
}

function removeButton(button) {
    arrayRemove(uiState.buttons, button);
}

function startTimer(time, cbTimeout, cbChanged) {
    var unsub;
    var now = new Date();
    var endsAt = addMinutes(now, time);

    gameState.timer = {
        startedAt: now,
        endsAt: endsAt,
        remainingTime: getRemainingTime(endsAt),
        stop: function () {
            clearInterval(unsub);
            gameState.timer.remainingTime.total = 0;
        }
    };

    unsub = setInterval(function () {
        var remainingTime = getRemainingTime(gameState.timer.endsAt);
        gameState.timer.remainingTime = remainingTime;

        (cbChanged || noop)(remainingTime);

        if(remainingTime.total <=0){
            clearInterval(unsub);
            (cbTimeout || noop)();
        }
    }, 100);
}


function testWords() {
    var selectedSyllables = uiState.selectedSyllablesButtons.map(function (selectedSyllableButton) {
        return selectedSyllableButton.text;
    });

    for (var i = 0; i < gameState.wordsSyllables.length; i++) {
        var wordSyllables = gameState.wordsSyllables[i];

        if(arraysEqual(wordSyllables, selectedSyllables)
            && !arrayContains(gameState.completedWordsSyllables, wordSyllables)){

            return handleWordFormed(wordSyllables);
        }
    }

    return false;
}

function handleWordFormed(wordSyllables) {
    console.log('Word Formed!', wordSyllables);

    uiState.selectedSyllablesButtons = [];

    var word = wordSyllables.join('');

    gameState.completedWordsSyllables.push(wordSyllables);
    uiState.wordsTextsMap[word].text = word;

    wordSyllables.forEach(function (syllable) {
        uiState.syllablesChoicesButtonsMap[syllable]
            .filter(function (button) {
                return button.disabled;
            })
            .forEach(function (button) {
                arrayRemove(uiState.syllablesChoicesButtonsMap[syllable], button);
                removeButton(button);
            });
    });

    addScore(gameState.currentLevel.scorePerWord);
    uiState.scoreText.text = 'Pontuação: ' + gameState.score;

    if(gameState.completedWordsSyllables.length === gameState.wordsSyllables.length){
        handleLevelEnded();
    }

    return wordSyllables;
}

function handleLevelEnded(){

    addScore(gameState.timer.remainingTime.seconds);

    if(gameState.levels.indexOf(gameState.currentLevel) === gameState.levels.length-1){
        handleGameEnded();
        return;
    }

    (gameState.timer.stop || noop)();

    goToNextLevel();
}

function goToNextLevel() {

    var nextLevelIndex = (gameState.currentLevel) ? (getCurrentLevelIndex()+1) : 0;
    gameState.currentLevel = gameState.levels[nextLevelIndex];

    gameState.timer.remainingTime.total = 0;
    gameState.completedWordsSyllables = [];

    buildGoToNextLevelPage();

    gameState.currentPage = GO_TO_NEXT_LEVEL_PAGE;
}

function goToStartPage() {

    gameState.currentPage = START_PAGE;

    buildStartPage();
}

function handleGameEnded() {
    (gameState.timer.stop || noop)();

    if(getHighscore() < gameState.score){
        setHighscore(gameState.score);
    }

    buildEndGamePage();
    gameState.gameEnded = true;
    gameState.currentPage = END_GAME_PAGE;
}

function setHighscore(score) {
    window.localStorage.setItem('highscore', score);
}

function getHighscore() {
    return window.localStorage.getItem('highscore');
}

function getCurrentLevelIndex() {
    return gameState.levels.indexOf(gameState.currentLevel);
}

function addScore(score) {
    gameState.score += score;
}

function registerButtonsListeners(){

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(evt);

        uiState.buttons.forEach(function(button){
            if(button.disabled) return;

            if(isInside(mousePos, button) && (typeof button.onClick === 'function')){
                button.onClick();
            }
        });

    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(evt);

        var hoveringSomething = false;

        uiState.buttons.forEach(function(button){
            if(button.disabled) return;

            button.setHovering(isInside(mousePos, button));

            hoveringSomething = hoveringSomething || button.hovering;
        });

        canvas.style.cursor = hoveringSomething ? 'pointer' : 'default';

    }, false);
}

function resetUiState() {
    uiState = createInitialUiState();
}

function createInitialUiState() {
    return {
        rightRectangle: new Rectangle({pos: {x: 200, y: 0}}),
        lastSyllablesChoicesButton: null,
        buttons: [],

        //to render
        selectedSyllablesButtons: [],
        syllablesChoicesButtonsMap: {},
        wordsTextsMap: {},
        leftRectangle: null,
        remainingTimeText: null,
        inputBar: null,
        backspaceButton: null,
        scoreText: null,
        topicText: null,
        wordTextTitle: null,
        nextLevelPage: {
            background: null,
            button: null,
            text: null
        },
        startPage: {
            background: null,
            button: null,
            text: null
        },
        endGamePage: {
            background: null,
            button: null,
            yourScoreText: null,
            highscoreText: null,
            endGameText: null
        }
    };
}

function createInitialGameState() {
    return {
        gameEnded: false,
        score: 0,
        timer: {
            remainingTime: {}
        },
        syllables: [],
        wordsSyllables: [],
        completedWordsSyllables: [],
        levels: levels,
        currentLevel: null,
        currentPage: START_PAGE
    };
}
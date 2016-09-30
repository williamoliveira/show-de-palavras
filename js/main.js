var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var levels = [
    {
        topic: topics.cores,
        time: 2.25
    },
    {
        topic: topics.frutas,
        time: 2
    },
    {
        topic: topics.animais,
        time: 1.75
    },
    {
        topic: topics.comidas,
        time: 1.50
    },
    {
        topic: topics.paises,
        time: 1.25
    },
    {
        topic: topics.profissoes,
        time: 1
    },
    {
        topic: topics.objetos,
        time: 0.75
    },
    {
        topic: topics.plantas,
        time: 0.5
    }
];

var uiState = createInitialUiState();
var gameState = createInitialGameState();

main();

function main(){
    registerButtonsListeners();
    buildLevel(gameState.currentLevel);

    animloop();
    function animloop(){
        crossBrowserRequestAnimatonFrame(animloop);
        frameLoop();
    }
}

// executado 60 vezes por segundo, não fazer operações pesadas
function frameLoop(){
    clearCanvas();

    if(gameState.gameEnded){
        renderEndGamePageElements();
        return;
    }

    if(gameState.timer.remainingTime.total <= 0){
        renderNextLevelPageElements();
        return;
    }

    renderGamePageElements();
}

function clearCanvas() {
    context.fillStyle = '#fcfcfc';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderNextLevelPageElements() {
    uiState.nextLevelPage.background.doRender();
    uiState.nextLevelPage.button.doRender();
}

function renderEndGamePageElements() {
    uiState.endGamePage.background.doRender();
    uiState.endGamePage.yourScoreText.doRender();
    uiState.endGamePage.highscoreText.doRender();
    uiState.endGamePage.button.doRender();
}

function renderGamePageElements() {
    uiState.remainingTimeText.doRender();
    uiState.inputBar.doRender();
    uiState.backspaceButton.doRender();
    uiState.scoreText.doRender();
    uiState.topicText.doRender();
    uiState.wordTextTitle.doRender();

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

function buildEndGamePage() {
    uiState = createInitialUiState();

    uiState.endGamePage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#f1f1f1'
    });

    uiState.endGamePage.yourScoreText = new Text({
        pos: {
            x: 325,
            y: 300
        },
        text: 'Sua pontuação: ' + gameState.score
    });

    uiState.endGamePage.highscoreText = new Text({
        pos: {
            x: 320  ,
            y: 340
        },
        text: 'Maior pontuação: ' + getHighscore()
    });


    uiState.endGamePage.button = new Button({
        pos: {
            x: 325,
            y: 400
        },
        text: 'Jogar novamente',
        onClick: function () {
            gameState.currentLevel = gameState.levels[0];

            uiState.score = 0;
            uiState.selectedSyllablesButtons = [];
            uiState.buttons = [];
            uiState.lastSyllablesChoicesButton = null;
            uiState.syllablesChoicesButtonsMap = {};
            uiState.wordsTextsMap = {};

            buildLevel(gameState.currentLevel);
            gameState.gameEnded = false;
        }
    });

    addButton(uiState.endGamePage.button);
}

function buildGoToNextLevelPage() {
    uiState = createInitialUiState();

    uiState.nextLevelPage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#f1f1f1'
    });

    uiState.nextLevelPage.text = new Text({
        pos: {
            x: 325,
            y: 400
        }
    });

    uiState.nextLevelPage.button = new Button({
        pos: {
            x: 325,
            y: 400
        },
        text: 'Pŕoximo nível >',
        onClick: function () {
            var currentLevelIndex = gameState.levels.indexOf(gameState.currentLevel);

            gameState.currentLevel = gameState.levels[currentLevelIndex+1];

            uiState.selectedSyllablesButtons = [];
            uiState.buttons = [];
            uiState.lastSyllablesChoicesButton = null;
            uiState.syllablesChoicesButtonsMap = {};
            uiState.wordsTextsMap = {};

            buildLevel(gameState.currentLevel);
        }
    });

    addButton(uiState.nextLevelPage.button);
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

function buildLevel(level) {
    var topic = level.topic;

    var words = arrayPickRandom(topic.words, 10);

    var wordsSyllables = words.map(function (word) {
        return word.split('-');
    });

    var syllables = arrayShuffle(arrayFlatten(wordsSyllables));

    gameState.wordsSyllables = wordsSyllables;
    gameState.syllables = syllables;

    console.log(gameState.wordsSyllables);

    buildSyllablesChoicesButtons();
    buildInput();
    buildGui();

    startTimer(
        level.time,
        function () {
            handleLevelEnded();
            console.log('Timeout');
        },
        function (remainingTime) {
            uiState.remainingTimeText.text = 'Tempo restate: ' + formatTime(remainingTime);
        }
    );
}

function buildGui() {

    uiState.topicText = new Text({
        pos: {
            x: 10,
            y: 10
        },
        text: 'Tema: ' + gameState.currentLevel.topic.name
    });

    uiState.wordTextTitle = new Text({
        pos: {
            x: 10,
            y: 60
        },
        text: 'Palavras:'
    });

    var lastWordText;

    gameState.wordsSyllables.forEach(function (wordsSyllable) {
        var wordText = new Text({
            pos: {
                x: 10,
                y: lastWordText ? lastWordText.endPos.y : 90
            },
            text: wordsSyllable.map(function () {return '□'}).join(' ')
        });

        uiState.wordsTextsMap[wordsSyllable.join('')] = wordText;

        lastWordText = wordText;
    });


    uiState.remainingTimeText = new Text({
        pos: {
            x: 10,
            y: canvas.height - 40
        },
        text: ' '
    });

    uiState.scoreText = new Text({
        pos: {
            x: 250,
            y: canvas.height - 40
        },
        text: 'Pontuação: ' + gameState.score
    });
}

function buildInput() {

    var posY = uiState.lastSyllablesChoicesButton.endPos.y + 20;

    uiState.inputBar = new Rectangle({
        relativeFrom: uiState.rightRectangle,
        pos: {x: 10, y: posY},
        width: 500,
        height: 40,
        bgColor: '#F1F1F1'
    });

    uiState.backspaceButton =  new Button({
        relativeFrom: uiState.inputBar,
        text: '⌫',
        pos: {x: 455, y: 5},
        width: 40,
        onClick: function () {
            var lastSyllablesButton = uiState.selectedSyllablesButtons.pop();

            if(!lastSyllablesButton) return;

            var choiceButton = uiState.syllablesChoicesButtonsMap[lastSyllablesButton.text].filter(function (btn) {
                return btn.disabled === true;
            })[0];

            choiceButton.disabled = false;
        }
    });

    addButton(uiState.backspaceButton);
}

function buildSyllablesChoicesButtons(){

    var initialPos = uiState.rightRectangle.pos;

    var lastButton = new Button({pos: {
        x: initialPos.x,
        y: initialPos.y-20
    }});

    gameState.syllables.forEach(function (syllable, i) {

        var isLineBreak = (i%10 === 0);

        var posX = ((isLineBreak) ? initialPos.x : lastButton.pos.x+lastButton.width)+10;
        var posY = (isLineBreak) ? lastButton.endPos.y+10 : lastButton.pos.y;

        var pos = {
            x: posX,
            y: posY
        };

        var button = new SyllableChoiceButton({
            pos: pos,
            text: syllable,
            onClick: function () {
                if(addSyllableToInput(this.text)) this.disabled = true;
            }
        });

        addButton(button);
        uiState.syllablesChoicesButtonsMap[syllable] = uiState.syllablesChoicesButtonsMap[syllable] || [];
        uiState.syllablesChoicesButtonsMap[syllable].push(button);

        lastButton = button;
    });

    uiState.lastSyllablesChoicesButton = lastButton;
}

function addSyllableToInput(syllable) {

    var first = uiState.selectedSyllablesButtons[0];
    var last = uiState.selectedSyllablesButtons[uiState.selectedSyllablesButtons.length-1];

    var pos = {
        x: (last) ? last.pos.x+last.width+5 : uiState.inputBar.pos.x+5,
        y: uiState.inputBar.pos.y+5
    };

    var button = new Button({
        text: syllable,
        pos: pos
    });

    first = first ? first : button;

    if(button.endPos.x-first.pos.x > uiState.inputBar.width-55) return false;

    uiState.selectedSyllablesButtons.push(button);

    testWords();

    return true;
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

    var thisScore = Math.floor(gameState.timer.remainingTime.total/1000);

    gameState.score += ((thisScore >= 0) ? thisScore : 0);
    uiState.scoreText.text = 'Pontuação: ' + gameState.score;

    if(gameState.levels.indexOf(gameState.currentLevel) === gameState.levels.length-1){
        handleGameEnded();
    }
    else if(gameState.completedWordsSyllables.length === gameState.wordsSyllables.length){
        handleLevelEnded();
    }

    return wordSyllables;
}

function handleLevelEnded(){
    (gameState.timer.stop || noop)();
    gameState.timer.remainingTime.total = 0;
    gameState.completedWordsSyllables = [];
    buildGoToNextLevelPage();
}

function handleGameEnded() {
    (gameState.timer.stop || noop)();

    if(getHighscore() < gameState.score){
        setHighscore(gameState.score);
    }

    buildEndGamePage();
    gameState.gameEnded = true;
}

function setHighscore(score) {
    window.localStorage.setItem('highscore', score);
}

function getHighscore() {
    return window.localStorage.getItem('highscore');
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

function createInitialUiState() {
    return {
        rightRectangle: new Rectangle({pos: {x: 200, y: 0}}),
        lastSyllablesChoicesButton: null,
        buttons: [],

        //to render
        selectedSyllablesButtons: [],
        syllablesChoicesButtonsMap: {},
        wordsTextsMap: {},
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
        endGamePage: {
            background: null,
            button: null,
            yourScoreText: null,
            highscoreText: null
        }
    };
}

function createInitialGameState() {
    return {
        gameEnded: false,
        score: 0,
        timer: {},
        syllables: [],
        wordsSyllables: [],
        completedWordsSyllables: [],
        levels: levels,
        currentLevel: levels[0]
    };
}
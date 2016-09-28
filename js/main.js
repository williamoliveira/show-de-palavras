var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var levels = [
    {
        topic: topics.cores,
        time: 1
    },
    {
        topic: topics.frutas,
        time: 2.5
    }
];

var uiState = {
    renderables: [],
    buttons: [],
    selectedSyllablesButtons: [],
    syllablesChoicesButtonsMap: {},
    wordsTextsMap: {},
    lastSyllablesChoicesButton: null,
    rightRectangle: new Rectangle({pos: {x: 200, y: 0}}),
    remainingTimeText: null,
    inputBar: null,
    scoreText: null
};

var gameState = {
    score: 0,
    timer: 0,
    syllables: [],
    wordsSyllables: [],
    completedWordsSyllables: [],
    levels: levels,
    currentLevel: levels[0]
};

main();

function main(){
    registerButtonsListeners();

    buildLevel(gameState.currentLevel);

    buildSyllablesChoicesButtons();
    buildInput();
    buildGui();

    animloop();
    function animloop(){
        crossBrowserRequestAnimatonFrame(animloop);
        frameLoop();
    }
}

function frameLoop(){
    var hoveringSomething = false;

    uiState.buttons.forEach(function(button) {
        hoveringSomething = hoveringSomething || button.hovering;
    });

    canvas.style.cursor = hoveringSomething ? 'pointer' : 'default';

    clearCanvas();
    renderRenderables();
}

function clearCanvas() {
    context.fillStyle = '#fcfcfc';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function addRenderable(renderable) {
    uiState.renderables.push(renderable);
}

function removeRenderable(renderable) {
    arrayRemove(uiState.renderables, renderable);
}

function removeRenderables(renderables) {
    renderables.forEach(function (renderable) {
        arrayRemove(uiState.renderables, renderable);
    });
}

function addButton(button) {
    uiState.buttons.push(button);
}

function removeButton(button) {
    arrayRemove(uiState.buttons, button);
}

function renderRenderables() {
    uiState.renderables.forEach(function(renderable) {
        renderable.render();
    });
}

function startTimer(time, cbTimeout, cbChanged) {

    var now = new Date();
    var endsAt = addMinutes(now, time);

    gameState.timer = {
        startedAt: now,
        endsAt: endsAt,
        remainingTime: getRemainingTime(endsAt)
    };

    var unsub = setInterval(function () {
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

    startTimer(
        level.time,
        function () {
            console.log('Timeout');
        },
        function (remainingTime) {
            uiState.remainingTimeText.text = 'Tempo restate: ' + formatTime(remainingTime);
        }
    );
}

function buildGui() {

    addRenderable(new Text({
        pos: {
            x: 10,
            y: 10
        },
        text: 'Tema: ' + gameState.currentLevel.topic.name
    }));

    addRenderable(new Text({
        pos: {
            x: 10,
            y: 60
        },
        text: 'Palavras:'
    }));

    var lastWordText;

    gameState.wordsSyllables.forEach(function (wordsSyllable) {
        var wordText = new Text({
            pos: {
                x: 10,
                y: lastWordText ? lastWordText.endPos.y : 90
            },
            text: wordsSyllable.map(function () {return '□'}).join(' ')
        });


        addRenderable(wordText);
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
    addRenderable(uiState.remainingTimeText);

    uiState.scoreText = new Text({
        pos: {
            x: 250,
            y: canvas.height - 40
        },
        text: 'Pontuação: 0'
    });
    addRenderable(uiState.scoreText);
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
    addRenderable(uiState.inputBar);

    var backspaceButton = new Button({
        relativeFrom: uiState.inputBar,
        text: '⌫',
        pos: {x: 455, y: 5},
        width: 40,
        onClick: function () {
            var lastSyllablesButton = uiState.selectedSyllablesButtons.pop();

            if(!lastSyllablesButton) return;

            removeRenderable(lastSyllablesButton);

            var choiceButton = uiState.syllablesChoicesButtonsMap[lastSyllablesButton.text].filter(function (btn) {
                return btn.disabled === true;
            })[0];

            choiceButton.disabled = false;
        }
    });

    addRenderable(backspaceButton);
    addButton(backspaceButton);
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

        addRenderable(button);
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


    addRenderable(button);
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

            console.log('Word Formed!', wordSyllables);

            removeRenderables(uiState.selectedSyllablesButtons);
            uiState.selectedSyllablesButtons = [];

            var word = wordSyllables.join('');

            gameState.completedWordsSyllables.push(wordSyllables);
            uiState.wordsTextsMap[word].text = word;

            wordSyllables.forEach(function (syllable) {
                var button = uiState.syllablesChoicesButtonsMap[syllable].pop();

                if(!button) return;

                removeButton(button);
                removeRenderable(button);
            });

            gameState.score += (gameState.timer.remainingTime.total/1000);
            uiState.scoreText.text = 'Pontuação: ' + gameState.score;

            return wordSyllables;
        }
    }

    return false;
}

function registerButtonsListeners(){

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(evt);

        uiState.buttons.forEach(function(button){
            if(button.disabled) return;

            var box = {
                pos: button.pos,
                width: button.width,
                height: button.height
            };

            if(isInside(mousePos, box) && typeof button.onClick === 'function'){
                button.onClick();
            }
        });

    }, false);

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(evt);

        uiState.buttons.forEach(function(button){
            if(button.disabled) return button.setHovering(false);

            var box = {
                pos: button.pos,
                width: button.width,
                height: button.height
            };

            button.setHovering(isInside(mousePos, box));
        });

    }, false);
}
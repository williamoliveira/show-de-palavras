var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var uiState = {
    renderables: [],
    buttons: [],
    selectedSyllablesButtons: [],
    syllablesChoicesButtons: {},
    wordsTexts: {},
    lastSyllablesChoicesButton: null
};

var gameState = {
    topic: null,
    syllables: [],
    wordsSyllables: [],
    completedWordsSyllables: []
};

var rightRectangle = new Rectangle({
    pos: {x: 200, y: 0}
});
var inputBar;


main();

function main(){
    registerButtonsListeners();

    buildLevel();

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

function buildLevel() {
    var topic = arrayPickRandom(topics);

    var words = arrayPickRandom(topic.words, 10);

    var wordsSyllables = words.map(function (word) {
        return word.split('-');
    });

    var syllables = arrayShuffle(arrayFlatten(wordsSyllables));

    console.log(wordsSyllables);

    gameState.topic = topic;
    gameState.wordsSyllables = wordsSyllables;
    gameState.syllables = syllables;
}

function buildGui() {

    addRenderable(new Text({
        pos: {
            x: 10,
            y: 10
        },
        text: 'Tema: ' + gameState.topic.topic
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
        uiState.wordsTexts[wordsSyllable.join('')] = wordText;

        lastWordText = wordText;
    });

}

function buildInput() {

    var posY = uiState.lastSyllablesChoicesButton.endPos.y + 20;

    inputBar = new Rectangle({
        relativeFrom: rightRectangle,
        pos: {x: 10, y: posY},
        width: 500,
        height: 40,
        bgColor: '#F1F1F1'
    });
    addRenderable(inputBar);

    var backspaceButton = new Button({
        relativeFrom: inputBar,
        text: '⌫',
        pos: {x: 455, y: 5},
        width: 40,
        onClick: function () {
            var lastSyllablesButtons
                = uiState.selectedSyllablesButtons[uiState.selectedSyllablesButtons.length-1];

            removeRenderable(lastSyllablesButtons);
            arrayRemove(uiState.selectedSyllablesButtons, lastSyllablesButtons);
        }
    });

    addRenderable(backspaceButton);
    addButton(backspaceButton);
}

function buildSyllablesChoicesButtons(){

    var initialPos = rightRectangle.pos;

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
            text: syllable
        });

        addRenderable(button);
        addButton(button);
        uiState.syllablesChoicesButtons[syllable] = uiState.syllablesChoicesButtons[syllable] || [];
        uiState.syllablesChoicesButtons[syllable].push(button);

        lastButton = button;
    });

    uiState.lastSyllablesChoicesButton = lastButton;
}

function addSyllableToInput(syllable) {

    var first = uiState.selectedSyllablesButtons[0];
    var last = uiState.selectedSyllablesButtons[uiState.selectedSyllablesButtons.length-1];

    var pos = {
        x: (last) ? last.pos.x+last.width+5 : inputBar.pos.x+5,
        y: inputBar.pos.y+5
    };

    var button = new Button({
        text: syllable,
        pos: pos
    });

    first = first ? first : button;

    if(button.endPos.x-first.pos.x > inputBar.width-55) return;


    addRenderable(button);
    uiState.selectedSyllablesButtons.push(button);

    testWords();
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
            uiState.wordsTexts[word].text = word;

            wordSyllables.forEach(function (syllable) {
                var button = uiState.syllablesChoicesButtons[syllable].pop();

                if(!button) return;

                removeButton(button);
                removeRenderable(button);
            });

            return wordSyllables;
        }
    }

    return false;
}

function registerButtonsListeners(){

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(evt);

        uiState.buttons.forEach(function(button){

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

            var box = {
                pos: button.pos,
                width: button.width,
                height: button.height
            };

            button.setHovering(isInside(mousePos, box));
        });

    }, false);
}
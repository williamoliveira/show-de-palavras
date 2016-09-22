var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var state = {
    renderables: [],
    buttons: [],
    syllables: ["ba", "la", "ci", "gue", "ar", "ir", "sa", "pi", "to", "ga", "ta", "si"],
    wordsSyllables: [["ba", "la"], ["sa", "ci"]],
    selectedSyllablesButtons: []
};

var rightRectangle = new Rectangle({
    pos: {x: 100, y: 40}
});
var inputBar;


main();

function main(){
    registerButtonsListeners();

    buildInput();
    buildSyllablesChoicesButtons();

    (function animloop(){
        requestAnimFrame(animloop);
        frameLoop();
    })();
}

function frameLoop(){
    var hoveringSomething = false;

    state.buttons.forEach(function(button) {
        hoveringSomething = hoveringSomething || button.hovering;
    });

    canvas.style.cursor = hoveringSomething ? 'pointer' : 'default';

    renderRenderables();
}

function addRenderable(renderable) {
    state.renderables.push(renderable);
}

function removeRenderable(renderable) {
    removeFromArray(state.renderables, renderable);
}

function renderRenderables() {
    state.renderables.forEach(function(renderable) {
        renderable.render();
    });
}

function buildInput() {

    inputBar = new Rectangle({
        relativeFrom: rightRectangle,
        pos: {x: 10, y: 100},
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
            var lastSyllablesButtons = state.selectedSyllablesButtons[
                state.selectedSyllablesButtons.length-1
                ];

            removeFromArray(state.selectedSyllablesButtons, lastSyllablesButtons);
            removeRenderable(lastSyllablesButtons);
        }
    });

    addRenderable(backspaceButton);
    state.buttons.push(backspaceButton);
}

function buildSyllablesChoicesButtons(){

    var fromPosX = rightRectangle.pos.x;
    var fromPosY = rightRectangle.pos.y;

    state.syllables.forEach(function (syllable, i) {

        var pos = {
            x: fromPosX+10,
            y: fromPosY+10
        };

        var button = new SyllableChoiceButton({
            pos: pos,
            text: syllable
        });

        addRenderable(button);
        state.buttons.push(button);

        // fromPosX = (i !== 0 && i%10 === 0) ? rightRectangle.pos.x : button.pos.x+button.width;
        fromPosX = button.pos.x+button.width;
        // fromPosY = rightRectangle.pos.x + Math.floor(i/10)*40;
    })
}

function addSyllableToInput(syllable) {

    var last = state.selectedSyllablesButtons[state.selectedSyllablesButtons.length-1];

    var pos = {
        x: (last) ? last.pos.x+last.width+5 : inputBar.pos.x+5,
        y: inputBar.pos.y+5
    };

    var button = new Button({
        text: syllable,
        pos: pos,
        onClick: function () {
            addSyllableToInput()
        }
    });

    addRenderable(button);
    state.selectedSyllablesButtons.push(button);

    testWords();
}

function testWords() {
    var selectedSyllables = state.selectedSyllablesButtons.map(function (selectedSyllableButton) {
        return selectedSyllableButton.text;
    });

    for (var i = 0; i < state.wordsSyllables.length; i++) {
        var word = state.wordsSyllables[i];

        if(arraysEqual(word, selectedSyllables)){
            console.log('word formed');

            return word;
        }
    }

    return false;
}

function registerButtonsListeners(){

    canvas.addEventListener('click', function(evt) {
        var mousePos = getMousePos(evt);

        state.buttons.forEach(function(button){

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

        state.buttons.forEach(function(button){

            var box = {
                pos: button.pos,
                width: button.width,
                height: button.height
            };

            button.hovering = isInside(mousePos, box);
        });

    }, false);
}
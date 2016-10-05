function buildSyllablesChoicesButtons(){

    var initialPos = uiState.rightRectangle.pos;

    var lastButton = new Button({pos: {
        x: initialPos.x,
        y: initialPos.y+20
    }});

    gameState.syllables.forEach(function (syllable, i) {

        var isLineBreak = (i%9 === 0);

        var posX = ((isLineBreak) ? initialPos.x : lastButton.pos.x+lastButton.width)+10;
        var posY = (isLineBreak) ? lastButton.endPos.y+20 : lastButton.pos.y;

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
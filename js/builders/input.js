function buildInput() {

    var posY = uiState.lastSyllablesChoicesButton.endPos.y + 110;

    uiState.inputBar = new Rectangle({
        relativeFrom: uiState.rightRectangle,
        pos: {x: 25, y: posY},
        width: 540,
        height: 41,
        bgColor: '#E6E6FA',
        borderRadius: {
            upperLeft: 8,
            upperRight: 8,
            lowerLeft: 8,
            lowerRight: 8
        },
        borderStyle: 'black',
        borderWidth: 3
    });

    uiState.backspaceButton =  new Button({
        relativeFrom: uiState.inputBar,
        text: '◄',
        pos: {x: 496, y: 4},
        width: 40,
        onClick: deleteLastSelectedSyllable
    });

    addButton(uiState.backspaceButton);
}

function deleteLastSelectedSyllable() {
    var lastSyllablesButton = uiState.selectedSyllablesButtons.pop();

    if(!lastSyllablesButton) return;

    var choiceButton = uiState.syllablesChoicesButtonsMap[lastSyllablesButton.text].filter(function (btn) {
        return btn.disabled === true;
    })[0];

    choiceButton.disabled = false;
}
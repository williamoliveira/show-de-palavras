function buildInput() {

    var posY = uiState.lastSyllablesChoicesButton.endPos.y + 20;

    uiState.inputBar = new Rectangle({
        relativeFrom: uiState.rightRectangle,
        pos: {x: 10, y: posY},
        width: 540,
        height: 40,
        bgColor: '#28C0D7',
        borderRadius: {
            upperLeft: 8,
            upperRight: 8,
            lowerLeft: 8,
            lowerRight: 8
        },
        borderStyle: '#0196AE',
        borderWidth: 3
    });

    uiState.backspaceButton =  new Button({
        relativeFrom: uiState.inputBar,
        text: '⌫',
        pos: {x: 495, y: 5},
        width: 40,
        borderWidth: 0,
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
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
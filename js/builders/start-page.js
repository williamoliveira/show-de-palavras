function buildStartPage() {
    resetUiState();

    uiState.startPage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#f1f1f1'
    });

    uiState.startPage.text = new Text({
        pos: {
            x: canvas.width/2,
            y: 300
        },
        textAlign: 'center',
        wrap: true,
        text: 'Show das palavras'
    });


    uiState.startPage.button = new Button({
        pos: {
            x: 335,
            y: 400
        },
        text: 'Jogar',
        onClick: function () {
            buildLevel(gameState.currentLevel);
        }
    });

    addButton(uiState.startPage.button);
}

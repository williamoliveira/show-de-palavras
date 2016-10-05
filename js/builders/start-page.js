function buildStartPage() {
    resetUiState();

    uiState.startPage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#2FD5EB'
    });

    uiState.startPage.text = new Text({
        pos: {
            x: canvas.width/2,
            y: 250
        },
        fontSize: 40,
        lineHeight: 30,
        wrapMaxWidth: 500,
        textAlign: 'center',
        wrap: true,
        text: 'Show das Palavras'
    });


    uiState.startPage.button = new Button({
        pos: {
            x: 365,
            y: 400
        },
        text: 'Jogar',
        onClick: function () {
            goToNextLevel();
        }
    });

    addButton(uiState.startPage.button);
}

function buildStartPage() {
    resetUiState();

    uiState.startPage.text = new Text({
        pos: {
            x: canvas.width/2,
            y: 250
        },
		fontFamily: 'Maiandra GD',
		textColor: 'yellow',
        fontSize: 45,
        lineHeight: 30,
        wrapMaxWidth: 500,
        textAlign: 'center',
        wrap: true,
        text: 'Show das Palavras'
    });


    uiState.startPage.button = new Button({
        pos: {
            x: 350,
            y: 400
        },
		width: 95,
        height: 36,
        text: ' Jogar',
		onClick: function () {
            goToNextLevel();
        }
    });

    addButton(uiState.startPage.button);
}
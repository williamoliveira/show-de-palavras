function buildEndGamePage() {
    resetUiState();

    uiState.endGamePage.endGameText = new Text({
        pos: {
            x: 300,
            y: 200
        },
        fontSize: 30,
        lineHeight: 30,
        wrapMaxWidth: 500,
        wrap: true,
        text: 'Fim de Jogo!',
		fontFamily: 'Maiandra GD',
		textColor: 'yellow'
    });

    uiState.endGamePage.yourScoreText = new Text({
        pos: {
            x: 325,
            y: 300
        },
        textColor: 'white',
		text: 'Sua pontuação: ' + gameState.score
    });

    uiState.endGamePage.highscoreText = new Text({
        pos: {
            x: 300  ,
            y: 340
        },
        textColor: 'white',
		text: 'Maior pontuação: ' + getHighscore()
    });

    uiState.endGamePage.button = new Button({
        pos: {
            x: 300,
            y: 400
        },
        width: 220,
        height: 35,
		text: ' Jogar novamente',
        onClick: function () {
            gameState.currentLevel = null;

            uiState.score = 0;
            uiState.selectedSyllablesButtons = [];
            uiState.buttons = [];
            uiState.lastSyllablesChoicesButton = null;
            uiState.syllablesChoicesButtonsMap = {};
            uiState.wordsTextsMap = {};

            gameState.gameEnded = false;

            goToStartPage();
        }
    });

    addButton(uiState.endGamePage.button);
}
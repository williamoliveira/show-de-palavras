function buildEndGamePage() {
    resetUiState();

    uiState.endGamePage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#2FD5EB'
    });

    uiState.endGamePage.endGameText = new Text({
        pos: {
            x: canvas.width/2,
            y: 200
        },
        fontSize: 30,
        lineHeight: 30,
        wrapMaxWidth: 500,
        textAlign: 'center',
        wrap: true,
        text: 'Fim de Jogo'
    });

    uiState.endGamePage.yourScoreText = new Text({
        pos: {
            x: canvas.width/2,
            y: 280
        },
        textAlign: 'center',
        wrap: true,
        text: 'Sua pontuação: ' + gameState.score
    });

    uiState.endGamePage.highscoreText = new Text({
        pos: {
            x: canvas.width/2,
            y: 320
        },
        textAlign: 'center',
        wrap: true,
        text: 'Maior pontuação: ' + getHighscore()
    });

    uiState.endGamePage.button = new Button({
        pos: {
            x: 325,
            y: 400
        },
        text: 'Jogar novamente',
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
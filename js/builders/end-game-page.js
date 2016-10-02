function buildEndGamePage() {
    resetUiState();

    uiState.endGamePage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#f1f1f1'
    });

    uiState.endGamePage.yourScoreText = new Text({
        pos: {
            x: 310,
            y: 300
        },
        text: 'Fim de jogo'
    });

    uiState.endGamePage.yourScoreText = new Text({
        pos: {
            x: 325,
            y: 300
        },
        text: 'Sua pontuação: ' + gameState.score
    });

    uiState.endGamePage.highscoreText = new Text({
        pos: {
            x: 320  ,
            y: 340
        },
        text: 'Maior pontuação: ' + getHighscore()
    });


    uiState.endGamePage.button = new Button({
        pos: {
            x: 325,
            y: 400
        },
        text: 'Jogar novamente',
        onClick: function () {
            gameState.currentLevel = gameState.levels[0];

            uiState.score = 0;
            uiState.selectedSyllablesButtons = [];
            uiState.buttons = [];
            uiState.lastSyllablesChoicesButton = null;
            uiState.syllablesChoicesButtonsMap = {};
            uiState.wordsTextsMap = {};

            buildLevel(gameState.currentLevel);
            gameState.gameEnded = false;
        }
    });

    addButton(uiState.endGamePage.button);
}
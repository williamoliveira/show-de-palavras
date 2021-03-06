function buildGoToNextLevelPage() {
    resetUiState();

    uiState.nextLevelPage.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: 'blue'
    });

    uiState.nextLevelPage.text = new Text({
        pos: {
            x: canvas.width/2,
            y: 280
        },
		fontFamily: 'Maiandra GD',
		textColor: '#00008B',
		fontSize: 17,
		textAlign: 'center',
        wrap: true,
        text: 'Bem vindo ao nível ' + (getCurrentLevelIndex()+1) + ', \n'
        + 'o tema é "' + gameState.currentLevel.topic.name + '" e você terá \n' 
		+ gameState.currentLevel.wordsNumber + ' palavras para acertar \n'
        + 'em até ' + gameState.currentLevel.time + ' minutos'
    });


    uiState.nextLevelPage.button = new Button({
        pos: {
            x: 350,
            y: 430
        },
		width: 115,
        height: 35,
        text: 'Começar',
		onClick: function () {
            buildLevel(gameState.currentLevel);
        }
    });

    addButton(uiState.nextLevelPage.button);
}

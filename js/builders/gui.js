function buildGui() {

    uiState.topicText = new Text({
        pos: {
            x: 10,
            y: 10
        },
        text: 'Tema: ' + gameState.currentLevel.topic.name
    });

    uiState.wordTextTitle = new Text({
        pos: {
            x: 10,
            y: 60
        },
        text: 'Palavras:'
    });

    var lastWordText;

    gameState.wordsSyllables.forEach(function (wordsSyllable) {
        var wordText = new Text({
            pos: {
                x: 10,
                y: lastWordText ? lastWordText.endPos.y : 90
            },
            text: wordsSyllable.map(function () {return '□'}).join(' ')
        });

        uiState.wordsTextsMap[wordsSyllable.join('')] = wordText;

        lastWordText = wordText;
    });


    uiState.remainingTimeText = new Text({
        pos: {
            x: 10,
            y: canvas.height - 40
        },
        text: 'Tempo restante: 00:00'
    });

    uiState.scoreText = new Text({
        pos: {
            x: 250,
            y: canvas.height - 40
        },
        text: 'Pontuação: ' + gameState.score
    });

    uiState.currentLevelText = new Text({
        pos: {
            x: 450,
            y: canvas.height - 40
        },
        text: 'Nível ' + (getCurrentLevelIndex()+1) + ' de ' + gameState.levels.length
    });
}
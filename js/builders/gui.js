function buildGui() {

    uiState.leftRectangle = new Rectangle({
        pos: {
            x: 10,
            y: 10
        },
        width: 180,
        height: canvas.height-20,
        bgColor: '#D80451',
        borderRadius: {
            upperLeft: 8,
            upperRight: 8,
            lowerLeft: 8,
            lowerRight: 8
        },
        borderStyle: '#4E4E4E',
        borderWidth: 0
    });

    uiState.background = new Rectangle({
        pos: {
            x: 0,
            y: 0
        },
        width: canvas.width,
        height: canvas.height,
        bgColor: '#2FD5EB'
    });

    uiState.topicText = new Text({
        pos: {
            x: 20,
            y: 20
        },
        text: 'Tema: ' + gameState.currentLevel.topic.name,
        textColor: '#FFF'
    });

    uiState.wordTextTitle = new Text({
        pos: {
            x: 20,
            y: 60
        },
        text: 'Palavras:',
        textColor: '#FFF'
    });

    var lastWordText;

    gameState.wordsSyllables.forEach(function (wordsSyllable) {
        var wordText = new Text({
            pos: {
                x: 20,
                y: lastWordText ? lastWordText.endPos.y : 90
            },
            text: wordsSyllable.map(function () {return '-'}).join(' '),
            textColor: '#FFF'
        });

        uiState.wordsTextsMap[wordsSyllable.join('')] = wordText;

        lastWordText = wordText;
    });


    uiState.remainingTimeText = new Text({
        pos: {
            x: 220,
            y: canvas.height - 40
        },
        text: 'Tempo restante: 00:00'
    });

    uiState.scoreText = new Text({
        pos: {
            x: 460,
            y: canvas.height - 40
        },
        text: 'Pontuação: ' + gameState.score
    });

    uiState.currentLevelText = new Text({
        pos: {
            x: 650,
            y: canvas.height - 40
        },
        text: 'Nível ' + (getCurrentLevelIndex()+1) + ' de ' + gameState.levels.length
    });
}
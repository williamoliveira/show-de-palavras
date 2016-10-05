function buildGui() {

    uiState.leftRectangle = new Rectangle({
        pos: {
            x: 10,
            y: 10
        },
        width: 180,
        height: canvas.height-15,
        bgColor: '#EEDD82',
        borderRadius: {
            upperLeft: 8,
            upperRight: 8,
            lowerLeft: 8,
            lowerRight: 8
        },
        borderStyle: '#4E4E4E',
        borderWidth: 0
    });

    uiState.topicText = new Text({
        pos: {
            x: 20,
            y: 20
        },
        text: 'Tema: ' + gameState.currentLevel.topic.name,
        textColor: 'blue',
        fontsize: 12
    });

    uiState.wordTextTitle = new Text({
        pos: {
            x: 20,
            y: 50
        },
        text: 'Palavras:',
        fontSize: 14,
        textColor: '#EEDD82'
    });

    var lastWordText;

    gameState.wordsSyllables.forEach(function (wordsSyllable) {
        var wordText = new Text({
            pos: {
                x: 20,
                y: lastWordText ? lastWordText.endPos.y : 80
            },
            text: wordsSyllable.map(function () {return '—'}).join(' ')
        });

        uiState.wordsTextsMap[wordsSyllable.join('')] = wordText;

        lastWordText = wordText;
    });


    uiState.remainingTimeText = new Text({
        pos: {
            x: 220,
            y: canvas.height - 40
        },
        textColor: '#EE0000',
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
        textColor: '#00008B',
        text: 'Nível ' + (getCurrentLevelIndex()+1) + ' de ' + gameState.levels.length
    });
}
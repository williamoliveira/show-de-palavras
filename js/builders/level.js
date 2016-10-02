function buildLevel(level) {
    var topic = level.topic;

    var words = arrayPickRandom(topic.words, level.wordsNumber);

    var wordsSyllables = words.map(function (word) {
        return word.split('-');
    });

    var syllables = arrayShuffle(arrayFlatten(wordsSyllables));

    gameState.wordsSyllables = wordsSyllables;
    gameState.syllables = syllables;

    console.log(gameState.wordsSyllables);

    buildSyllablesChoicesButtons();
    buildInput();
    buildGui();

    startTimer(
        level.time,
        function () {
            handleLevelEnded();
            console.log('Timeout');
        },
        function (remainingTime) {
            uiState.remainingTimeText.text = 'Tempo restante: ' + formatTime(remainingTime);
        }
    );

    gameState.currentPage = GAME_PAGE;
}
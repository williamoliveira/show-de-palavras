
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
window.crossBrowserRequestAnimatonFrame = (function(){
    return  window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback, element){ // fallback
            window.setTimeout(callback, 1000 / 60);
        };
})();

function noop() {}

function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.pos.x
        && pos.x < rect.pos.x+rect.width
        && pos.y < rect.pos.y+rect.height
        && pos.y > rect.pos.y;
}

function arrayContains(array, element) {
    return array.indexOf(element) !== -1;
}

function arrayRemove(array, item) {
    var index = array.indexOf(item);

    if(index < 0) return;

    return array.splice(index, 1);
}

function arraysEqual(array1, array2) {
    if (array1 === array2) return true;
    if (array1 == null || array2 == null) return false;
    if (array1.length !== array2.length) return false;

    for (var i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) return false;
    }

    return true;
}

function randomBetween(start, end) {
    return Math.floor(Math.random() * end) + start;
}

function arrayPickRandom(array, quant) {
    return (!quant)
        ? array[randomBetween(0, array.length)]
        : arrayShuffle(array).slice(0, quant);
}

function arrayShuffle(array) {
    var index = -1;
    var length = array.length;
    var result = Array(length);

    while (++index < length) {
        var rand = Math.floor(Math.random() * (index + 1));
        result[index] = result[rand];
        result[rand] = array[index];
    }

    return result;
}

function arrayFlatten(arrays) {
    return [].concat.apply([], arrays);
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function getRemainingTime(endtime){
    var t = endtime - new Date();

    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );

    return {
        'total': t,
        'minutes': minutes,
        'seconds': seconds
    };
}

function formatTime(time) {
    return pad(time.minutes, 2) + ':' +  pad(time.seconds, 2);
}

function pad(str, max) {
    str = str.toString();

    return str.length < max ? pad("0" + str, max) : str;
}
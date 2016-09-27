
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

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

function randomBetween(start, end) {
    return Math.floor(Math.random() * end) + start;
}

function arrayPickRandom(array, quant) {
    return !quant ? array[randomBetween(0, array.length)] : arrayShuffle(array).slice(0, quant);
}

function arrayShuffle(array) {
    var rand, index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
        rand = Math.floor(Math.random() * (index + 1));
        result[index] = result[rand];
        result[rand] = array[index];
    }

    return result;
}

function arrayFlatten(arrays) {
    return [].concat.apply([], arrays);
}
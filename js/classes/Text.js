function Text(attributes) {
    Rectangle.call(this, attributes);

    this.text = attributes.text || 'Text';
    this.width = attributes.width || ((this.text.length*10)+10);
    this.textColor = attributes.textColor || '#000000';
    this.fontFamily = attributes.fontFamily || 'Segoe Ui';
    this.fontSize = attributes.fontSize || 16;
    this.bgColor = attributes.bgColor || null;
    this.textAlign = attributes.textAlign || 'top';
    this.wrap = attributes.wrap || false;
    this.wrapMaxWidth = attributes.wrapMaxWidth || 300;
    this.lineHeight = attributes.lineHeight || 30;

    this.hover = attributes.hover || {};

    this.hover.bgColor = this.hover.bgColor || '#e2e2e2';
}

Text.prototype = Object.create(Rectangle.prototype);

Text.prototype.render = function () {

    if(this.bgColor){
        context.fillStyle = this.bgColor;
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }

    context.font =  this.fontSize + 'pt ' +  this.fontFamily;
    context.fillStyle = this.textColor;
    context.textBaseline = 'top';
    context.textAlign = this.textAlign;

    if(this.wrap)
        wrapText(this.text, this.pos.x+5, this.pos.y+5, this.wrapMaxWidth, this.lineHeight);
    else
        context.fillText(this.text, this.pos.x+5, this.pos.y+5);
};

// http: //www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
function wrapText(text, x, y, maxWidth, lineHeight) {
    var cars = text.split("\n");

    for (var ii = 0; ii < cars.length; ii++) {

        var line = "";
        var words = cars[ii].split(" ");

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + " ";
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth) {
                context.fillText(line, x, y);
                line = words[n] + " ";
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
        y += lineHeight;
    }
}
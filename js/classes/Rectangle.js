function Rectangle(attributes) {
    Renderable.call(this, attributes);

    this.relativeFrom = attributes.relativeFrom || {pos: {x: 0, y: 0}};
    this.height = attributes.height || 33;
    this.width = attributes.width || 40;
    this.bgColor = attributes.bgColor || '#CCCCCC';
    this.pos = attributes.pos || {x:0, y:0};
    this.borderRadius = attributes.borderRadius || null;
    this.borderStyle = attributes.borderStyle || null;
    this.borderWidth = attributes.borderWidth || 0;

    this.pos = this._calculatePos();
    this.endPos = this._calculateEndPos();
}

Rectangle.prototype = Object.create(Renderable.prototype);

Rectangle.prototype.render = function () {
    context.fillStyle = this.bgColor;

    if(!this.borderRadius){
        context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        return;
    }
    else{
        this.drawRoundRect(
            this.pos.x,
            this.pos.y,
            this.width,
            this.height,
            this.borderRadius
        );
    }

    if(this.borderWidth > 0){
        context.lineWidth = this.borderWidth;

        if(this.borderStyle) context.strokeStyle = this.borderStyle;

        context.stroke();
    }

    context.fill();
};

Rectangle.prototype._calculatePos = function () {
    if(!this.relativeFrom) return this.pos;

    return {
        x: this.relativeFrom.pos.x+this.pos.x,
        y: this.relativeFrom.pos.y+this.pos.y
    }
};

Rectangle.prototype._calculateEndPos = function () {
    return {
        x: this.pos.x+this.width,
        y: this.pos.y+this.height
    }
};

Rectangle.prototype.drawRoundRect = function (x, y, width, height, radius) {

    radius = {
        upperLeft: radius.upperLeft || 0,
        upperRight: radius.upperRight || 0,
        lowerLeft: radius.lowerLeft || 0,
        lowerRight: radius.lowerRight || 0
    };

    context.beginPath();
    context.moveTo(x + radius.upperLeft, y);
    context.lineTo(x + width - radius.upperRight, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.upperRight);
    context.lineTo(x + width, y + height - radius.lowerRight);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.lowerRight, y + height);
    context.lineTo(x + radius.lowerLeft, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.lowerLeft);
    context.lineTo(x, y + radius.upperLeft);
    context.quadraticCurveTo(x, y, x + radius.upperLeft, y);
    context.closePath();
};
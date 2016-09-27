function Rectangle(attributes) {
    Renderable.call(this, attributes);

    this.relativeFrom = attributes.relativeFrom || {pos: {x: 0, y: 0}};
    this.height = attributes.height || 30;
    this.width = attributes.width || 40;
    this.bgColor = attributes.bgColor || '#CCCCCC';
    this.pos = attributes.pos || {x:0, y:0};

    this.pos = this._calculatePos();
    this.endPos = this._calculateEndPos();
}

Rectangle.prototype = Object.create(Renderable.prototype);

Rectangle.prototype.render = function () {
    context.fillStyle = this.bgColor;
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height)
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
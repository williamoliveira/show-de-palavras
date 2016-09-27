function Text(attributes) {
    Rectangle.call(this, attributes);

    this.text = attributes.text || 'Text';
    this.width = attributes.width || ((this.text.length*10)+10);
    this.textColor = attributes.textColor || '#000000';
    this.fontFamily = attributes.fontFamily || 'Arial';
    this.fontSize = attributes.fontSize || 14;
    this.bgColor = attributes.bgColor || null;

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
    context.fillText(this.text, this.pos.x+5, this.pos.y+5);
};
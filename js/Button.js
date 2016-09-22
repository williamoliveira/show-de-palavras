function Button(attributes) {
    Rectangle.call(this, attributes);

    this.text = attributes.text || 'Text';
    this.width = attributes.width || ((attributes.text.length*10)+10);
    this.textColor = attributes.textColor || '#000000';
    this.fontFamily = attributes.fontFamily || 'Arial';
    this.fontSize = attributes.fontSize || 14;
    this.onClick = attributes.onClick || this.onClick;
    this.hovering = false;

    this.hover = attributes.hover || {};

    this.hover.bgColor = this.hover.bgColor || '#e2e2e2';
}

Button.prototype = Object.create(Rectangle.prototype);

Button.prototype.render = function () {
    context.fillStyle = (this.hovering) ? this.hover.bgColor || this.bgColor : this.bgColor;
    context.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    context.font =  this.fontSize + 'pt ' +  this.fontFamily;
    context.fillStyle = (this.hovering) ? this.hover.textColor || this.textColor : this.textColor;
    context.textBaseline = 'top';
    context.fillText(this.text, this.pos.x+5, this.pos.y+5);
};

Button.prototype.onClick = function () {
    console.info('clicked', this);
};
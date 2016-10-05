function Button(attributes) {
    Rectangle.call(this, attributes);

    attributes.hover = attributes.hover || {};

    this.text = attributes.text || 'Text';
    this.textColor = attributes.textColor || '#000000';
    this.fontFamily = attributes.fontFamily || 'Lucida Handwriting';
    this.fontSize = attributes.fontSize || 14;
    this.onClick = (typeof attributes.onClick === 'function')
        ? attributes.onClick.bind(this)
        : noop;
    this.hovering = false;

    context.font =  this.fontSize + 'pt ' +  this.fontFamily;
    context.fillStyle = (this.hovering) ? this.hover.textColor || this.textColor : this.textColor;
    this.textMargin = attributes.textMargin || 10;
    this.width = attributes.width || (context.measureText(this.text).width+(this.textMargin*2));

    this.hover = attributes.hover;
    this.hover.bgColor = attributes.hover.bgColor || '#e2e2e2';
    this.hover.textColor = attributes.hover.textColor || this.textColor;

   this.borderRadius = {
        upperLeft: 8,
        upperRight: 8,
        lowerLeft: 8,
        lowerRight: 8
    };
    this.bgColor = attributes.bgColor || '#E20001';
    this.hover.bgColor = '#B30101';
    this.textColor = attributes.textColor || '#fff';
	this.hover.textColor = this.textColor;
    this.borderStyle = attributes.borderStyle || '#6F0000';
    this.borderWidth = attributes.borderWidth || 3;
}

Button.prototype = Object.create(Rectangle.prototype);

Button.prototype.render = function () {

    var bgColor;
    var textColor;
    if(this.hovering){
        bgColor = this.bgColor;
        textColor = this.textColor;

        this.bgColor = this.hover.bgColor || this.bgColor;
        this.textColor = this.hover.textColor || this.textColor;
    }

    Rectangle.prototype.render.call(this);

    context.font =  this.fontSize + 'pt ' +  this.fontFamily;
    context.fillStyle = this.textColor;
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(this.text, this.pos.x+this.textMargin, this.pos.y+5);

    this.bgColor = bgColor || this.bgColor;
    this.textColor = textColor || this.textColor;
};

Button.prototype.setHovering = function (hovering) {
    this.hovering = hovering;
};

Button.prototype.onClick = function () {
    console.info('clicked', this);
};
function Renderable() {
    this.disabled = false;
}

Renderable.prototype.render = function () {
    throw new Error('render() not implemented');
};

Renderable.prototype.doRender = function () {
    if(this.disabled) return;

    this.render();
};
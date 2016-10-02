function Renderable() {
}

Renderable.prototype.render = function () {
    throw new Error('render() not implemented');
};

Renderable.prototype.doRender = function () {
    this.render();
};
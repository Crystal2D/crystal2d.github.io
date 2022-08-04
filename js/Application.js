function Application ()
{
    ThrowError(1);
}

Application.Load = function (width, height)
{
    if (width == null || height == null) return ThrowError(0);
    
    if (this.gl != null) document.querySelector("canvas").remove();
    
    this.htmlCanvas = document.createElement("canvas");
    this.htmlCanvas.width = width;
    this.htmlCanvas.height = height;
    
    this.htmlCanvas.style.margin = "auto";
    this.htmlCanvas.style.objectFit = "contain";
    
    this.gl = this.htmlCanvas.getContext("webgl2");
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    document.body.appendChild(this.htmlCanvas);
};

Application.Quit = function ()
{
    window.close();
};

Application.Update = function ()
{
    this.gl.viewport(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    this.gl.flush();
};
/**
 * The static class for working with the window
 */
function Window()
{
    ThrowError(1);
}



// ---------- Static Methods

/**
 * Sets the window base
 * @memberof Window
 * @param {string} title - The title of the window
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 * @param {int} marginX - The width of the inner margin in percent
 * @param {int} marginY - The height of the inner margin in percent
 */
Window.SetBase = function (title, width, height, marginX, marginY)
{
    this.SetTitle(title);
    this.SetSize(width, height);
    this.SetMargin(marginX, marginY);
};

/**
 * Sets the window's title
 * @memberof Window
 * @param {string} title - The title of the window
 */
Window.SetTitle = function (title)
{
    var wTitle = "Untitled";
    
    if (title != null)
    {
        wTitle = title;
    }
    
    this.data.title = wTitle;
    document.title = this.data.title;
};

/**
 * Sets the window's size
 * @memberof Window
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 */
Window.SetSize = function (width, height)
{
    if (width == null || height == null) return ThrowError(0);
    
    this.data.width = width;
    this.data.height = height;
    
    this.updateSize();
};

/**
 * Sets the inner margin's size
 * @memberof Window
 * @param {int} width - The width of the margin in percent
 * @param {int} height - The height of the margin in percent
 */
Window.SetMargin = function (width, height)
{
    this.data.marginX = width ?? 4;
    this.data.marginY = height ?? 4;
    
    this.updateSize();
};



// ---------- Properties
Window.fullScreen = set (value)
{
    alert(value);
};



// ---------- Events

/**
 * Called for initialization
 * @memberof Window
 */
Window.init = function ()
{
    Window.data.marginX = 2;
    Window.data.marginY = 2;
    
    this.updateSize();
    this.requestUpdate();
}

/**
 * Called for update
 * @memberof Window
 */
Window.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

/**
 * When updating
 * @memberof Window
 */
Window.update = function ()
{
    if (!this.data.resizable)
    {
        this.updateSize();
    }
    
    this.requestUpdate();
};

/**
 * Sets the window size from Window.data
 * @memberof Window
 */
Window.updateSize = function ()
{
    let sX = this.data.width + (this.data.width * (this.data.marginX * 2 / 100));
    let sY = this.data.height + (this.data.height * (this.data.marginY * 2 / 100));
    
    BlankEngineCore.game.htmlCanvas.style.width = `${100 - this.data.marginX * 2}%`;
    BlankEngineCore.game.htmlCanvas.style.height =  `${100 - this.data.marginY * 2}%`;
    
    window.resizeTo(sX, sY);
};
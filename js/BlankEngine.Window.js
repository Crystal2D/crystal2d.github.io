/**
 * The static class for working with the window
 */
function Window()
{
    ThrowError(1);
}

/**
 * Sets the window base
 * @memberof Window
 * @param {string} title - The title of the window
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 * @param {int} marginX - The width of the inner margin in pixels
 * @param {int} marginY - The height of the inner margin in pixels
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
 * @param {int} width - The width of the margin in pixels
 * @param {int} height - The height of the margin in pixels
 */
Window.SetMargin = function (width, height)
{
    if (width == null || height == null)
    {
        this.data.marginX = 0;
        this.data.marginY = 0;
        
        return null;
    }
    
    this.data.marginX = width;
    this.data.marginY = height;
    
    this.updateSize();
};

Window.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

Window.update = function ()
{
    if (!this.data.resizable)
    {
        this.updateSize();
    }
    
    this.requestUpdate();
};

Window.updateSize = function ()
{
    let sX = this.data.width + (this.data.marginX * 2);
    let sY = this.data.height + (this.data.marginY * 2);
    
    window.resizeTo(sX, sY);
};
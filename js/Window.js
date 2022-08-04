/**
 * The static class for working with the window
 * @public
 * @static
 * @class
 */
function Window()
{
    ThrowError(1);
}



// ---------- Static Properties

/**
 * Sets the fullscreen property of the window
 * @memberof Window
 * @public
 * @static
 * @type {bool}
 */
Window.fullScreen = false;

/**
 * Tells if the window has to resize
 * @memberof Window
 * @public
 * @static
 * @type {bool}
 */
Window.sizeChanged = false;

/**
 * Sets what happens when fullscreen has entered
 * @memberof Window
 * @public
 * @static
 * @type {function}
 */
Window.OnFullscreenEnter = function () { };

/**
 * Sets what happens when fullscreen has exited
 * @memberof Window
 * @public
 * @static
 * @type {function}
 */
Window.OnFullscreenExit = function () { };



// ---------- Static Methods

/**
 * Sets the window base
 * @memberof Window
 * @public
 * @static
 * @function
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
    
    this.sizeChanged = true;
};

/**
 * Sets the window's title
 * @memberof Window
 * @public
 * @static
 * @function
 * @param {string} title - The title of the window
 */
Window.SetTitle = function (title)
{
    this.data.title = title ?? "Untitled";
    document.title = this.data.title;
};

/**
 * Sets the window's size
 * @memberof Window
 * @public
 * @static
 * @function
 * @param {int} width - The width of the window in pixels
 * @param {int} height - The height of the window in pixels
 */
Window.SetSize = function (width, height)
{
    if (width == null || height == null) return ThrowError(0);
    
    this.data.width = width;
    this.data.height = height;
    
    this.sizeChanged = true;
};

/**
 * Sets the inner margin's size
 * @memberof Window
 * @public
 * @static
 * function
 * @param {int} width - The width of the margin in percent
 * @param {int} height - The height of the margin in percent
 */
Window.SetMargin = function (width, height)
{
    this.data.marginX = width ?? 1;
    this.data.marginY = height ?? 1;
    
    this.sizeChanged = true;
};

/**
 * Sets the window's icon
 * @memberof Window
 * @public
 * @static
 * @function
 * @param {string} src - The location of the icon source
 */
Window.SetIcon = function (src)
{
    let icon = document.querySelector("link[rel=icon]");
    
    if (icon == null)
    {
        icon = document.createElement("link");
        icon.rel = "icon";
        
        document.head.appendChild(icon);
    }
    
    icon.href = src;
};


// ----- Events

/**
 * Called for initialization
 * @memberof Window
 * @public
 * @static
 * @function
 */
Window.init = function ()
{
    Application.Load(this.data.width, this.data.height);
    
    this.data.marginX = 1;
    this.data.marginY = 1;
    
    this.sizeChanged = true;
    
    this.SetTitle(this.data.title);
    this.SetIcon(this.data.icon);
    
    this.requestUpdate();
    
    window.onresize = () => { if (!this.data.resizable) this.sizeChanged = true; };
}

/**
 * Called for update
 * @memberof Window
 * @public
 * @static
 * @function
 */
Window.requestUpdate = function ()
{
    requestAnimationFrame(this.update.bind(this));
};

/**
 * When updating
 * @memberof Window
 * @public
 * @static
 * @function
 */
Window.update = function ()
{
    if (!document.hasFocus()) return this.requestUpdate();
    
    if (document.fullscreenElement && !this.fullScreen)
    {
        Window.OnFullscreenExit();
        document.exitFullscreen();
    }
    else if (!document.fullscreenElement && this.fullScreen)
    {
        Window.OnFullscreenEnter();
        document.documentElement.requestFullscreen();
    }
    
    this.updateSize();
    
    this.requestUpdate();
};

/**
 * Sets the window size from Window.data
 * @memberof Window
 * @public
 * @static
 * @function
 */
Window.updateSize = function ()
{
    Application.htmlCanvas.style.width = `${100 - this.data.marginX * 2}%`;
    Application.htmlCanvas.style.height =  `${100 - this.data.marginY * 2}%`;
    
    if (!this.sizeChanged || this.fullScreen) return null;
    
    let sX = this.data.width + (window.outerWidth - window.innerWidth) + (this.data.width * (this.data.marginX * 2 / 100));
    let sY = this.data.height + (window.outerHeight - window.innerHeight) + (this.data.height * (this.data.marginY * 2 / 100));
    
    window.resizeTo(sX, sY);
    
    this.sizeChanged = false;
};
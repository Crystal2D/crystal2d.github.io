/**
 * The static class for working with the window
 * @public
 * @static
 * @class
 */
class Window
{
    // Private Static Properties
    
    static #sizeChanged = false;
    
    
    // Static Properties
    
    /**
     * Sets the fullscreen property of the window
     * @memberof Window
     * @public
     * @static
     * @type {bool}
     */
    static fullScreen = false;
    
    /**Sets what happens when fullscreen has entered
     * @memberof Window
     * @public
     * @static
     * @type {function}
     */
    static OnFullscreenEnter = function () { };
    
    /**Sets what happens when fullscreen has exited
     * @memberof Window
     * @public
     * @static
     * @type {function}
     */
    static OnFullscreenExit = function () { };
    
    
    // Private Static Methods
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static #update ()
    {
        if (Shader.hasLoaded && BlankEngine.Core.compiledData.loadedScripts && !Application.hasLoaded) Application.Load();
        
        if (!document.hasFocus()) return this.#requestUpdate();
        
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
        
        this.#updateSize();
        
        this.#requestUpdate();
    }
    
    static #updateSize ()
    {
        Application.htmlCanvas.style.width = `${100 - this.data.marginX * 2}%`;
        Application.htmlCanvas.style.height =  `${100 - this.data.marginY * 2}%`;
        
        if (!this.#sizeChanged || this.fullScreen) return null;
        
        let sX = this.data.width + (window.outerWidth - window.innerWidth) + (this.data.width * (this.data.marginX * 2 / 100));
        let sY = this.data.height + (window.outerHeight - window.innerHeight) + (this.data.height * (this.data.marginY * 2 / 100));
        window.resizeTo(sX, sY);
        
        this.#sizeChanged = false;
    }
    
    
    // Static Methods
    
    /**
     * Called for initialization
     * @memberof Window
     * @public
     * @static
     * @function
     */
    static init ()
    {
        Application.init(this.data.width, this.data.height);
        
        this.data.marginX = 1;
        this.data.marginY = 1;
        
        this.#sizeChanged = true;
        
        this.SetTitle(this.data.title);
        this.SetIcon(this.data.icon);
        
        this.#requestUpdate();
        
        window.onresize = () => { if (!this.data.resizable) this.#sizeChanged = true; };
    }
    
    /**
     * Sets the window base@memberof Window
     * @public
     * @static
     * @function
     * @param {string} title - The title of the window
     * @param {int} width - The width of the window in pixels
     * @param {int} height - The height of the window in pixels
     * @param {int} marginX - The width of the inner margin in percent
     * @param {int} marginY - The height of the inner margin in percent
     */
    static SetBase (title, width, height, marginX, marginY)
    {
        this.SetTitle(title);
        this.SetSize(width, height);
        this.SetMargin(marginX, marginY);
        
        this.#sizeChanged = true;
    }
    
    /**
     * Sets the window's title
     * @memberof Window
     * @public
     * @static
     * @function
     * @param {string} title - The title of the window
     */
    static SetTitle (title)
    {
        this.data.title = title ?? "Untitled";
        document.title = this.data.title;
    }
    
    /**
     * Sets the window's size
     * @memberof Window
     * @public
     * @static
     * @function
     * @param {int} width - The width of the window in pixels
     * @param {int} height - The height of the window in pixels
     */
    static SetSize (width, height)
    {
        if (width == null || height == null) return ThrowError(0);
        
        this.data.width = width;
        this.data.height = height;
        
        this.#sizeChanged = true;
    }
    
    /**
     * Sets the inner margin's size
     * @memberof Window
     * @public
     * @static
     * function
     * @param {int} width - The width of the margin in percent
     * @param {int} height - The height of the margin in percent
     */
    static SetMargin (width, height)
    {
        this.data.marginX = width ?? 1;
        this.data.marginY = height ?? 1;
        
        this.#sizeChanged = true;
    }
    
    /**
     * Sets the window's icon
     * @memberof Window
     * @public
     * @static
     * @function
     * @param {string} src - The location of the icon source
     */
    static SetIcon (src)
    {
        this.data.icon = src;
        
        let icon = document.querySelector("link[rel=icon]");
        
        if (icon == null)
        {
            icon = document.createElement("link");
            icon.rel = "icon";
            
            document.head.appendChild(icon);
            
        }
        
        icon.href = this.data.icon;
    }
}
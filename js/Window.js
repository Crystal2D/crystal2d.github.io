/**
 * The static class for working with the window
 * @public
 * @static
 * @class
 */
class Window
{
    // Private Static Properties
    
    static #loadedApp = false;
    static #sizeChanged = false;
    static #fillMode = 0;
    
    
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
        if (!this.#loadedApp && Shader.isLoaded && !Application.isLoaded)
        {
            Application.Load();
            
            this.#loadedApp = true;
        }
        
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
        if (this.data.fillWindow && this.#fillMode != 1)
        {
            Application.htmlCanvas.width = window.innerWidth - this.data.marginX / 100 * window.innerWidth;
            Application.htmlCanvas.height = window.innerHeight - this.data.marginY / 100 * window.innerHeight;
            
            this.#fillMode = 1;
        }
        if (!this.data.fillWindow && this.#fillMode != 2)
        {
            Application.htmlCanvas.width = this.data.width;
            Application.htmlCanvas.height = this.data.height;
            
            this.#fillMode = 2;
        }
        
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
        
        this.#sizeChanged = true;
        
        this.SetTitle(this.data.title);
        this.SetIcon(this.data.icon);
        
        if (this.data.marginX == null) this.data.marginX = 0.5;
        if (this.data.marginY == null) this.data.marginY = 0.5;
        
        if (this.data.resizable == null) this.data.resizable = true;
        
        if (this.data.fillWindow == null) this.data.fillWindow = true;
        
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
        if (width == null || height == null) throw BlankEngine.ThrowError(0);
        
        this.data.width = width;
        this.data.height = height;
        
        Application.htmlCanvas.width = this.data.width;
        Application.htmlCanvas.height = this.data.height;
        
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
        this.data.marginX = width ?? 0.5;
        this.data.marginY = height ?? 0.5;
        
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
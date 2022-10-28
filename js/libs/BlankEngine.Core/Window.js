/**
 * The static class for working with the window
 * 
 * @public
 * @static
 * @class
 */
class Window
{
    // Private Static Properties
    
    static #sizeChanged = false;
    static #fillMode = 0;
    
    
    // Static Properties
    
    /**
     * The data that is used by the window 
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @type {object}
     * 
     * @property {string} title - The title of the window
     * @property {integer} width - The width of the window in pixels
     * @property {integer} height - The height of the window in pixels
     * @property {integer} marginX - The width of the inner margin in percent
     * @property {integer} marginY - The height of the inner margin in percent
     * @property {boolean} resizable - The resizeable status of the window
     * @property {boolean} fillWindow - The fillmode status of the application to the window
     * @property {string} icon - The source of the window icon
     */
    static data = {
        title : "Untitled",
        width : 0,
        height : 0,
        marginX : 0,
        marginY : 0,
        resizable : true,
        fillWindow : true,
        icon : ""
    };
    
    /**
     * Sets the fullscreen property of the window
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @type {boolean}
     */
    static fullScreen = false;
    
    /**
     * Sets a callback for when fullscreen has entered
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @callback
     */
    static OnFullscreenEnter = function () { };
    
    /**
     * Sets a callback for when fullscreen has exited
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @callback
     */
    static OnFullscreenExit = function () { };
    
    
    // Private Static Methods
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static #update ()
    {
        if (document.hasFocus())
        {
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
        
        if (!this.#sizeChanged || this.fullScreen) return;
        
        let sX = this.data.width + (window.outerWidth - window.innerWidth) + (this.data.width * (this.data.marginX * 2 / 100));
        let sY = this.data.height + (window.outerHeight - window.innerHeight) + (this.data.height * (this.data.marginY * 2 / 100));
        window.resizeTo(sX, sY);
        
        this.#sizeChanged = false;
    }
    
    
    // Static Methods
    
    /**
     * Called for initialization
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     */
    static init ()
    {
        Application.init(this.data.width, this.data.height);
        
        this.#sizeChanged = true;
        
        this.SetTitle(this.data.title);
        this.SetIcon(this.data.icon);
        
        this.#requestUpdate();
        
        window.onresize = () => { if (!this.data.resizable) this.#sizeChanged = true; };
    }
    
    /**
     * Sets the window base
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     * 
     * @param {string} title - The title of the window
     * @param {integer} width - The width of the window in pixels
     * @param {integer} height - The height of the window in pixels
     * @param {integer} marginX - The width of the inner margin in percent
     * @param {integer} marginY - The height of the inner margin in percent
     * @param {string} icon - The source of the window icon
     */
    static SetBase (title, width, height, marginX, marginY, icon)
    {
        this.SetTitle(title);
        this.SetSize(width, height);
        this.SetMargin(marginX, marginY);
        this.SetIcon(icon);
        
        this.#sizeChanged = true;
    }
    
    /**
     * Sets the window's title
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     * 
     * @param {string} title - The title of the window
     */
    static SetTitle (title)
    {
        this.data.title = title ?? "Untitled";
        document.title = this.data.title;
    }
    
    /**
     * Sets the window's size
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     * 
     * @param {integer} width - The width of the window in pixels
     * @param {integer} height - The height of the window in pixels
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
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     * 
     * @param {integer} width - The width of the margin in percent
     * @param {integer} height - The height of the margin in percent
     */
    static SetMargin (width, height)
    {
        this.data.marginX = width ?? 0;
        this.data.marginY = height ?? 0;
        
        this.#sizeChanged = true;
    }
    
    /**
     * Sets the window's icon
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @method
     * 
     * @param {string} src - The source of the window icon
     */
    static SetIcon (src)
    {
        if (!src) return;
        
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
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
    
    static #loaded = false;
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
    static OnFullscreenEnter = () => { };
    
    /**
     * Sets a callback for when fullscreen has exited
     * 
     * @memberof Window
     * 
     * @public
     * @static
     * @callback
     */
    static OnFullscreenExit = () => { };
    
    
    // Private Static Methods
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
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
        
        this.#UpdateSize();
        
        this.#RequestUpdate();
    }
    
    static #UpdateSize ()
    {
        if (this.data.fillWindow && this.#fillMode != 1)
        {
            Application.htmlCanvas.width = window.innerWidth - 0.01 * this.data.marginX * window.innerWidth;
            Application.htmlCanvas.height = window.innerHeight - 0.01 * this.data.marginY * window.innerHeight;
            
            this.#fillMode = 1;
        }
        if (!this.data.fillWindow && this.#fillMode != 2)
        {
            Application.htmlCanvas.width = this.data.width;
            Application.htmlCanvas.height = this.data.height;
            
            this.#fillMode = 2;
        }
        
        Application.htmlCanvas.style.width = `${100 - 2 * this.data.marginX}%`;
        Application.htmlCanvas.style.height =  `${100 - 2 * this.data.marginY}%`;
        
        if (!this.#sizeChanged || this.fullScreen) return;
        
        const sX = this.data.width + (window.outerWidth - window.innerWidth) + (0.02 * this.data.width * this.data.marginX);
        const sY = this.data.height + (window.outerHeight - window.innerHeight) + (0.02 * this.data.height * this.data.marginY);
        
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
    static Init ()
    {
        if (this.#loaded) return;
        
        Application.Init(this.data.width, this.data.height);
        
        this.#sizeChanged = true;
        
        this.SetTitle(this.data.title);
        this.SetIcon(this.data.icon);
        
        this.#RequestUpdate();
        
        window.addEventListener("resize", () => {
            if (!this.data.resizable) this.#sizeChanged = true;
        });
        
        this.#loaded = true;
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
        
        if (icon != null) this.SetIcon(icon);
        
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
        this.data.icon = src;
        
        let icon = document.querySelector("link[rel=icon]");
        
        if (icon == null)
        {
            icon = document.createElement("link");
            icon.rel = "icon";
            
            document.head.append(icon);
        }
        
        icon.href = this.data.icon;
    }
}
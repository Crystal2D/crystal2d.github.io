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
    static #resizable = true;
    static #fillWin = true;
    static #x = 0;
    static #y = 0;
    static #marginX = 0;
    static #marginY = 0;
    static #winX = 0;
    static #winY = 0;
    static #title = "";
    
    static #icon = null;
    
    
    // Static Properties
    
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
    
    static get width ()
    {
        return this.#x;
    }
    
    static get height ()
    {
        return this.#y;
    }
    
    static get marginWidth ()
    {
        return this.#marginX;
    }
    
    static get marginHeight ()
    {
        return this.#marginY;
    }
    
    static get windowWidth ()
    {
        return this.#winX || this.#x;
    }
    
    static get windowHeight ()
    {
        return this.#winY || this.#y;
    }
    
    static get resizable ()
    {
        return this.#resizable;
    }
    
    static set resizable (value)
    {
        this.#sizeChanged = true;
        
        this.#resizable = value;
    }
    
    static get fillWindow ()
    {
        return this.#fillWin;
    }
    
    static set fillWindow (value)
    {
        if (value)
        {
            Application.htmlCanvas.width = window.innerWidth - 0.01 * this.#marginX * window.innerWidth;
            Application.htmlCanvas.height = window.innerHeight - 0.01 * this.#marginY * window.innerHeight;
        }
        else
        {
            Application.htmlCanvas.width = this.#x;
            Application.htmlCanvas.height = this.#y;
        }
        
        this.#fillWin = value;
    }
    
    
    // Private Static Methods
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        if (document.hasFocus())
        {
            if (document.fullscreenElement && !this.fullScreen) document.exitFullscreen();
            else if (!document.fullscreenElement && this.fullScreen) document.documentElement.requestFullscreen();
        }
        
        if (this.#sizeChanged)
        {
            if (this.#resizable && !this.fullScreen)
            {
                const x = this.windowWidth + (window.outerWidth - window.innerWidth) + (0.02 * this.windowWidth * this.#marginX);
                const y = this.windowHeight + (window.outerHeight - window.innerHeight) + (0.02 * this.windowHeight * this.#marginY);
                
                window.resizeTo(x, y);
            }
            
            if (this.#fillWin)
            {
                Application.htmlCanvas.width = window.innerWidth - 0.01 * this.#marginX * window.innerWidth;
                Application.htmlCanvas.height = window.innerHeight - 0.01 * this.#marginY * window.innerHeight;
            }
            
            this.#sizeChanged = false;
        }
        
        this.#RequestUpdate();
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
    static Init (data)
    {
        if (this.#loaded) return;
        
        this.#resizable = data.resizable ?? true;
        
        this.fullScreen = data.fullScreen ?? false;
        this.fillWindow = data.fillWindow ?? true;
        
        this.SetTitle(data.title);
        this.SetResolution(data.width, data.height);
        this.SetMargin(data.marginWidth, data.marginHeight);
        this.SetWindowSize(data.windowWidth, data.windowHeight);
        this.SetIcon(data.icon);
        
        window.addEventListener("resize", () => { this.#sizeChanged = true; });
        
        this.#RequestUpdate();
        
        this.#loaded = true;
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
        this.#title = title ?? "Untitled";
        document.title = this.#title;
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
    static SetResolution (width, height)
    {
        this.#x = width ?? 250;
        this.#y = height ?? 250;
        
        if (!this.#fillWin)
        {
            Application.htmlCanvas.width = this.#x;
            Application.htmlCanvas.height = this.#y;
        }
        
        if (this.#winX === 0 || this.#winY === 0) this.#sizeChanged = true;
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
        this.#marginX = width ?? 0;
        this.#marginY = height ?? 0;
        
        Application.htmlCanvas.style.width = `${100 - 2 * this.#marginX}%`;
        Application.htmlCanvas.style.height =  `${100 - 2 * this.#marginY}%`;
        
        this.#sizeChanged = true;
    }
    
    static SetWindowSize (width, height)
    {
        this.#winX = width ?? 0;
        this.#winY = height ?? 0;
        
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
        this.#icon = src;
        
        if (this.#icon == null) return;
        
        let icon = document.querySelector("link[rel=icon]");
        
        if (icon == null)
        {
            icon = document.createElement("link");
            icon.rel = "icon";
            
            document.head.append(icon);
        }
        
        icon.href = this.#icon;
    }
}
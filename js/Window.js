class Window
{
    static #loaded = false;
    static #resizable = true;
    static #fillWin = true;
    static #sizeChanged = 0;
    static #x = 0;
    static #y = 0;
    static #marginX = 0;
    static #marginY = 0;
    static #winX = 0;
    static #winY = 0;
    static #aspect = 0;
    static #title = "";
    
    static #icon = null;
    static #ipcRenderer = null;
    
    static fullscreen = false;
    
    static get fillWindow ()
    {
        return this.#fillWin;
    }
    
    static get resizable ()
    {
        return this.#resizable;
    }
    
    static set resizable (value)
    {
        this.#sizeChanged = 2;

        if (this.#ipcRenderer != null) this.#ipcRenderer.invoke("SetResizable", value);
        
        this.#resizable = value;
    }
    
    static set fillWindow (value)
    {
        if (value)
        {
            Application.htmlCanvas.width = window.devicePixelRatio * (window.innerWidth - 0.01 * this.#marginX * window.innerWidth);
            Application.htmlCanvas.height = window.devicePixelRatio * (window.innerHeight - 0.01 * this.#marginY * window.innerHeight);
        }
        else
        {
            Application.htmlCanvas.width = this.#x;
            Application.htmlCanvas.height = this.#y;
        }
        
        this.#aspect = Application.htmlCanvas.width / Application.htmlCanvas.height;
        
        this.#fillWin = value;
    }
    
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
    
    static get aspect ()
    {
        return this.#aspect;
    }

    static get canvasWidth ()
    {
        return (window.innerWidth / window.innerHeight < this.aspect) ? window.innerWidth : (this.aspect * window.innerHeight);
    }

    static get canvasHeight ()
    {
        return (window.innerWidth / window.innerHeight < this.aspect) ? (window.innerWidth / this.aspect) : window.innerHeight;
    }
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        if (document.hasFocus() && !Application.isInCordova)
        {
            if (document.fullscreenElement && !this.fullscreen) document.exitFullscreen();
            else if (!document.fullscreenElement && this.fullscreen) document.documentElement.requestFullscreen().catch(() => { });
        }

        if (this.#sizeChanged > 0)
        {
            if (!document.fullscreenElement && (!this.#resizable || this.#sizeChanged === 1) && !Application.isInCordova)
            {
                let x = this.windowWidth + (window.outerWidth - window.innerWidth) + (0.02 * this.windowWidth * this.#marginX);
                let y = this.windowHeight + (window.outerHeight - window.innerHeight) + (0.02 * this.windowHeight * this.#marginY);

                if (x % 2 !== 0) x += x % 2;
                if (y % 2 !== 0) y += y % 2;
                
                window.resizeTo(x, y);
            }
            
            if (this.#fillWin)
            {
                Application.htmlCanvas.width = window.devicePixelRatio * (window.innerWidth - 0.01 * this.#marginX * window.innerWidth);
                Application.htmlCanvas.height = window.devicePixelRatio * (window.innerHeight - 0.01 * this.#marginY * window.innerHeight);
                
                this.#aspect = Application.htmlCanvas.width / Application.htmlCanvas.height;
            }
            
            this.#sizeChanged = 0;
        }
        
        this.#RequestUpdate();
    }
    
    static Init (data)
    {
        if (this.#loaded) return;

        this.#resizable = data.resizable ?? true;
        this.fullscreen = data.fullscreen ?? false;
        this.fillWindow = data.fillWindow ?? true;
  
        this.SetTitle(data.title);
        this.SetResolution(data.width, data.height);
        this.SetMargin(data.marginWidth, data.marginHeight);
        this.SetWindowSize(data.windowWidth, data.windowHeight);

        if (Application.isInElectron)
        {
            const { ipcRenderer } = require("electron");
            this.#ipcRenderer = ipcRenderer;
        }
        else this.SetIcon(data.icon);
        
        window.addEventListener("resize", () => { this.#sizeChanged = 2; });
        
        this.#RequestUpdate();
        
        this.#loaded = true;
    }
    
    static SetTitle (title)
    {
        this.#title = title ?? "Untitled";
        document.title = this.#title;
    }
    
    static SetResolution (width, height)
    {
        this.#x = width ?? 250;
        this.#y = height ?? 250;
        
        if (!this.#fillWin)
        {
            Application.htmlCanvas.width = this.#x;
            Application.htmlCanvas.height = this.#y;
            
            this.#aspect = this.#x / this.#y;
        }
        
        if (this.#winX === 0 || this.#winY === 0) this.#sizeChanged = 1;
    }
    
    static SetMargin (width, height)
    {
        this.#marginX = width ?? 0;
        this.#marginY = height ?? 0;
        
        Application.htmlCanvas.style.width = `${100 - 2 * this.#marginX}%`;
        Application.htmlCanvas.style.height = `${100 - 2 * this.#marginY}%`;
        
        this.#sizeChanged = 1;
    }
    
    static SetWindowSize (width, height)
    {
        this.#winX = width ?? 0;
        this.#winY = height ?? 0;
        
        this.#sizeChanged = 1;
    }
    
    static SetIcon (src)
    {
        this.#icon = src;
        
        if (this.#icon == null) return;

        if (this.#ipcRenderer != null)
        {
            this.#ipcRenderer.invoke("SetIcon", this.#icon);

            return;
        }
        
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
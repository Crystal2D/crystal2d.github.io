class GameWindow
{
    static #loaded = false;
    static #resizable = true;
    static #fillWin = true;
    static #frameFullscreen = false;
    static #setOutWin = false;
    static #sizeChanged = 0;
    static #x = 0;
    static #y = 0;
    static #marginX = 0;
    static #marginY = 0;
    static #winX = 0;
    static #winY = 0;
    static #minWinX = 0;
    static #minWinY = 0;
    static #outWinX = 0;
    static #outWinY = 0;
    static #aspect = 0;
    static #minAspect = 0;
    static #maxAspect = 0;
    static #sleepTime = 0;
    static #title = "";
    
    static #icon = null;
    static #ipc = null;
    static #wakeLock = null;

    static $wakeTime = 0;
    
    static fullscreen = false;
    
    static get fillWindow ()
    {
        return this.#fillWin;
    }

    static set fillWindow (value)
    {
        if (value) this.#SetResolutionBase(
            window.devicePixelRatio * (this.windowWidth - 0.02 * this.#marginX * this.windowWidth),
            window.devicePixelRatio * (this.windowHeight - 0.02 * this.#marginY * this.windowHeight)
        );
        else this.#SetResolutionBase(this.#x, this.#y);
        
        this.#fillWin = value;
    }
    
    static get resizable ()
    {
        return this.#resizable;
    }
    
    static set resizable (value)
    {
        this.#sizeChanged = 2;

        if (this.#ipc != null) this.#ipc.invoke("SetResizable", value);
        
        this.#resizable = value;
    }
    
    static get targetWidth ()
    {
        return this.#x;
    }

    static set targetWidth (value)
    {
        this.#x = value ?? 250;
        if (!this.#fillWin) this.#SetResolutionBase(this.#x, this.#y);

        if (this.#winX === 0) this.#sizeChanged = 1;
    }
    
    static get targetHeight ()
    {
        return this.#y;
    }

    static set targetHeight (value)
    {
        this.#y = value ?? 250;
        if (!this.#fillWin) this.#SetResolutionBase(this.#x, this.#y);

        if (this.#winY === 0) this.#sizeChanged = 1;
    }
    
    static get marginWidth ()
    {
        return this.#marginX;
    }

    static set marginWidth (value)
    {
        this.#marginX = value ?? 0;
        Application.htmlCanvas.style.width = `${100 - 2 * this.#marginX}%`;

        this.#sizeChanged = 1;
    }
    
    static get marginHeight ()
    {
        return this.#marginY;
    }

    static set marginHeight (value)
    {
        this.#marginY = value ?? 0;
        Application.htmlCanvas.style.height = `${100 - 2 * this.#marginY}%`;

        this.#sizeChanged = 1;
    }
    
    static get targetWindowWidth ()
    {
        return Math.max(this.#winX || this.#x, this.#minWinX);
    }

    static set targetWindowWidth (value)
    {
        this.#winX = value ?? 0;
        this.#sizeChanged = 1;
    }
    
    static get targetWindowHeight ()
    {
        return Math.max(this.#winY || this.#y, this.#minWinY);
    }

    static set targetWindowHeight (value)
    {
        this.#winY = value ?? 0;
        this.#sizeChanged = 1;
    }

    static get minWindowWidth ()
    {
        return this.#minWinX;
    }

    static set minWindowWidth (value)
    {
        this.#minWinX = value ?? 0;
        this.#sizeChanged = 2;
    }
    
    static get minWindowHeight ()
    {
        return this.#minWinY;
    }

    static set minWindowHeight (value)
    {
        this.#minWinY = value ?? 0;
        this.#sizeChanged = 2;
    }

    static get windowWidth ()
    {
        return window.innerWidth;
    }

    static get windowHeight ()
    {
        return window.innerHeight;
    }
    
    static get aspect ()
    {
        return this.#aspect;
    }

    static set aspect (value)
    {
        value = Math.max(value, this.#minAspect);
        if (this.#maxAspect > this.#minAspect) value = Math.min(value, this.#maxAspect);

        let width = this.canvasWidth;
        let height = this.canvasHeight;

        if (this.#aspect < value) height = width / value;
        else if (this.#aspect > value) width = value * height;

        this.#SetResolutionBase(width, height);
    }

    static get minAspect ()
    {
        return this.#minAspect;
    }

    static set minAspect (value)
    {
        this.#minAspect = value;
        this.#SetResolutionBase(this.canvasWidth, this.canvasWidth);
    }

    static get maxAspect ()
    {
        return this.#maxAspect;
    }

    static set maxAspect (value)
    {
        this.#maxAspect = value;
        this.#SetResolutionBase(this.canvasWidth, this.canvasWidth);
    }

    static get canvasWidth ()
    {
        return Application.htmlCanvas.width;
    }

    static set canvasWidth (value)
    {
        Application.htmlCanvas.width = value;
    }

    static get canvasHeight ()
    {
        return Application.htmlCanvas.height;
    }

    static set canvasHeight (value)
    {
        Application.htmlCanvas.height = value;
    }

    static get scaledCanvasWidth ()
    {
        return (this.windowWidth / this.windowHeight < this.aspect) ? this.windowWidth : (this.aspect * this.windowHeight);
    }

    static get scaledCanvasHeight ()
    {
        return (this.windowWidth / this.windowHeight < this.aspect) ? (this.windowWidth / this.aspect) : this.windowHeight;
    }

    static get sleepTimeout ()
    {
        return this.#sleepTime;
    }

    static set sleepTimeout (value)
    {
        if (this.#sleepTime === value) return;

        this.#sleepTime = value;
        this.Wake();
    }
    
    static get canSleep ()
    {
        return this.#sleepTime !== 0 && this.$wakeTime >= this.#sleepTime;
    }

    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        if (document.hasFocus() && !this.#setOutWin)
        {
            this.#setOutWin = true;
            this.#outWinX = window.outerWidth - this.windowWidth;
            this.#outWinY = window.outerHeight - this.windowHeight;
        }

        // Wake
        if (document.hasFocus())
        {
            if (this.#wakeLock == null)
            {
                if (!this.canSleep) (async () => {
                    this.#wakeLock = false;
                    
                    try { this.#wakeLock = await navigator.wakeLock.request("screen"); }
                    catch { this.#wakeLock = null; }
                })();
            }
            else if (typeof this.#wakeLock !== "boolean")
            {
                if (this.canSleep && !this.#wakeLock.released) this.#wakeLock.release();

                if (this.#wakeLock.released) this.#wakeLock = null;
            }
        }

        // Fullscreen
        if (document.hasFocus() && !Application.isInCordova)
        {
            if (this.#ipc != null)
            {
                if (this.#frameFullscreen !== this.fullscreen)
                {
                    this.#ipc.invoke("SetFullscreen", this.fullscreen);
                    this.#frameFullscreen = this.fullscreen;
                }
            }
            else if (document.fullscreenElement && !this.fullscreen) document.exitFullscreen();
            else if (!document.fullscreenElement && this.fullscreen) document.documentElement.requestFullscreen().catch(() => { });
        }

        // Sizer
        if (this.#sizeChanged > 0)
        {
            // Window
            if (!document.fullscreenElement && !Application.isInCordova)
            {
                if (!this.#resizable || this.#sizeChanged === 1)
                {
                    const x = this.targetWindowWidth + this.#outWinX + (0.02 * this.#marginX * this.targetWindowWidth);
                    const y = this.targetWindowHeight + this.#outWinY + (0.02 * this.#marginY * this.targetWindowHeight);

                    window.resizeTo(x, y);
                }
                else if (this.#sizeChanged === 2)
                {
                    let update = false;
                    let width = this.windowWidth - (0.02 * this.#marginX * this.windowWidth);
                    let height = this.windowHeight - (0.02 * this.#marginY * this.windowHeight);

                    if (width < this.#minWinX)
                    {
                        width = this.#minWinX;
                        update = true;
                    }
                    if (height < this.#minWinY)
                    {
                        height = this.#minWinY;
                        update = true;
                    }

                    if (update)
                    {
                        const x = width + this.#outWinX + (0.02 * this.#marginX * width);
                        const y = height + this.#outWinY + (0.02 * this.#marginY * height);
                        
                        window.resizeTo(x, y);
                    }
                }
            }
            
            // Game
            if (this.#fillWin) this.#SetResolutionBase(
                window.devicePixelRatio * (this.windowWidth - 0.02 * this.#marginX * this.windowWidth),
                window.devicePixelRatio * (this.windowHeight - 0.02 * this.#marginY * this.windowHeight)
            );
            
            this.#sizeChanged = 0;
        }
        
        this.#RequestUpdate();
    }
    
    static Init (data)
    {
        if (this.#loaded) return;

        this.#resizable = data.resizable ?? true;
        this.fullscreen = data.fullscreen ?? Application.isInCordova;
        this.fillWindow = data.fillWindow ?? true;
        this.sleepTimeout = data.sleepTimeout ?? 0;
        this.#minAspect = data.minAspect?.x / data.minAspect?.y;
        this.#maxAspect = data.maxAspect?.x / data.maxAspect?.y;
        this.#minWinX = data.minWindowWidth ?? 250;
        this.#minWinY = data.minWindowHeight ?? 250;
  
        this.SetTitle(data.title);
        this.SetResolution(data.width, data.height);
        this.SetMargin(data.marginWidth, data.marginHeight);
        this.SetWindowSize(data.windowWidth, data.windowHeight);

        this.#ipc = Application.electronIPC;

        this.SetIcon(data.icon);
        
        window.addEventListener("resize", () => this.#sizeChanged = 2);
        
        this.#RequestUpdate();
        
        this.#loaded = true;
    }
    
    static SetTitle (title)
    {
        this.#title = title ?? "Untitled";
        document.title = this.#title;
    }

    static #SetResolutionBase (width, height)
    {
        let aspect = width / height;

        if (aspect < this.#minAspect) height = width / this.#minAspect;
        else if (this.#maxAspect > this.#minAspect && aspect > this.#maxAspect) width = this.#maxAspect * height;
        
        aspect = width / height;

        this.canvasWidth = width;
        this.canvasHeight = height;
        
        this.#aspect = aspect;
    }
    
    static SetResolution (width, height)
    {
        this.#x = width ?? 250;
        this.#y = height ?? 250;
        
        if (!this.#fillWin) this.#SetResolutionBase(this.#x, this.#y);
        
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

        if (this.#ipc != null)
        {
            this.#ipc.invoke("SetIcon", this.#icon);

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

    static async Center ()
    {
        if (Application.isInCordova) return;

        await CrystalEngine.Wait(() => this.#sizeChanged === 0);

        window.moveTo(
            0.5 * (window.screen.availWidth - window.outerWidth),
            0.5 * (window.screen.availHeight - window.outerHeight)
        );
    }

    static Wake ()
    {
        this.$wakeTime = 0;
    }
}
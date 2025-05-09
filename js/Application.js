class Application
{
    static #inited = false;
    static #loaded = false;
    static #playing = false;
    static #unloaded = false;
    static #binded = false;
    static #name = "";
    static #onLoad = () => { };
    static #onUnload = () => { };
    static #focusedCall = () => document.hasFocus();
    
    static #canvas = null;
    static #gl = null;
    static #gl_md = null;
    
    static runInBackgroud = false;
    static targetFrameRate = 0;
    static vSyncCount = 0;

    static wantsToQuit = null;
    static unloading = null;
    static quitting = null;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }

    static get isUnloaded ()
    {
        return this.#unloaded;
    }

    static get isPlaying ()
    {
        return this.#playing;
    }
    
    static get name ()
    {
        return this.#name;
    }
    
    static get htmlCanvas ()
    {
        return this.#canvas;
    }
    
    static get gl ()
    {
        return this.#gl;
    }

    static get gl_multidraw ()
    {
        return this.#gl_md;
    }

    static get isInElectron ()
    {
        return navigator.userAgent.indexOf("Electron") >= 0;
    }

    static get isInCordova ()
    {
        return cordova != null;
    }

    static get isFocused ()
    {
        return this.#focusedCall();
    }
    
    static Init (name)
    {
        if (this.#inited) return;
        
        this.#name = name;
        
        this.#canvas = document.createElement("canvas");
        
        this.#canvas.style.margin = "auto";
        this.#canvas.style.objectFit = "contain";
        
        this.#gl = this.#canvas.getContext("webgl2", {
            antialias: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false
        });
        this.#gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.#gl_md = this.#gl.getExtension("WEBGL_multi_draw");
        
        document.body.append(this.#canvas);

        if (this.isInCordova)
        {
            let focused = true;

            this.#focusedCall = () => focused;

            document.addEventListener("pause", () => focused = false);
            document.addEventListener("resume", () => focused = true);
        }
        
        this.#inited = true;
    }
    
    static Bind (onLoad, onUnload)
    {
        if (this.#binded) return;
        
        this.#onLoad = async () => await onLoad();
        this.#onUnload = async () => await onUnload();
        
        this.#binded = true;
    }
    
    static Quit ()
    {
        if (this.#playing) this.#playing = false;
    }

    static CancelQuit ()
    {
        if (!this.#playing) this.#playing = true;
    }
    
    static async Load ()
    {
        if (this.#loaded) return;

        try
        {
            await this.#onLoad();

            this.#loaded = true;
            this.#playing = true;
        }
        catch (error)
        {
            this.#loaded = true;
            this.#playing = true;

            throw error;
        }
    }
    
    static async Unload ()
    {
        if (this.#unloaded) return;

        try { this.unloading.Invoke(); }
        catch { }

        await this.#onUnload();

        this.#unloaded = true;
    }
}
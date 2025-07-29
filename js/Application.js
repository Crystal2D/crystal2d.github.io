class Application
{
    static #inited = false;
    static #loaded = false;
    static #playing = false;
    static #unloaded = false;
    static #binded = false;
    static #name = "";
    static #dev = "";
    static #ver = "";
    static #onLoad = () => { };
    static #onUnload = () => { };
    static #focusedCall = () => document.hasFocus();
    
    static #canvas = null;
    static #gl = null;
    static #gl_md = null;
    static #ipc = null;
    
    static runInBackgroud = false;
    static debugMode = false;
    static targetFrameRate = 0;
    static vSyncCount = 0;

    static wantsToQuit = null;
    static unloading = null;
    static quitting = null;

    static get engineVersion ()
    {
        return "2025.6.3a";
    }

    static get developer ()
    {
        return this.#dev;
    }

    static get version ()
    {
        return this.#ver;
    }
    
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

    static get isMobilePlatform ()
    {
        return navigator.userAgent.toLowerCase().indexOf("mobile") >= 0;
    }

    static get isInElectron ()
    {
        return this.#ipc != null;
    }

    static get electronIPC ()
    {
        return this.#ipc;
    }

    static get isInCordova ()
    {
        return cordova != null;
    }

    static get isFocused ()
    {
        return this.#focusedCall();
    }
    
    static Init (name, dev, ver)
    {
        if (this.#inited) return;
        
        this.#name = name;
        this.#dev = dev;
        this.#ver = ver;
        
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

        if (navigator.userAgent.indexOf("Electron") >= 0)
        {
            const { ipcRenderer } = require("electron");
            this.#ipc = ipcRenderer;

            ipcRenderer.on("eval", (event, data) => eval(data));
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

    static CompareVersion (a, b)
    {
        const setA = (a ?? "").split(".");
        const setB = (b ?? "").split(".");
        const maxParts = Math.max(setA.length, setB.length);

        for (let i = 0; i < maxParts; i++)
        {
            const diff = Math.max(Math.min((parseInt(setA[i]) || 0) - (parseInt(setB[i]) || 0), 1), -1);

            if (diff !== 0) return diff;
        }

        return 0;
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
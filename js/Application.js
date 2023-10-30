class Application
{
    static #inited = false;
    static #loaded = false;
    static #binded = false;
    
    static htmlCanvas = null;
    static gl = null;
    static targetFrameRate = -1;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static Init (width, height)
    {
        if (this.#inited) return;
        
        if (this.gl != null) document.querySelector("canvas").remove();
        
        this.htmlCanvas = document.createElement("canvas");
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;
        
        this.htmlCanvas.style.margin = "auto";
        this.htmlCanvas.style.objectFit = "contain";
        
        this.gl = this.htmlCanvas.getContext("webgl2");
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        document.body.append(this.htmlCanvas);
        
        this.#inited = true;
    }
    
    static Bind (onLoad, onUnload)
    {
        if (this.#binded) return;
        
        this.Load = async () => {
            if (this.#loaded) return;
            
            await onLoad();
            
            this.#loaded = true;
        }
        this.Unload = () => onUnload();
        
        this.#binded = true;
    }
    
    static Quit ()
    {
        this.Unload();
        
        window.close();
    }
    
    static async Load () { }
    
    static Unload () { }
}
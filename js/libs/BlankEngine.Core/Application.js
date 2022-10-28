class Application
{
    static #loaded = false;
    
    static targetFrameRate = -1;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static init (width, height)
    {
        if (width == null || height == null) throw BlankEngine.ThrowError(0);
        
        if (this.#loaded) return;
        
        if (this.gl != null) document.querySelector("canvas").remove();
        
        this.htmlCanvas = document.createElement("canvas");
        this.htmlCanvas.width = width;
        this.htmlCanvas.height = height;
        
        this.htmlCanvas.style.margin = "auto";
        this.htmlCanvas.style.objectFit = "contain";
        
        this.gl = this.htmlCanvas.getContext("webgl2");
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        document.body.appendChild(this.htmlCanvas);
    }
    
    static Quit ()
    {
        window.close();
    }
    
    static async Load ()
    {
        Debug.Set(BlankEngine.Inner.buildData.debugMode);
        
        await SceneManager.Load(0);
        
        this.#loaded = true;
    }
}
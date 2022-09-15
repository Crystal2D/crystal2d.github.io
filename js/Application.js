class Application
{
    static #loaded = false;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static init (width, height)
    {
        if (this.#loaded) return null;
        if (width == null || height == null) throw BlankEngine.ThrowError(0);
        
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
    
    static async Load ()
    {
        Debug.Set(BlankEngine.Core.buildData.debugMode);
        
        await SceneManager.Load(0);
        
        this.#loaded = true;
    }
    
    static Quit ()
    {
        window.close();
    }
    
    static Update ()
    {
        for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
        {
            SceneManager.GetActiveScene().gameObjects[i].Start();
        }
        
        this.gl.viewport(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            if (!SceneManager.GetActiveScene().gameObjects[iA].activeSelf) continue;
            
            for (let iB = 0; iB < SceneManager.GetActiveScene().gameObjects[iA].components.length; iB++)
            {
                if (!SceneManager.GetActiveScene().gameObjects[iA].components[iB].isRenderer) continue;
                
                SceneManager.GetActiveScene().gameObjects[iA].components[iB].render();
            }
        }
        
        this.gl.flush();
    }
}
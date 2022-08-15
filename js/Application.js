class Application
{
    static #loaded = false;
    
    static get hasLoaded ()
    {
        return this.#loaded;
    }
    
    static init (width, height)
    {
        if (this.#loaded) return null;
        if (width == null || height == null) return ThrowError(0);
        
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
    
    static Load ()
    {
        Debug.Set(BlankEngine.Core.buildData.debugMode);
        
        /*let texture = new Texture("ball.png");
        texture.filterMode = 1;
        
        let scene = new Managers.Scene.Scene("test", [
            new GameObject("object", [
                new SpriteRenderer(
                    new Sprite(texture)
                ),
                new testGB()
            ])
        ]);*/
        
        
        
        Managers.Scene.Set([]);
        
        this.#loaded = true;
    }
    
    static Quit ()
    {
        window.close();
    }
    
    static Update ()
    {
        for (let i = 0; i < Managers.Scene.GetActiveScene().gameObjects.length; i++)
        {
            Managers.Scene.GetActiveScene().gameObjects[i].Start();
        }
        
        this.gl.viewport(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let iA = 0; iA < Managers.Scene.GetActiveScene().gameObjects.length; iA++)
        {
            if (!Managers.Scene.GetActiveScene().gameObjects[iA].activeSelf) continue;
            
            for (let iB = 0; iB < Managers.Scene.GetActiveScene().gameObjects[iA].components.length; iB++)
            {
                if (!Managers.Scene.GetActiveScene().gameObjects[iA].components[iB].isRenderer) continue;
                
                Managers.Scene.GetActiveScene().gameObjects[iA].components[iB].render();
            }
        }
        
        this.gl.flush();
    }
}
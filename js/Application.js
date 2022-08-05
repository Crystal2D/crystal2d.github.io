class Application
{
    static Load (width, height)
    {
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
        
        let texture = new Texture("ball.png");
        
        texture.filterMode = 1;
        
        let scene = new Managers.Scene.Scene("test", [
            new GameObject("object", [
                new SpriteRenderer(
                    new Sprite(texture)
                )
            ])
        ]);
        
        Managers.Scene.Set([scene]);
        Managers.Scene.Load(0);
    }
    
    static Quit ()
    {
        window.close();
    }
    
    static Update ()
    {
        this.gl.viewport(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        
        for (let iA = 0; i < Managers.Scene.GetActiveScene().gameObjects.length; i++)
        {
            for (let iB = 0; i < Managers.Scene.GetActiveScene().gameObjects[iA].components.length; i++)
            {
                if (!Managers.Scene.GetActiveScene().gameObjects[iA].components[iB].isRenderer) continue;
                
                Managers.Scene.GetActiveScene().gameObjects[iA].components[iB].render();
            }
        }
        
        this.gl.flush();
    }
}
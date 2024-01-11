class Application
{
    static #inited = false;
    static #loaded = false;
    static #binded = false;
    static #name = "";
    
    static #canvas = null;
    static #gl = null;
    static #gl_md = null;
    
    static targetFrameRate = -1;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static get packageName ()
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
    
    static Init (packageName)
    {
        if (this.#inited) return;
        
        this.#name = packageName;
        
        this.#canvas = document.createElement("canvas");
        
        this.#canvas.style.margin = "auto";
        this.#canvas.style.objectFit = "contain";
        
        this.#gl = this.#canvas.getContext("webgl2");
        this.#gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.#gl_md = this.#gl.getExtension("WEBGL_multi_draw");
        
        document.body.append(this.#canvas);
        
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
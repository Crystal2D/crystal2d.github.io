class Texture
{
    #loaded = false;
    #width = 0;
    #height = 0;
    #wrap = 0;
    #filter = 0;
    #src = "";
    
    #img = null;
    #gl = null;
    #texture = null;
    
    pixelPerUnit = 16;
    sprites = [];
    onUnload = new DelegateEvent();
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get width ()
    {
        return this.#width;
    }
    
    get height ()
    {
        return this.#height;
    }
    
    get wrapMode ()
    {
        return this.#wrap;
    }
    
    set wrapMode (value)
    {
        this.#wrap = value;
        
        const gl = this.#gl;
        
        let mode = null;
        
        switch (value)
        {
            case 0:
                mode = gl.CLAMP_TO_EDGE;
                break;
            case 1:
                mode = gl.REPEAT;
                break;
            case 2:
                mode = gl.MIRRORED_REPEAT;
                break;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, mode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, mode);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    get filterMode ()
    {
        return this.#filter;
    }
    
    set filterMode (value)
    {
        this.#filter = value;
        
        const gl = this.#gl;
        
        let mode = null;
        
        switch (value)
        {
            case 0:
                mode = gl.NEAREST;
                break;
            case 1:
                mode = gl.LINEAR;
                break;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mode);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
    get img ()
    {
        return this.#img;
    }
    
    constructor (src, dir)
    {
        this.#img = new Image();
        this.#img.sprite = this;
        
        this.#gl = Application.gl;
        
        this.#texture = this.#gl.createTexture();
        
        this.wrapMode = 0;
        this.filterMode = 0;
        
        this.#src = `${dir ?? "img/"}${src}`;
    }
    
    GetNativeTexture ()
    {
        return this.#texture;
    }
    
    async Load ()
    {
        if (this.#loaded) return;
        
        this.#img.src = this.#src;
        
        await new Promise(resolve => this.#img.onload = resolve);
        
        this.#width = this.#img.width;
        this.#height = this.#img.height;
        
        const gl = this.#gl;
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.#width, this.#height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.#img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        this.sprites[0] = new Sprite(null, this);
        
        this.#loaded = true;
    }

    Unload ()
    {
        this.onUnload.Invoke();

        this.#gl.deleteTexture(this.#texture);
    }
}
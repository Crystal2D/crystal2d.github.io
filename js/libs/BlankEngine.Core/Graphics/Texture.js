class Texture
{
    #loaded = false;
    #src = "";
    
    #img = null;
    
    wrapMode = 0;
    filterMode = 0;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get img ()
    {
        return this.#img;
    }
    
    get width ()
    {
        return this.#img.width;
    }
    
    get height ()
    {
        return this.#img.height;
    }
    
    constructor (src)
    {
        this.#img = new Image();
        this.#img.sprite = this;
        
        this.#src = src;
    }
    
    async Load ()
    {
        if (this.#loaded) return;
        
        this.#img.src = `img/${this.#src}`;
        
        await new Promise(resolve => this.#img.onload = resolve);
        
        this.#loaded = true;
    }
}
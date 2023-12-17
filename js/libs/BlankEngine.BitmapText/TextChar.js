class TextChar
{
    #pos = Vector2.zero;
    #offset = Vector2.zero;
    
    trisCount = 0;
    rectArray = [];
    
    offset = Vector2.zero;
    color = new Color(1, 1, 1);
    
    sprite = null;
    
    get position ()
    {
        return this.#pos;
    }
    
    set position (value)
    {
        this.#pos = value;
        
        this.#RefreshOffset();
    }
    
    get initialOffset ()
    {
        return this.#offset;
    }
    
    set initialOffset (value)
    {
        this.#offset = value;
        
        this.#RefreshOffset();
    }
    
    #RefreshOffset ()
    {
        this.offset = Vector2.Add(
            Vector2.Scale(
                this.#pos,
                new Vector2(-1, 1)
            ),
            this.#offset
        );
    }
}
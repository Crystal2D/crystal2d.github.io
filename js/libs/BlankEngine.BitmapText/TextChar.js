class TextChar
{
    #pos = Vector2.zero;
    #offset = Vector2.zero;
    
    trisCount = 0;
    vertexArray = [];
    textureArray = [];
    
    color = new Color(1, 1, 1);
    
    get position ()
    {
        return this.#pos;
    }
    
    set position (value)
    {
        this.#pos = value;

        for (let i = 0; i < this.trisCount; i++)
        {
            const index = i * 2;
            
            this.vertexArray[index] += value.x;
            this.vertexArray[index + 1] -= value.y;
        }
        
        // this.#RefreshOffset();
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
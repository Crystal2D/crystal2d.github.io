class TextChar
{
    #vertex = [];

    #pos = Vector2.zero;
    #offset = Vector2.zero;
    
    trisCount = 0;
    textureArray = [];
    localVertexArray = [];
    
    color = new Color(1, 1, 1);

    get vertexArray ()
    {
        return this.#vertex;
    }

    set vertexArray (value)
    {
        this.#vertex = value;

        this.#RecalcVerts();
    }
    
    get position ()
    {
        return this.#pos;
    }
    
    set position (value)
    {
        this.#pos = value;

        this.#RecalcVerts();
    }

    get offset ()
    {
        return this.#offset;
    }
    
    set offset (value)
    {
        this.#offset = value;

        this.#RecalcVerts();
    }

    #RecalcVerts ()
    {
        const x = this.#pos.x + this.#offset.x;
        const y = this.#pos.y - this.#offset.y;

        let vertexArray = [...this.#vertex];

        for (let i = 0; i < this.trisCount; i++)
        {
            const index = i * 2;
            
            vertexArray[index] += x;
            vertexArray[index + 1] -= y;
        }

        this.localVertexArray = vertexArray;
    }
}
class TextChar
{
    #vertex = [];

    #pos = Vector2.zero;
    #offset = Vector2.zero;
    #color = new Color(1, 1, 1);
    
    trisCount = 0;
    textureArray = [];
    localVertexArray = [];
    colorArray = [];

    parent = null;

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

    get color ()
    {
        return this.#color;
    }

    set color (value)
    {
        this.#color = value;

        const color = [
            value.r,
            value.g,
            value.b,
            value.a
        ];

        this.colorArray = [
            ...color,
            ...color,
            ...color,
            ...color,
            ...color,
            ...color
        ];

        this.parent.RemapGraphicArrays();
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
class Renderer extends RendererBase
{
    static sortingAxis = Vector2.zero;

    #loaded = false;
    #newMaterial = true;
    #tintColor = Color.clear;
    
    #material = null;
    #materialOld = null;
    
    uMatrixID = 0;
    geometryBufferID = 0;
    colorBufferID = 0;
    aVertexPosID = 0;
    aColorID = 0;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get material ()
    {
        return this.#materialOld;
    }
    
    set material (value)
    {
        if (this.#materialOld === value) return;
        
        this.#material = value.Duplicate();
        this.#newMaterial = true;
        
        this.Reload();
    }

    get updatedMaterial ()
    {
        return this.#newMaterial;
    }

    get tint ()
    {
        return this.#tintColor.Duplicate();
    }

    set tint (value)
    {
        if (value.Equals(this.#tintColor)) return;

        this.#tintColor = value.Duplicate();
        this.material.SetVector("uTint", 
            this.#tintColor.r,
            this.#tintColor.g,
            this.#tintColor.b,
            this.#tintColor.a
        );
    }
    
    constructor (material)
    {
        super();
        
        this.#material = material?.Duplicate() ?? new Material();
    }
    
    async Reload ()
    {
        if (this.#newMaterial)
        {
            this.material?.Unload();

            this.#materialOld = this.#material;

            this.uMatrixID = this.material.GetPropertyNameID("uMatrix");
            this.material.SetMatrix(this.uMatrixID,
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );
            
            this.geometryBufferID = this.material.AddBuffer("geometry", null, 2);
            this.colorBufferID = this.material.AddBuffer("color", null, 4);

            this.aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
            this.aColorID = this.material.GetAttributeNameID("aColor");
        }

        await this._OnLoad();

        this.#newMaterial = false;
        this.#loaded = true;
    }
}
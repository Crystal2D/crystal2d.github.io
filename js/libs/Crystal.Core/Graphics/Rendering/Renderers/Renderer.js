class Renderer extends Component
{
    #loaded = false;
    
    #material = null;
    #materialOld = null;
    
    uMatrixID = 0;
    geometryBufferID = 0;
    textureBufferID = 0;
    colorBufferID = 0;
    aVertexPosID = 0;
    aTexturePosID = 0;
    aColorID = 0;
    sortingLayer = 0;
    sortingOrder = 0;
    
    color = Color.white;
    renderMatrix = new Matrix3x3();
    onMeshUpdate = new DelegateEvent();
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get meshChanged ()
    {
        return false;
    }
    
    get bounds ()
    {
        return new Bounds();
    }
    
    get material ()
    {
        return this.#materialOld;
    }
    
    set material (value)
    {
        this.#material = value;
        
        this.Reload();
    }

    get localToWorldMatrix ()
    {
        return Matrix3x3.identity;
    }
    
    constructor (material)
    {
        super();
        
        this.#material = material ?? new Material();
    }
    
    Reload ()
    {        
        this.#material.SetSampler2D("uSampler", 0);
        
        this.#materialOld = this.#material;
        
        this.uMatrixID = this.material.GetPropertyNameID("uMatrix");
        
        this.geometryBufferID = this.material.AddBuffer("geometry", null, 2);
        this.textureBufferID = this.material.AddBuffer("texture", null, 2);
        this.colorBufferID = this.material.AddBuffer("color", null, 4);

        this.aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
        this.aTexturePosID = this.material.GetAttributeNameID("aTexturePos");
        this.aColorID = this.material.GetAttributeNameID("aColor");
        
        this.#loaded = true;
    }

    RecalcBounds ()
    {
        const min = this.bounds.min;
        const max = this.bounds.max;
        const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

        this.gameObject.scene.tree?.Relocate(this.gameObject, rect);
    }

    ForceMeshUpdate ()
    {
        this.onMeshUpdate.Invoke();
        
        this.RecalcBounds();
    }
    
    Render () { }
}
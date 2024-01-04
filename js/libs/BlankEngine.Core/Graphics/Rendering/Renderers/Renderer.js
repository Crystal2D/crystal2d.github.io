class Renderer extends Component
{
    #loaded = false;
    
    #material = null;
    #materialOld = null;
    
    uMatrixID = 0;
    geometryBufferID = 0;
    aVertexPosID = 0;
    
    color = Color.white;
    localSpaceMatrix = new Matrix3x3();
    
    get isLoaded ()
    {
        return this.#loaded;
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
    
    constructor (material)
    {
        super();
        
        this.#material = material ?? new Material();
    }
    
    Reload ()
    {
        const gl = this.#material.gl;
        
        this.#material.SetSampler2D("uSampler", 0);
        
        this.#materialOld = this.#material;
        
        this.uMatrixID = this.material.GetPropertyNameID("uMatrix");
        
        this.geometryBufferID = this.#material.AddBuffer("geometry", null, 2);
        this.aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
        
        this.#loaded = true;
    }
    
    Render () { }
}
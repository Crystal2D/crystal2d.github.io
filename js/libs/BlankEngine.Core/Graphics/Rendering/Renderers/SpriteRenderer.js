class SpriteRenderer extends Component
{
    #loaded = false;
    #uMatrixID = 0;
    #geometryBufferID = 0;
    #textureBufferID = 0;
    #aVertexPosID = 0;
    #aTexturePosID = 0;
    
    #sprite = null;
    #spriteOld = null;
    #material = null;
    #materialOld = null;
    
    color = Color.white;
    localSpaceMatrix = new Matrix3x3();
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get sprite ()
    {
        return this.#spriteOld;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.#CheckImg();
    }
    
    get material ()
    {
        return this.#materialOld;
    }
    
    set material (value)
    {
        this.#material = value;
        
        this.#CheckImg();
    }
    
    constructor (sprite, material)
    {
        super();
        
        this.#sprite = sprite;
        
        this.#material = material ?? new Material();
        
        this.#CheckImg();
    }
    
    #CheckImg ()
    {
        requestAnimationFrame(() => {
            if (this.#sprite.texture.isLoaded) this.Load();
            else this.#CheckImg();
        });
    }
    
    Load ()
    {
        const gl = this.#material.gl;
        
        this.#material.SetSampler2D("uSampler", 0);
        
        const geometryBuffer = this.#material.AddBuffer("geometry", null, 2);
        const textureBuffer = this.#material.AddBuffer("texture", null, 2);
        
        this.#spriteOld = this.#sprite;
        this.#materialOld = this.#material;
        
        this.#uMatrixID = this.material.GetPropertyNameID("uMatrix");
        
        this.#geometryBufferID = geometryBuffer;
        this.#textureBufferID = textureBuffer;
        
        this.#aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
        this.#aTexturePosID = this.material.GetAttributeNameID("aTexturePos");
        
        this.#loaded = true;
    }
    
    Render ()
    {
        if (!this.#loaded || !this.gameObject.activeSelf) return;
        
        const gl = this.material.gl;
        
        const vertices = this.sprite.vertices;
        const tris = this.sprite.triangles;
        
        let rectArray = [];
        
        for (let i = 0; i < tris.length; i++)
        {
            const vertex = vertices[tris[i]];
            const index = i * 2;
            
            rectArray[index] = vertex.x;
            rectArray[index + 1] = vertex.y;
        }
        
        const texX = this.sprite.texture.width;
        const texY = this.sprite.texture.height;
        
        const scale = texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1);
        
        const rectOffset = Vector2.Scale(Vector2.Subtract(Vector2.one, scale), -0.5);
        
        const w = vertices[3].x - vertices[0].x;
        const h = vertices[3].y - vertices[0].y;
        const cW = vertices[0].x + 0.5 * w;
        const cY = vertices[0].y + 0.5 * h;
        const center = new Vector2(
            (cW / 1) - 0.5
            //(cW / 0.5) - 1
            
            //(cW * 1.5) - 1.5,
            //(cY * 1.5) - 1.5,
            
            //(cW - 1) * 1.5,
            //cW - 1
            
            //(cW * 2) - 1.5,
            //(cY * 2) - 1.5
        );
        
        const offset = Vector2.Scale(
            Vector2.Add(
                rectOffset,
                center
                
                //0.5
            ),
            1//0.5
            
            //center
        );
        
        const localMatrix = Matrix3x3.Multiply(
            this.localSpaceMatrix,
            Matrix3x3.TRS(
                Vector2.Scale(
                    Vector2.Add(
                        Vector2.Scale(
                            this.sprite.pivot,
                            1
                        ),
                        offset
                    )
                , -1),
                0,
                scale
            )
        );
        
        this.material.color = this.color;
        
        this.material.SetMatrix(this.#uMatrixID,
            localMatrix.matrix[0][0],
            localMatrix.matrix[0][1],
            localMatrix.matrix[0][2],
            localMatrix.matrix[1][0],
            localMatrix.matrix[1][1],
            localMatrix.matrix[1][2],
            localMatrix.matrix[2][0],
            localMatrix.matrix[2][1],
            localMatrix.matrix[2][2]
        );
        
        this.material.SetBuffer(this.#geometryBufferID, rectArray);
        this.material.SetBuffer(this.#textureBufferID, rectArray);
        
        this.material.SetAttribute(this.#aVertexPosID, this.#geometryBufferID);
        this.material.SetAttribute(this.#aTexturePosID, this.#textureBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, tris.length);
        
        gl.useProgram(null);
    }
}
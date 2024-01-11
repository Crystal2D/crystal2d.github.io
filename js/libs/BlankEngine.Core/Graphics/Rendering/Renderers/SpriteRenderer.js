class SpriteRenderer extends Renderer
{
    #trisCount = 0;
    
    #transMat = new Matrix3x3();
    
    #sprite = null;
    #spriteOld = null;
    
    get bounds ()
    {
        const scale = this.transform.localScale;
        const pivot = this.sprite.pivot;
        
        return new Bounds(
            Vector2.Add(
                this.transform.localPosition,
                Vector2.Scale(
                    scale,
                    new Vector2(
                        0.5 - pivot.x,
                        pivot.y - 0.5
                    )
                )
            ),
            scale
        );
    }
    
    get sprite ()
    {
        return this.#spriteOld;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.Reload();
    }
    
    constructor (sprite, material)
    {
        super(material);
        
        this.sprite = sprite;
    }
    
    Reload ()
    {
        if (!this.#sprite.texture.isLoaded)
        {
            requestAnimationFrame(() => this.Reload());
            
            return;
        }
        
        super.Reload();
        
        this.#spriteOld = this.#sprite;
        
        const vertices = this.sprite.vertices;
        const vertexPos = vertices[0];
        const tris = this.sprite.triangles;
        
        let vertexArray = [];
        let textureArray = [];
        
        for (let i = 0; i < tris.length; i++)
        {
            const vertex = vertices[tris[i]];
            const index = i * 2;
            
            vertexArray[index] = vertex.x - vertexPos.x;
            vertexArray[index + 1] = vertex.y - vertexPos.y;
            
            textureArray[index] = vertex.x;
            textureArray[index + 1] = vertex.y;
        }
        
        this.#trisCount = tris.length;

        this.material.SetBuffer(this.geometryBufferID, vertexArray);
        this.material.SetBuffer(this.textureBufferID, textureArray);
        
        const ppu = this.sprite.pixelPerUnit;
        const texX = this.sprite.texture.width;
        const texY = this.sprite.texture.height;
        
        let scale = null;
        let ppuScaler = 0;
        
        if (texX > texY)
        {
            scale = new Vector2(1, texY / texX);
            
            ppuScaler = texX / ppu;
        }
        else
        {
            scale = new Vector2(texX / texY, 1);
            
            ppuScaler = texY / ppu;
        }
        
        scale = Vector2.Scale(scale, ppuScaler);
        
        this.#transMat = Matrix3x3.TRS(
            Vector2.Scale(this.sprite.pivot, -1),
            0,
            scale
        );
    }
    
    Render ()
    {
        if (!this.isLoaded || !this.gameObject.activeSelf) return;
        
        const gl = this.material.gl;
        
        const localMatrix = Matrix3x3.Multiply(
            this.localSpaceMatrix,
            this.#transMat
        );
        
        this.material.color = this.color;
        
        this.material.SetMatrix(this.uMatrixID,
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

        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        this.material.SetAttribute(this.aTexturePosID, this.textureBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.#trisCount);
        
        gl.useProgram(null);
    }
}
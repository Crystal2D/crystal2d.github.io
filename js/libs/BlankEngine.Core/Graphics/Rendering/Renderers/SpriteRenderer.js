class SpriteRenderer extends Renderer
{
    #trisCount = 0;
    
    #boundsSize = Vector2.zero;
    #transMat = new Matrix3x3();
    
    #sprite = null;
    #spriteOld = null;
    #colorOld = null;
    
    get bounds ()
    {
        const scale = Vector2.Scale(
            this.transform.localScale,
            this.#boundsSize
        );
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

    get localToWorldMatrix ()
    {
        return Matrix3x3.Multiply(
            this.transform.localToWorldMatrix,
            this.#transMat
        );
    }
    
    constructor (sprite, material)
    {
        super(material);
        
        this.sprite = sprite;
    }

    #RemapColors ()
    {
        this.#colorOld = this.color;

        const color = [
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a
        ];

        this.material.SetBuffer(this.colorBufferID, [
            ...color,
            ...color,
            ...color,
            ...color,
            ...color,
            ...color
        ]);
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

        this.#RemapColors();
        
        const ppu = this.sprite.pixelPerUnit;
        const texX = this.sprite.texture.width;
        const texY = this.sprite.texture.height;
        const rescaleW = texX / ppu;
        const rescaleH = texY / ppu;

        const boundsSize = new Vector2(
            rescaleW * (vertices[3].x - vertexPos.x),
            rescaleH * (vertices[3].y - vertexPos.y)
        );

        this.#boundsSize = boundsSize;
        
        this.#transMat = Matrix3x3.TRS(
            Vector2.Scale(
                this.sprite.pivot,
                Vector2.Scale(boundsSize, -1)
            ),
            0,
            Vector2.Scale(
                texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1),
                texX > texY ? rescaleW : rescaleH
            )
        );

        if (this.gameObject != null)
        {
            const min = this.bounds.min;
            const max = this.bounds.max;
            const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

            this.gameObject.scene.tree?.Relocate(this.gameObject, rect);
        }
    }
    
    Render ()
    {
        if (!this.isLoaded || !this.gameObject.activeSelf) return;

        if (this.#colorOld !== this.color) this.#RemapColors();
        
        const gl = this.material.gl;
        
        const renderMatrix = this.renderMatrix;
        
        this.material.SetMatrix(this.uMatrixID,
            renderMatrix.matrix[0][0],
            renderMatrix.matrix[0][1],
            renderMatrix.matrix[0][2],
            renderMatrix.matrix[1][0],
            renderMatrix.matrix[1][1],
            renderMatrix.matrix[1][2],
            renderMatrix.matrix[2][0],
            renderMatrix.matrix[2][1],
            renderMatrix.matrix[2][2]
        );

        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        this.material.SetAttribute(this.aTexturePosID, this.textureBufferID);
        this.material.SetAttribute(this.aColorID, this.colorBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.#trisCount - 1);
        
        gl.useProgram(null);
    }
}
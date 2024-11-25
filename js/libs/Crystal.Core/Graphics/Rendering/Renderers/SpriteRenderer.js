class SpriteRenderer extends Renderer
{
    #meshChanged = true;
    #trisCount = 0;
    
    #boundsSize = Vector2.zero;
    #bounds = new Bounds();
    #transMat = new Matrix3x3();
    
    #sprite = null;
    #spriteOld = null;
    #colorOld = null;

    get meshChanged ()
    {
        return this.#meshChanged;
    }

    get bounds ()
    {
        return new Bounds(this.#bounds.center, this.#bounds.size);
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
    }

    RecalcBounds ()
    {
        const bounds = new Bounds(Vector2.zero, this.#boundsSize);

        const refMat = this.transform.localToWorldMatrix;
        const pointA = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(bounds.min));
        const pointB = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(new Vector2(bounds.min.x, bounds.max.y)));
        const pointC = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(new Vector2(bounds.max.x, bounds.min.y)));
        const pointD = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(bounds.max));

        bounds.SetMinMax(
            new Vector2(
                Math.min(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.min(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            ),
            new Vector2(
                Math.max(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.max(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            ),
        );

        this.#bounds = bounds;

        super.RecalcBounds();
    }

    ForceMeshUpdate ()
    {
        super.ForceMeshUpdate();

        this.#meshChanged = false;
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
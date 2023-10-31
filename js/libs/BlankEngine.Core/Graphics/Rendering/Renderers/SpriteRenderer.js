class SpriteRenderer extends Component
{
    #loaded = false;
    #sprite = null;
    #spriteOld = null;
    #material = null;
    #materialOld = null;
    #texture = null;
    #textureBuffer = null;
    #geometryBuffer = null;
    #uSampler = null;
    #uLocalMatrix = null;
    #uVertexPositionOffset = null;
    #aVertexPosition = null;
    #aTexturePosition = null;
    
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
        const texture = this.#sprite.texture;
        
        const gl = this.#material.gl;
        
        const rect = this.#sprite.rect;
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        const height = rect.height;
        const xMin = rect.xMin;
        const yMin = rect.yMin;
        const rectArray = [
            x + xMin, y + yMin,
            x + width, y + yMin,
            x + width, y + height,
            x + xMin, y + yMin,
            x + xMin, y + height,
            x + width, y + height
        ];
        
        let filterMode;
        let wrapMode;
        
        switch (texture.filterMode)
        {
            case 1:
                filterMode = gl.NEAREST;
                break;
            default:
                filterMode = gl.LINEAR;
        }
        
        switch (texture.wrapMode)
        {
            case 1:
                wrapMode = gl.REPEAT;
                break;
            case 2:
                wrapMode = gl.MIRRORED_REPEAT;
                break;
            default:
                wrapMode = gl.CLAMP_TO_EDGE;
        }
        
        gl.useProgram(this.#material.program);
        
        this.#texture = gl.createTexture();
        this.#textureBuffer = gl.createBuffer();
        this.#geometryBuffer = gl.createBuffer();
        
        this.#uSampler = this.#material.getUniformLocation("uSampler");
        this.#uLocalMatrix = this.#material.getUniformLocation("uLocalMatrix");
        this.#uVertexPositionOffset = this.#material.getUniformLocation("uVertexPositionOffset");
        this.#aVertexPosition = this.#material.getAttribLocation("aVertexPosition");
        this.#aTexturePosition = this.#material.getAttribLocation("aTexturePosition");
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#geometryBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectArray), gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectArray), gl.STATIC_DRAW);
        
        gl.useProgram(null);
        
        this.#spriteOld = this.#sprite;
        this.#materialOld = this.#material;
        
        this.#loaded = true;
    }
    
    Render ()
    {
        if (!this.#loaded || !this.gameObject.activeSelf) return;
        
        const gl = this.#materialOld.gl;
        
        const x = this.#sprite.texture.width;
        const y = this.#sprite.texture.height;
        
        const scale = x > y ? new Vector2(1, y / x) : new Vector2(x / y, 1);
        
        const localMatrix = Matrix3x3.Multiply(
            this.localSpaceMatrix,
            Matrix3x3.Scale(scale)
        );
        const appliedMatrix = [
            localMatrix.matrix[0][0],
            localMatrix.matrix[0][1],
            localMatrix.matrix[0][2],
            localMatrix.matrix[1][0],
            localMatrix.matrix[1][1],
            localMatrix.matrix[1][2],
            localMatrix.matrix[2][0],
            localMatrix.matrix[2][1],
            localMatrix.matrix[2][2]
        ];
        
        gl.useProgram(this.#materialOld.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        
        gl.uniform1i(this.#uSampler, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#geometryBuffer);
        gl.enableVertexAttribArray(this.#aVertexPosition);
        gl.vertexAttribPointer(this.#aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix3fv(this.#uLocalMatrix, false, new Float32Array(appliedMatrix));
        
        const center = this.#spriteOld.rect.center;
        
        gl.uniform2fv(this.#uVertexPositionOffset, new Float32Array([-0.5 * (1 + center.x), -0.5 * (1 + center.y)]))
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#textureBuffer);
        gl.enableVertexAttribArray(this.#aTexturePosition);
        gl.vertexAttribPointer(this.#aTexturePosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        
        gl.useProgram(null);
    }
}
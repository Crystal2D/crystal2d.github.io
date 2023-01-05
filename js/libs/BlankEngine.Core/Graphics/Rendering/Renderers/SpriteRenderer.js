class SpriteRenderer extends Component
{
    #loaded = false;
    #sprite = null;
    #material = new Material();
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
        return this.#sprite;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.#loaded = false;
        
        this.checkImg();
    }
    
    get material ()
    {
        return this.#material;
    }
    
    set material (value)
    {
        this.#material = value;
        
        this.#loaded = false;
        
        this.checkImg();
    }
    
    constructor (sprite, material)
    {
        if (sprite == null) throw BlankEngine.Err(0);
        
        super();
        
        this.#sprite = sprite;
        
        this.#material = material ?? new Material();
        
        this.checkImg();
    }
    
    checkImg ()
    {
        requestAnimationFrame(() => { if (this.#sprite.texture.isLoaded) return this.load(); this.checkImg(); });
    }
    
    load ()
    {
        if (this.#loaded) return;
        
        const texture = this.#sprite.texture;
        
        if (isNaN(texture.filterMode) || texture.filterMode < 0 || texture.filterMode > 1 || isNaN(texture.wrapMode) || texture.wrapMode < 0 || texture.wrapMode > 2) throw BlankEngine.Err(0);
        
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
            case 0:
                filterMode = gl.LINEAR;
                break;
            case 1:
                filterMode = gl.NEAREST;
                break;
        }
        
        switch (texture.wrapMode)
        {
            case 0:
                wrapMode = gl.CLAMP_TO_EDGE;
                break;
            case 1:
                wrapMode = gl.REPEAT;
                break;
            case 2:
                wrapMode = gl.MIRRORED_REPEAT;
                break;
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
        
        this.#loaded = true;
    }
    
    render ()
    {
        if (!this.#loaded || !this.gameObject.activeSelf) return;
        
        const gl = this.#material.gl;
        const localMatrix = [
            this.localSpaceMatrix.matrix[0][0],
            this.localSpaceMatrix.matrix[0][1],
            this.localSpaceMatrix.matrix[0][2],
            this.localSpaceMatrix.matrix[1][0],
            this.localSpaceMatrix.matrix[1][1],
            this.localSpaceMatrix.matrix[1][2],
            this.localSpaceMatrix.matrix[2][0],
            this.localSpaceMatrix.matrix[2][1],
            this.localSpaceMatrix.matrix[2][2]
        ];
        
        gl.useProgram(this.#material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        
        gl.uniform1i(this.#uSampler, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#geometryBuffer);
        gl.enableVertexAttribArray(this.#aVertexPosition);
        gl.vertexAttribPointer(this.#aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix3fv(this.#uLocalMatrix, false, new Float32Array(localMatrix));
        
        const center = this.#sprite.rect.center;
        
        gl.uniform2fv(this.#uVertexPositionOffset, new Float32Array([-0.5 * (center.x + 1), -0.5 * (center.y + 1)]))
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#textureBuffer);
        gl.enableVertexAttribArray(this.#aTexturePosition);
        gl.vertexAttribPointer(this.#aTexturePosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        
        gl.useProgram(null);
    }
}
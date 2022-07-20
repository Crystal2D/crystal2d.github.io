function BlankEngine ()
{
    ThrowError(1);
}

class Material
{
    constructor (vertexShader = "attribute vec2 aVertexPos; attribute vec2 aTexturePos; varying vec2 vTexturePos; void main () { gl_Position = vec4(aVertexPos, 1, 1); vTexturePos = aTexturePos; }", fragmentShader = "precision mediump float; uniform sampler2D uImage; varying vec2 vTexturePos; void main () { gl_FragColor = texture2D(uImage, vTexturePos); }")
    {
        this.gl = Application.gl;
        
        let vShader = this.asShader(vertexShader, this.gl.VERTEX_SHADER);
        let fShader = this.asShader(fragmentShader, this.gl.FRAGMENT_SHADER);
        
        if (vShader == null || fShader == null) return null;
        
        this.program = this.gl.createProgram();
        
        this.gl.attachShader(this.program, vShader);
        this.gl.attachShader(this.program, fShader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) return ThrowError(4, this.gl.getProgramInfoLog(this.program));
        
        this.gl.detachShader(this.program, vShader);
        this.gl.detachShader(this.program, fShader);
        this.gl.deleteShader(vShader);
        this.gl.deleteShader(fShader);
    }
    
    asShader (shader, type)
    {
        var output = this.gl.createShader(type);
        
        this.gl.shaderSource(output, shader);
        this.gl.compileShader(output);
        
        if (!this.gl.getShaderParameter(output, this.gl.COMPILE_STATUS)) return ThrowError(4, this.gl.getShaderInfoLog(output));
        
        return output;
    }
}

class Texture
{
    constructor (src)
    {
        this.hasLoaded = false;
        
        this.wrapMode = 0;
        this.filterMode = 0;
        
        this.img = new Image();
        this.img.src = `../img/${src}`;
        this.img.sprite = this;
        
        this.img.onload = () => { this.hasLoaded = true; };
    }
}

class Rect
{
    constructor (x = 0, y = 0, width = 1, height = 1)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    Set (x, y, width, height)
    {
        if (x == null || y == null || width == null || height == null) return ThrowError(0);
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    get rectArray ()
    {
        return new Float32Array([this.x, this.y, this.x + this.width, this.y, this.x, this.y + this.height, this.x, this.y + this.height, this.x + this.width, this.y, this.x + this.width, this.y + this.height]);
    }
    
    get position ()
    {
        return new Vector2(this.x, this.y);
    }
    
    set position (value)
    {
        if (value == null) return ThrowError(0);
        
        this.x = value.x;
        this.y = value.y
    }
    
    get size ()
    {
        return new Vector2(this.width, this.height);
    }
    
    set size (value)
    {
        if (value == null) return ThrowError(0);
        
        this.width = value.x;
        this.height = value.y
    }
    
    toString ()
    {
        return `${this.x}, ${this.y}, ${this.width}, ${this.height}`;
    }
}

class Sprite
{
    constructor (texture, material)
    {
        this.hasLoaded = false;
        
        this.img = texture;
        this.material = material;
        
        checkImg();
    }
    
    checkImg ()
    {
        requestAnimationFrame(() => { if (this.img.hasLoaded) return this.load(); this.checkImg(); });
    }
    
    load ()
    {
        let gl = this.material.gl;
        
        let filterMode;
        let wrapMode;
        let rect = new Rect();
        
        switch (this.img.filterMode)
        {
            case 0:
                filterMode = gl.LINEAR;
                break;
            case 1:
                filterMode = gl.NEAREST;
                break;
        }
        
        switch (this.img.wrapMode)
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
        
        gl.useProgram(this.material.program);
        
        this.texture = gl.createTexture();
        this.texBuffer = gl.createBuffer();
        this.geoBuffer = gl.createBuffer();
        
        this.aVPosLoc = gl.getAttribLocation(this.material.program, "aVertexPos");
        this.aTPosLoc = gl.getAttribLocation(this.material.program, "aTexturePos");
        this.uImgLoc = gl.getUniformLocation(this.material.program, "uImage");
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl,RGBA, gl.UNSIGNED_BYTE, this.img.img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.useProgram(null);
        
        this.hasLoaded = true;
    }
    
    render ()
    {
        if (!this.hasLoaded) return null;
        
        let gl = this.material.gl;
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        
        gl.uniform1i(this.uImgLoc, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.enableVertexAttribArray(this.aTPosLoc);
        gl.vertexAttribPointer(this.aTPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
        gl.enableVertexAttribArray(this.aVPosLoc);
        gl.vertexAttribPointer(this.aVPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        
        gl.useProgram(null);
    }
}

class Vector2
{
    constructor (x = 0.0, y = 0.0)
    {
        this.x = x;
        this.y = y;
    }
    
    Set (x, y)
    {
        if (x == null || y == null) return ThrowError(0);
        
        this.x = x;
        this.y = y;
    }
    
    static zero ()
    {
        return new Vector2(0, 0);
    }
    
    static one ()
    {
        return new Vector2(1, 1);
    }
    
    static up ()
    {
        return new Vector2(0, 1);
    }
    
    static down ()
    {
        return new Vector2(0, -1);
    }
    
    static left ()
    {
        return new Vector2(-1, 0);
    }
    
    static right ()
    {
        return new Vector2(1, 0);
    }
    
    get magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    get normalized ()
    {
        return new Vector2(this.x / this.magnitude || 0.0, this.y / this.magnitude || 0.0);
    }
    
    toString ()
    {
        return `${this.x}, ${this.y}`;
    }
    
    Equals (other)
    {
        return this.x == other.x && this.y == other.y;
    }
    
    Normalize ()
    {
        let magnitude = this.magnitude;
        
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
    
    static Distance (a, b)
    {
        let x = a.x - b.x;
        let y = a.y - b.y;
        
        return Math.sqrt(x * x + y * y);
    }
    
    static Dot (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return (lhs.x * rhs.x + lhs.y * rhs.y)
    }
    
    static Min (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
    }
    
    static Max (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
    }
}

class Color
{
    constructor (r = 0.0, g = 0.0, b = 0.0, a = 1.0)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    Set (r, g, b, a = this.a)
    {
        if (r == null || g == null || b == null) return ThrowError(0);
        
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    get grayscale ()
    {
        let value = (this.r * 0.3 + this.g * 0.59 + this.b * 0.11);
        
        return new Color(value, value, value, this.a);
    }
    
    toString ()
    {
        return `${this.r}, ${this.g}, ${this.b}, ${this.a}`;
    }
}
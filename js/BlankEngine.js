/**
 * The main static class of the engine
 * @public
 * @static
 * @class
 */
function BlankEngine () ThrowError(1);



// ---------- Static Classes

//function SceneManager ()
//{
//    
//}



// ---------- Classes

// ----- Data Types

class Matrix3x3
{
    constructor ()
    {
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    
    GetValue (row, column)
    {
        if (row == null || column == null) return ThrowError(0);
        
        let arrayPos = 0;
        let matVPos = `${row}${column}`;
        
        switch (matVPos)
        {
            case "01":
                arrayPos = 1;
                break;
            case "02":
                arrayPos = 2;
                break;
            case "10":
                arrayPos = 3;
                break;
            case "11":
                arrayPos = 4;
                break;
            case "12":
                arrayPos = 5;
                break;
            case "20":
                arrayPos = 6;
                break;
            case "21":
                arrayPos = 7;
                break;
            case "22":
                arrayPos = 8;
                break;
        }
        
        return this.matrix[arrayPos];
    }
    
    SetValue (row, column, value)
    {
        if (row == null || column == null || value == null) return ThrowError(0);
        
        let arrayPos = 0;
        let matVPos = `${row}${column}`;
        
        switch (matVPos)
        {
            case "01":
                arrayPos = 1;
                break;
            case "02":
                arrayPos = 2;
                break;
            case "10":
                arrayPos = 3;
                break;
            case "11":
                arrayPos = 4;
                break;
            case "12":
                arrayPos = 5;
                break;
            case "20":
                arrayPos = 6;
                break;
            case "21":
                arrayPos = 7;
                break;
            case "22":
                arrayPos = 8;
                break;
        }
        
        this.matrix[arrayPos] = value;
    }
    
    SetRow (index, values)
    {
        if (index == null || values[0] == null || values[1] == null || values[2] == null) return ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(index, i, values[i]);
        }
    }
    
    SetColumn (index, values)
    {
        if (index == null || values[0] == null || values[1] == null || values[2] == null) return ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(i, index, values[i]);
        }
    }
    
    GetRow (index)
    {
        if (index == null) return ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(index, i);
        }
        
        return output;
    }
    
    GetColumn (index)
    {
        if (index == null) return ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(i, index);
        }
        
        return output;
    }
    
    get floatArray ()
    {
        return new Float32Array(this.matrix);
    }
    
    get transpose ()
    {
        let output = new Matrix3x3();
        let m = this.matrix;
        
        output.matrix = [
            m[0], m[3], m[6],
            m[1], m[4], m[7],
            m[2], m[5], m[8]
        ];
        
        return output;
    }
    
    static Multiply (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        let output = new Matrix3x3();
        let a = lhs.matrix;
        let b = rhs.matrix;
        
        output.matrix = [
            a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
            a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
            a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
            a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
            a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
            a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
            a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
            a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
            a[2] * b[6] + a[5] * b[7] + a[8] * b[8],
        ];
        
        return output;
    }
}

/**
 * Used to represent 2D vectors, positions and points
 * @public
 * @class
 */
class Vector2
{
    /**
     * Creates a new Vector2 with given x and y components
     * @memberof Vector2
     * @param {float} x - The X component of the vector
     * @param {float} y - The Y component of the vector
     */
    constructor (x, y)
    {
        /**
         * The X component of the vector
         * @memberof Vector2
         * @public
         * @member {float}
         */
        this.x = x ?? 0.0;
        
        /**
         * The Y component of the vector
         * @memberof Vector2
         * @public
         * @member {float}
         */
        this.y = y ?? 0.0;
    }
    
    
    // Static Properties
    
    /**
     * Shorthand for Vector2(0, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get zero ()
    {
        return new Vector2(0, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get one ()
    {
        return new Vector2(1, 1);
    }
    
    /**
     * Shorthand for Vector2(0, 1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get up ()
    {
        return new Vector2(0, 1);
    }
    
    /**
     * Shorthand for Vector2(0, -1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get down ()
    {
        return new Vector2(0, -1);
    }
    
    /**
     * Shorthand for Vector2(-1, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get left ()
    {
        return new Vector2(-1, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get right ()
    {
        return new Vector2(1, 0);
    }
    
    
    // Properties
    
    /**
     * (Read Only)
     * Returns the length of this vector
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {float}
     */
    get magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns the squared length of this vector
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {float}
     */
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns this vector with a magnitude of 1
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {Vector2}
     */
    get normalized ()
    {
        return new Vector2(this.x / this.magnitude || 0.0, this.y / this.magnitude || 0.0);
    }
    
    
    // Methods
    
    /**
     * Sets the x and y components of the vector
     * @memberof Vector2
     * @public
     * @function
     * @param {float} x - The X component of the vector
     * @param {float} y - The Y component of the vector
     */
    Set (x, y)
    {
        if (x == null || y == null) return ThrowError(0);
        
        this.x = x;
        this.y = y;
    }
    
    /**
     * Returns a string format of this vector
     * @memberof Vector2
     * @public
     * @function
     * @returns {string}
     */
    toString ()
    {
        return `(${this.x}, ${this.y})`;
    }
    
    /**
     * Compares this vector with another Vector2, returns true if the vectors are equal
     * @memberof Vector2
     * @public
     * @function
     * @param {Vector2} other - The vector you want to compare with
     * @returns {bool}
     */
    Equals (other)
    {
        return this.x == other.x && this.y == other.y;
    }
    
    /**
     * Makes this vector have a magnitude of 1
     * @memberof Vector2
     * @public
     * @function
     */
    Normalize ()
    {
        let magnitude = this.magnitude;
        
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
    
    
    // Static Methods
    
    /**
     * Returns the distance of a and b
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} a - The first vector
     * @param {Vector2} b - The second vector
     * @returns {float}
     */
    static Distance (a, b)
    {
        let x = a.x - b.x;
        let y = a.y - b.y;
        
        return Math.sqrt(x * x + y * y);
    }
    
    /**
     * Returns the dot product of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {float}
     */
    static Dot (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return (lhs.x * rhs.x + lhs.y * rhs.y)
    }
    
    /**
     * Returns a vector made of the smallest components of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {Vector2}
     */
    static Min (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
    }
    
    /**
     * Returns a vector made of the largest components of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {Vector2}
     */
    static Max (lhs, rhs)
    {
        if (lhs == null || rhs == null) return ThrowError(0);
        
        return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
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
        let x = this.x;
        let y = this.y;
        let w = this.width;
        let h = this.height;
        
        return new Float32Array([x, y, x + w, y, x, y + h, x, y + h, x + w, y, x + w, y + h]);
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


// ----- Objects

class Object
{
    constructor ()
    {
        this.name = null;
    }
    
    toString ()
    {
        return this.name;
    }
}

class GameObject extends Object
{
    constructor (name, components, active)
    {
        if (components != null && !Array.isArray(components)) return ThrowError(0);
        
        this.name = name ?? "Empty Object";
        this.activeSelf = active ?? true;
        this.components = components ?? [];
        
        for (int i = 0; i < this.components.length; i++)
        {
            this.components[i].name = this.name;
            this.components[i].gameObject = this;
        }
        
        this.#hasAwoken = false;
        this.#hasStarted = false;
    }
    
    SetActive (state)
    {
        this.activeSelf = state;
        
        for (let i = 0; i < this.components.length; i++)
        {
            this.components[i].gameObject = this;
        }
    }
    
    set activeSelf (value)
    {
        return ThrowError(5);
    }
    
    Awake ()
    {
        if (!this.activeSelf || this.#hasAwoken) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Awake;
            callback();
        }
    }
    
    OnEnable ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled || !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnEnable;
            callback();
        }
    }
    
    Start ()
    {
        if (!this.activeSelf || this.#hasStarted) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Start;
            callback();
        }
    }
    
    FixedUpdate ()
    {
        if (!this.activeSlef) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].FixedUpdate;
            callback();
        }
    }
    
    Update ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Update;
            callback();
        }
    }
    
    LateUpdate ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].LateUpdate;
            callback();
        }
    }
    
    OnPreRender ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnPreRender;
            callback();
        }
    }
    
    OnRenderObject ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnRenderObject;
            callback();
        }
    }
    
    OnPostRender ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnPostRender;
            callback();
        }
    }
    
    OnRenderImage ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnRenderImage;
            callback();
        }
    }
    
    OnApplicationQuit ()
    {
        if (!this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnApplicationQuit;
            callback();
        }
    }
    
    OnDisable ()
    {
        if (this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnDisable;
            callback();
        }
    }
    
    OnDestroy ()
    {
        if (this.activeSelf) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnDestroy;
            callback();
        }
        
        this.OnDisable();
    }
}

class Material extends Object
{
    constructor (vertexShader, fragmentShader)
    {
        this.gl = Application.gl;
        
        let vShader = this.asShader(vertexShader, this.gl.VERTEX_SHADER) ?? "attribute vec2 aVertexPos; attribute vec2 aTexturePos; varying vec2 vTexturePos; void main () { gl_Position = vec4(aVertexPos, 1, 1); vTexturePos = aTexturePos; }";
        let fShader = this.asShader(fragmentShader, this.gl.FRAGMENT_SHADER) ?? "precision mediump float; uniform sampler2D uImage; varying vec2 vTexturePos; void main () { gl_FragColor = texture2D(uImage, vTexturePos); }";
        
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

class Texture extends Object
{
    constructor (src)
    {
        if (src == null) return ThrowError(0);
        
        this.hasLoaded = false;
        
        this.wrapMode = 0;
        this.filterMode = 0;
        
        this.img = new Image();
        this.img.src = `../img/${src}`;
        this.img.sprite = this;
        
        this.img.onload = () => { this.hasLoaded = true; };
    }
}

class Sprite extends Object
{
    constructor (texture, rect)
    {
        this.texture = texture;
        this.rect = rect ?? new Rect();
    }
}


// ----- Components

class Component extends Object
{
    constructor ()
    {
        this.gameObject = null;
    }
}

class Behavior extends Component
{
    constructor ()
    {
        this.enabled = true;
    }
    
    get isActiveAndEnabled ()
    {
        return this.gameObject.activeSelf && this.enabled;
    }
}

class GameBehavior extends Behavior
{
    constructor ()
    {
        
    }
    
    get isGameBehavior ()
    {
        return true;
    }
    
    Awake () { }
    
    OnEnable () { }
    
    Start () { }
    
    FixedUpdate () { }
    
    Update () { }
    
    LateUpdate () { }
    
    OnPreRender () { }
    
    OnRenderObject () { }
    
    OnPostRender () { }
    
    OnRenderImage () { }
    
    OnApplicationQuit () { }
    
    OnDisable () { }
    
    OnDestroy () { }
}

class SpriteRenderer extends Component
{
    constructor (sprite, material)
    {
        if (texture == null) return ThrowError(0);
        
        this.hasLoaded = false;
        
        this.sprite = sprite;
        this.material = material = new Material();
    }
    
    checkImg ()
    {
        requestAnimationFrame(() => { if (this.sprite.texture.hasLoaded) return this.load(); this.checkImg(); });
    }
    
    load ()
    {
        if (this.hasLoaded) return null;
        
        let texture = this.sprite.texture;
        
        if (isNaN(texture.filterMode) || texture.filterMode < 0 || texture.filterMode > 1 || isNan(texture.wrapMode) || texture.wrapMode < 0 || texture.wrapMode > 2) return ThrowError(0);
        
        let gl = this.material.gl;
        
        let filterMode;
        let wrapMode;
        let rect = new Rect();
        
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img);
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
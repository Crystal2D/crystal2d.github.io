class Material
{
    #gl = null;
    #program = null;
    
    get gl ()
    {
        return this.#gl;
    }
    
    get program ()
    {
        return this.#program;
    }
    
    constructor (vertexShader, fragmentShader)
    {
        this.#gl = Application.gl;
        
        const vShader = vertexShader ?? Shader.Find("Default/None", "VERTEX");
        const fShader = fragmentShader ?? Shader.Find("Default/None", "FRAGMENT");
        
        this.#program = this.#gl.createProgram();
        
        this.#gl.attachShader(this.#program, vShader.shader);
        this.#gl.attachShader(this.#program, fShader.shader);
        this.#gl.linkProgram(this.#program);
        
        if (!this.#gl.getProgramParameter(this.#program, this.#gl.LINK_STATUS)) throw BlankEngine.ThrowError(2, this.#gl.getProgramInfoLog(this.#program));
        
        this.#gl.detachShader(this.#program, vShader.shader);
        this.#gl.detachShader(this.#program, fShader.shader);
    }
    
    getAttribLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.#gl.getAttribLocation(this.#program, name);
    }
    
    getUniformLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.#gl.getUniformLocation(this.#program, name);
    }
}
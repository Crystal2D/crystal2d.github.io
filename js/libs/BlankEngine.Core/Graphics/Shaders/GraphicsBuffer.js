class GraphicsBuffer
{
    #stride = 1;
    
    #gl = null;
    #buffer = null;
    
    name = "";
    
    get stride ()
    {
        return this.#stride;
    }
    
    constructor (name, stride)
    {
        this.name = name;
        this.#stride = stride ?? 1;
        
        this.#gl = Application.gl;
        
        this.#buffer = this.#gl.createBuffer();
    }
    
    GetNativeBuffer ()
    {
        return this.#buffer;
    }
    
    SetData (data)
    {
        const gl = this.#gl;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
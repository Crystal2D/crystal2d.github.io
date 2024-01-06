class GraphicsBuffer
{
    #stride = 1;
    
    #gl = null;
    #buffer = null;
    
    usageType = 0;
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

        let usage = null;

        switch (this.usageType)
        {
            case 0:
                usage = gl.STATIC_DRAW;
                break;
            case 1:
                usage = gl.DYNAMIC_DRAW;
                break;
            case 2:
                usage = gl.STREAM_DRAW;
                break;
        }

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
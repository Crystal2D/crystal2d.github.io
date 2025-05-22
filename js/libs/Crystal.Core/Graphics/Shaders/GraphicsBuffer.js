class GraphicsBuffer
{
    #unloaded = false;
    #stride = 1;
    
    #gl = null;
    #buffer = null;
    
    target = 0;
    usageType = 0;
    name = "";

    get isUnloaded ()
    {
        return this.#unloaded;
    }
    
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

    Unload ()
    {
        if (this.#unloaded) return;

        this.#unloaded = true;

        this.#gl.deleteBuffer(this.#buffer);
    }
    
    GetNativeBuffer ()
    {
        return this.#buffer;
    }
    
    SetData (data)
    {
        const gl = this.#gl;
        const target = this.target === 0 ? gl.ARRAY_BUFFER : gl.ELEMENT_ARRAY_BUFFER;
        
        gl.bindBuffer(target, this.#buffer);

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

        gl.bufferData(target, new Float32Array(data), usage);
        gl.bindBuffer(target, null);
    }
}
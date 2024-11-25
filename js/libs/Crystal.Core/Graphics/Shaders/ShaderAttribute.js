class ShaderAttribute
{
    #enabled = false;
    #index = 0;
    #type = 0;
    #size = 1;
    #name = "";
    
    #gl = null;
    #program = null;
    
    get enabled ()
    {
        return this.#enabled;
    }
    
    set enabled (value)
    {
        this.#enabled = value;
        
        const gl = this.#gl;
        
        gl.useProgram(this.#program);
        
        if (value) gl.enableVertexAttribArray(this.#index);
        else gl.disableVertexAttribArray(this.#index);
        
        gl.useProgram(null);
    }
    
    get name ()
    {
        return this.#name;
    }
    
    constructor (name, type, program)
    {
        this.#gl = Application.gl;
        this.#program = program;
        
        this.#name = name.endsWith("[0]") ? name.slice(0, -3) : name;
        
        const gl = this.#gl;
        
        this.#index = gl.getAttribLocation(this.#program, name);
        
        if (type.startsWith("FLOAT")) this.#type = gl.FLOAT;
        else if (type.startsWith("INT")) this.#type = gl.INT;
        else if (type.startsWith("UNSIGNED_INT")) this.#type = gl.UNSIGNED_INT;
        
        const size = parseInt(type[type.length - 1]);
        
        if (!Number.isNaN(size) && size !== 1) this.#size = size;
        
        this.enabled = true;
    }
    
    Set (buffer, offset)
    {
        const gl = this.#gl;
        
        gl.useProgram(this.#program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.GetNativeBuffer());
        gl.vertexAttribPointer(
            this.#index,
            this.#size,
            this.#type,
            false,
            buffer.stride * 4,
            (offset ?? 0) * 4
        );
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }
}
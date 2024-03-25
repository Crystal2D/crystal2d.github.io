class Material
{
    #props = [];
    #buffers = [];
    #attribs = [];
    
    #gl = null;
    #program = null;
    #vertex = null;
    #fragment = null;
    
    get vertexShader ()
    {
        return this.#vertex;
    }
    
    get fragmentShader ()
    {
        return this.#fragment;
    }
    
    get gl ()
    {
        return this.#gl;
    }
    
    get program ()
    {
        return this.#program;
    }
    
    #Prop = class
    {
        array = false;
        index = 0;
        size = 0;
        name = "";
        type = "";
        
        location = null;
        
        constructor (name, type, size)
        {
            this.array = name.endsWith("[0]");
            this.name = this.array ? name.slice(0, -3) : name,
            this.type = type;
            this.size = size;
        }
    }
    
    constructor (vertexShader, fragmentShader)
    {
        this.#gl = Application.gl;
        
        this.#vertex = vertexShader ?? Shader.Find("Default/Standard", "VERTEX");
        this.#fragment = fragmentShader ?? Shader.Find("Default/Standard", "FRAGMENT");
        
        const gl = this.#gl;
        
        this.#program = gl.createProgram();
        
        const program = this.#program;
        
        gl.attachShader(program, this.#vertex.shader);
        gl.attachShader(program, this.#fragment.shader);
        
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            const vErr = gl.getShaderInfoLog(this.#vertex.shader);
            const fErr = gl.getShaderInfoLog(this.#fragment.shader);
            
            console.error(`Shader Errors:\n${(vErr === "" ? "" : `Vertex:\n${vErr}`)}${((vErr === "" || fErr === "") ? "" : "\n\n")}${(fErr === "" ? "" : `Fragment:\n${fErr}`)}`);
        }
        
        const uniforms = this.#gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniforms; i++)
        {
            const uniform = gl.getActiveUniform(program, i);
            const name = uniform.name;
            
            if (name.startsWith("gl_") || name.startsWith("webgl_")) continue;
            
            const prop = new this.#Prop(
                name,
                this.#GetGLType(uniform.type),
                uniform.size
            );
            
            prop.index = gl.getUniformIndices(program, [prop.name])[0];
            prop.location = gl.getUniformLocation(program, prop.name);
            
            this.#props.push(prop);
        }
        
        const attributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        
        for (let i = 0; i < attributes; i++)
        {
            const attribute = gl.getActiveAttrib(program, i);
            const name = attribute.name;
            
            if (name.startsWith("gl_") || name.startsWith("webgl_")) continue;
            
            this.#attribs.push(new ShaderAttribute(
                name,
                this.#GetGLType(attribute.type),
                program
            ));
        }
        
        gl.detachShader(program, this.#vertex.shader);
        gl.detachShader(program, this.#fragment.shader);
    }
    
    #GetGLType (value)
    {
        const gl = this.#gl;
        
        for (const key in gl)
        {
            if (gl[key] === value) return key;
        }
        
        return `0x${value.toString(16)}`;
    }
    
    #GetUniformLocation (name)
    {
        let prop = name;
        
        if (typeof prop === "string") prop = this.GetPropertyNameID(prop);
        
        return this.#props[prop].location;
    }
    
    #HasPropertyOfType (name, type, array)
    {
        if (typeof name === "string") return this.#props.find(element => element.name === name && element.type === type && element.array === array) != null;
        
        const prop = this.#props[name];
        
        return prop != null && prop.type === type;
    }
    
    #GetPropertyTypeSize (name, type, array)
    {
        const prop2 = this.#HasPropertyOfType(name, `${type}2`, array);
        const prop3 = this.#HasPropertyOfType(name, `${type}3`, array);
        const prop4 = this.#HasPropertyOfType(name, `${type}4`, array);
        
        if (prop2) return 2;
        else if (prop3) return 3;
        else if (prop4) return 4;
        
        return 0;
    }
    
    #HasVectorOfType (name, type, array)
    {
        const size = this.#GetPropertyTypeSize(name, `${type}_VEC`, true);
        
        return size !== 0;
    }
    
    #SetVectorBase (name, array, values)
    {
        const size = this.#GetPropertyTypeSize(name, "FLOAT_VEC", array);
        
        if (size === 0) return;
        
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        const value = new Float32Array(values);
        
        gl.useProgram(this.#program);
        
        switch (size)
        {
            case 2:
                gl.uniform2fv(loc, value);
                break;
            case 3:
                gl.uniform3fv(loc, value);
                break;
            case 4:
                gl.uniform4fv(loc, value);
                break;
        }
        
        gl.useProgram(null);
    }
    
    #SetIntVectorBase (name, type, array, values)
    {
        const size = this.#GetPropertyTypeSize(name, `${type}_VEC`, array);
        
        if (size === 0) return;
        
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        const value = new Int32Array(values);
        
        gl.useProgram(this.#program);
        
        switch (size)
        {
            case 2:
                gl.uniform2iv(loc, value);
                break;
            case 3:
                gl.uniform3iv(loc, value);
                break;
            case 4:
                gl.uniform4iv(loc, value);
                break;
        }
        
        gl.useProgram(null);
    }
    
    #SetUintVectorBase (name, array, values)
    {
        const size = this.#GetPropertyTypeSize(name, "UNSIGNED_INT_VEC", array);
        
        if (size === 0) return;
        
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        const value = new Uint32Array(values);
        
        gl.useProgram(this.#program);
        
        switch (size)
        {
            case 2:
                gl.uniform2uiv(loc, value);
                break;
            case 3:
                gl.uniform3uiv(loc, value);
                break;
            case 4:
                gl.uniform4uiv(loc, value);
                break;
        }
        
        gl.useProgram(null);
    }
    
    #GetMatrixTypeSize (name, array)
    {
        const squareSize = this.#GetPropertyTypeSize(name, "FLOAT_MAT", array);
        
        if (squareSize !== 0) return `${squareSize}`;
        
        const mat2x3 = this.#HasPropertyOfType(name, "FLOAT_MAT2x3", array);
        const mat2x4 = this.#HasPropertyOfType(name, "FLOAT_MAT2x4", array);
        
        if (mat2x3) return "23";
        else if (mat2x4) return "24";
        
        const mat3x2 = this.#HasPropertyOfType(name, "FLOAT_MAT3x2", array);
        const mat3x4 = this.#HasPropertyOfType(name, "FLOAT_MAT3x4", array);
        
        if (mat3x2) return "32";
        else if (mat3x4) return "34";
        
        const mat4x2 = this.#HasPropertyOfType(name, "FLOAT_MAT4x2", array);
        const mat4x3 = this.#HasPropertyOfType(name, "FLOAT_MAT4x3", array);
        
        if (mat4x2) return "42";
        else if (mat4x3) return "43";
        
        return "0";
    }
    
    #SetMatrixBase (name, array, values)
    {
        const size = this.#GetMatrixTypeSize(name, array);
        
        if (size === "0") return;
        
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        const value = new Float32Array(values);
        
        gl.useProgram(this.#program);
        
        switch (size)
        {
            case "2":
                gl.uniformMatrix2fv(loc, false, value);
                break;
            case "3":
                gl.uniformMatrix3fv(loc, false, value);
                break;
            case "4":
                gl.uniformMatrix4fv(loc, false, value);
                break;
            case "23":
                gl.uniformMatrix2x3fv(loc, false, value);
                break;
            case "24":
                gl.uniformMatrix2x4fv(loc, false, value);
                break;
            case "32":
                gl.uniformMatrix3x2fv(loc, false, value);
                break;
            case "34":
                gl.uniformMatrix3x4fv(loc, false, value);
                break;
            case "42":
                gl.uniformMatrix4x2fv(loc, false, value);
                break;
            case "43":
                gl.uniformMatrix4x3fv(loc, false, value);
                break;
        }
        
        gl.useProgram(null);
    }
    
    Duplicate ()
    {
        return new Material(this.#vertex, this.#fragment);
    }
    
    GetPropertyNames ()
    {
        return this.#props.map(item => item.name);
    }
    
    GetPropertyNameID (name)
    {
        let output = -1;
        
        this.#props.find((element, index) => {
            if (element.name !== name) return false;
            
            output = index;
            
            return true;
        });
        
        return output;
    }
    
    GetPropertyIndex (name)
    {
        let output = -1;
        
        this.#props.find(element => {
            if (element.name !== name) return false;
            
            output = element.index;
            
            return true;
        });
        
        return output;
    }
    
    GetBufferNames ()
    {
        return this.#buffers.map(item => item.name);
    }
    
    GetBufferNameID (name)
    {
        let output = -1;
        
        this.#buffers.find((element, index) => {
            if (element.name !== name) return false;
            
            output = index;
            
            return true;
        });
        
        return output;
    }
    
    GetAttributeNames ()
    {
        return this.#attribs.map(item => item.name);
    }
    
    GetAttributeNameID (name)
    {
        let output = -1;
        
        this.#attribs.find((element, index) => {
            if (element.name !== name) return false;
            
            output = index;
            
            return true;
        });
        
        return output;
    }
    
    GetAttributeIndex (name)
    {
        let output = -1;
        
        this.#attribs.find(element => {
            if (element.name !== name) return false;
            
            output = element.index;
            
            return true;
        });
        
        return output;
    }
    
    HasProperty (name)
    {
        if (typeof name === "string") return this.#props.find(element => element.name === name) != null;
        
        const prop = this.#props[name];
        
        return prop != null;
    }
    
    HasBoolean (name)
    {
        return this.#HasPropertyOfType(name, "BOOL", false);
    }
    
    HasBooleanArray (name)
    {
        return this.#HasPropertyOfType(name, "BOOL", true);
    }
    
    HasInt (name)
    {
        return this.#HasPropertyOfType(name, "INT", false);
    }
    
    HasIntArray (name)
    {
        return this.#HasPropertyOfType(name, "INT", true);
    }
    
    HasUint (name)
    {
        return this.#HasPropertyOfType(name, "UNSIGNED_INT", false);
    }
    
    HasUintArray (name)
    {
        return this.#HasPropertyOfType(name, "UNSIGNED_INT", true);
    }
    
    HasFloat (name)
    {
        return this.#HasPropertyOfType(name, "FLOAT", false);
    }
    
    HasFloatArray (name)
    {
        return this.#HasPropertyOfType(name, "FLOAT", true);
    }
    
    HasSampler2D (name)
    {
        return this.#HasPropertyOfType(name, "SAMPLER_2D", false);
    }
    
    HasSampler2DArray (name)
    {
        return this.#HasPropertyOfType(name, "SAMPLER_2D", true);
    }
    
    HasSamplerCube (name)
    {
        return this.#HasPropertyOfType(name, "SAMPLER_CUBE", false);
    }
    
    HasSamplerCubeArray (name)
    {
        return this.#HasPropertyOfType(name, "SAMPLER_CUBE", true);
    }
    
    HasVector (name)
    {
        return this.#HasVectorOfType(name, "FLOAT", false);
    }
    
    HasVectorArray (name)
    {
        return this.#HasVectorOfType(name, "FLOAT", true);
    }
    
    HasBooleanVector (name)
    {
        return this.#HasVectorOfType(name, "BOOL", false);
    }
    
    HasBooleanVectorArray (name)
    {
        return this.#HasVectorOfType(name, "BOOL", true);
    }
    
    HasIntVector (name)
    {
        return this.#HasVectorOfType(name, "INT", false);
    }
    
    HasIntVectorArray (name)
    {
        return this.#HasVectorOfType(name, "INT", true);
    }
    
    HasUintVector (name)
    {
        return this.#HasVectorOfType(name, "UNSIGNED_INT", false);
    }
    
    HasUintVectorArray (name)
    {
        return this.#HasVectorOfType(name, "UNSIGNED_INT", true);
    }
    
    HasMatrix (name)
    {
        const size = this.#GetMatrixTypeSize(name, false);
        
        return size !== "0";
    }
    
    HasMatrixArray (name)
    {
        const size = this.#GetMatrixTypeSize(name, true);
        
        return size !== "0";
    }
    
    HasBuffer (name)
    {
        return this.GetBuffer(name) != null;
    }
    
    HasAttribute (name)
    {
        return this.GetAttribute(name) != null;
    }
    
    GetProperty (name)
    {
        const loc = this.#GetUniformLocation(name);
        
        return this.#gl.getUniform(this.#program, loc);
    }
    
    GetBuffer (name)
    {
        if (typeof name === "string") return this.#buffers.find(element => element.name === name);
        else return this.#buffers[name];
    }
    
    GetAttribute (name)
    {
        if (typeof name === "string") return this.#attribs.find(element => element.name === name);
        else return this.#attribs[name];
    }
    
    SetBoolean (name, value)
    {
        this.SetInt(name, +value);
    }
    
    SetBooleanArray (name, values)
    {
        let value = [];
        
        for (let i = 0; i < values.length; i++) value.push(+values[i]);
        
        this.SetIntArray(name, value);
    }
    
    SetInt (name, value)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1i(loc, value);
        gl.useProgram(null);
    }
    
    SetIntArray (name, values)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1iv(loc, new Int32Array(values));
        gl.useProgram(null);
    }
    
    SetUint (name, value)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1ui(loc, value);
        gl.useProgram(null);
    }
    
    SetUintArray (name, values)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1uiv(loc, new Uint32Array(values));
        gl.useProgram(null);
    }
    
    SetFloat (name, value)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1f(loc, value);
        gl.useProgram(null);
    }
    
    SetFloatArray (name, values)
    {
        const gl = this.#gl;
        const loc = this.#GetUniformLocation(name);
        
        gl.useProgram(this.#program);
        gl.uniform1fv(loc, new Float32Array(values));
        gl.useProgram(null);
    }
    
    SetSampler2D (name, value)
    {
        this.SetInt(name, value);
    }
    
    SetSampler2DArray (name, values)
    {
        this.SetIntArray(name, values);
    }
    
    SetSamplerCube (name, value)
    {
        this.SetInt(name, value);
    }
    
    SetSamplerCubeArray (name, values)
    {
        this.SetIntArray(name, values);
    }
    
    SetVector (name, ...values)
    {
        this.#SetVectorBase(name, false, values);
    }
    
    SetVectorArray (name, ...values)
    {
        this.#SetVectorBase(name, true, values.flat(1));
    }
    
    SetBooleanVector (name, ...values)
    {
        this.#SetIntVectorBase(name, "BOOL", false, values);
    }
    
    SetBooleanVectorArray (name, ...values)
    {
        this.#SetIntVectorBase(name, "BOOL", true, values.flat(1));
    }
    
    SetIntVector (name, ...values)
    {
        this.#SetIntVectorBase(name, "INT", false, values);
    }
    
    SetIntVectorArray (name, ...values)
    {
        this.#SetIntVectorBase(name, "INT", true, values.flat(1));
    }
    
    SetUintVector (name, ...values)
    {
        this.#SetUintVectorBase(name, false, values);
    }
    
    SetUintVectorArray (name, ...values)
    {
        this.#SetUintVectorBase(name, true, values.flat(1));
    }
    
    SetMatrix (name, ...values)
    {
        this.#SetMatrixBase(name, false, values);
    }
    
    SetMatrixArray (name, ...values)
    {
        this.#SetMatrixBase(name, true, values.flat(1));
    }
    
    AddBuffer (name, data, stride)
    {
        let buffer = this.GetBuffer(name);
        
        if (buffer != null)
        {
            if (data != null) buffer.SetData(data);
            
            return this.GetBufferNameID(name);
        }
        
        buffer = new GraphicsBuffer(name, stride);
        
        if (data != null) buffer.SetData(data);
        
        this.#buffers.push(buffer);
        
        return this.#buffers.length - 1;
    }
    
    SetBuffer (name, data)
    {
        const buffer = this.GetBuffer(name);
        
        buffer.SetData(data);
    }
    
    SetAttribute (name, buffer, offset)
    {
        const attribute = this.GetAttribute(name);
        const dataBuffer = this.GetBuffer(buffer);
        
        attribute.Set(dataBuffer, offset);
    }
}
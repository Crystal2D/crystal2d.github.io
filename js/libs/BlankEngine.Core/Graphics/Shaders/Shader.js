class Shader
{
    static #shaders = [];
    static #loaded = false;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    #type = null;
    #shader = null;
    
    get type ()
    {
        return this.#type;
    }
    
    get shader ()
    {
        return this.#shader;
    }
    
    constructor (name, shader, type)
    {
        if (!name) throw BlankEngine.Err(2, "Shader Data: Shader name is undefined");
        if (!shader) throw BlankEngine.Err(2, "Shader Data: Shader is undefined");
        if (!type) throw BlankEngine.Err(2, "Shader Data: Shader type is undefined");
        
        this.name = name;
        this.#type = type;
        
        const gl = Application.gl;
        
        let shaderType;
        
        switch (this.#type)
        {
            case "VERTEX":
                shaderType = gl.VERTEX_SHADER;
                break;
            case "FRAGMENT":
                shaderType = gl.FRAGMENT_SHADER;
                break;
        }
        
        if (shaderType == null) throw BlankEngine.Err(2, `Shader Data: Type "${this.#type}" doesn't exist`);
        
        this.#shader = gl.createShader(shaderType);
        
        gl.shaderSource(this.#shader, shader);
        gl.compileShader(this.#shader);
        
        if (!gl.getShaderParameter(this.#shader, gl.COMPILE_STATUS)) throw BlankEngine.Err(2, gl.getShaderInfoLog(this.#shader));
    }
    
    static Find (name, type)
    {
        if (name == null) throw BlankEngine.Err(0);
        
        for (let i = 0; i < this.#shaders.length; i++)
        {
            if (type != null && this.#shaders[i].type !== type) continue;
            if (this.#shaders[i].name === name) return this.#shaders[i];
        }
        
        throw BlankEngine.Err(3);
    }
    
    static async Set (shaders)
    {
        if (shaders == null || !Array.isArray(shaders)) throw BlankEngine.Err(0);
        
        this.#shaders[0] = new Shader("Default/None", "attribute vec2 aVertexPos; attribute vec2 aTexturePos; varying vec2 vTexturePos; uniform mat3 uWorldSpaceMat; void main () { gl_Position = vec4(uWorldSpaceMat * vec3(aVertexPos, 1), 1); vTexturePos = aTexturePos; }", "VERTEX");
        this.#shaders[1] = new Shader("Default/None", "precision mediump float; uniform sampler2D uSampler; varying vec2 vTexturePos; void main () { gl_FragColor = texture2D(uSampler, vTexturePos); }", "FRAGMENT");
        
        for (let iA = 0; iA < shaders.length; iA++)
        {
            if (shaders[iA] === "") continue;
            
            let slashes = 0;
            let keyword = "";
            let shaderData = ["", ""];
            let keywordValue = 0;
            let isInsideQuote = false;
            let quoteType = "";
            
            for (let iB = 0; iB < shaders[iA].length; iB++)
            {
                if (shaders[iA][iB] === "/" && shaders[iA][iB + 1] === "/")
                {
                    slashes++;
                    keywordValue = 0;
                    iB++;
                    
                    continue;
                }
                
                if (slashes >= 4) break;
                if (shaders[iA][iB] === "\n") continue;
                
                if (shaders[iA][iB] === `'` || shaders[iA][iB] === `"`)
                {
                    if (isInsideQuote && shaders[iA][iB] === quoteType)
                    {
                        isInsideQuote = false;
                        quoteType = "";
                        
                        continue;
                    }
                    
                    isInsideQuote = true;
                    quoteType = shaders[iA][iB];
                    
                    continue;
                }
                
                if (!isInsideQuote && shaders[iA][iB] === " ") continue;
                
                if (shaders[iA][iB] === ":")
                {
                    keywordValue = -1;
                    
                    switch (keyword)
                    {
                        case "NAME":
                            keywordValue = 1;
                            break;
                        case "TYPE":
                            keywordValue = 2;
                            break;
                    }
                    
                    if (keywordValue === -1) throw BlankEngine.Err(3, `Shader Data: Keyword "${keyword}" doesn't exist`);
                    
                    keyword = "";
                    
                    continue;
                }
                
                if (keywordValue !== 0)
                {
                    shaderData[keywordValue - 1] += shaders[iA][iB];
                    
                    continue;
                }
                
                keyword += shaders[iA][iB];
            }
            
            this.#shaders[iA + 2] = await new Shader(shaderData[0], shaders[iA], shaderData[1]);
        }
        
        this.#loaded = true;
    }
}
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
        
        this.#shader = gl.createShader(shaderType);
        
        gl.shaderSource(this.#shader, shader);
        gl.compileShader(this.#shader);
    }
    
    static Set (shaders)
    {
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
            
            const newShader = new Shader(shaderData[0], shaders[iA], shaderData[1]);
            
            if (this.#shaders.length === 0) this.#shaders[0] = newShader;
            else this.#shaders.push(newShader);
        }
        
        this.#loaded = true;
    }
    
    static Find (name, type)
    {
        for (let i = 0; i < this.#shaders.length; i++)
        {
            if (type != null && this.#shaders[i].type !== type) continue;
            if (this.#shaders[i].name === name) return this.#shaders[i];
        }
        
        return this.Find("Default/Standard", type);
    }
}
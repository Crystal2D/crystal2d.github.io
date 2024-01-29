class Shader
{
    static #loaded = false;
    static #shaders = [];
    
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
    
    static #GetShaderData (shader)
    {
        let slashes = 0;
        let keyword = "";
        let shaderData = ["", ""];
        let keywordValue = 0;
        let isInsideQuote = false;
        let quoteType = "";
        
        for (let i = 0; i < shader.length; i++)
        {
            if (shader[i] === "/" && shader[i + 1] === "/")
            {
                slashes++;
                keywordValue = 0;
                keyword = "";
                i++;
                
                continue;
            }
            
            if (slashes >= 4) break;
            if (shader[i] === "\n" || shader[i] === "\r") continue;
            
            if (shader[i] === `'` || shader[i] === `"`)
            {
                if (isInsideQuote && shader[i] === quoteType)
                {
                    isInsideQuote = false;
                    quoteType = "";
                    
                    continue;
                }
                
                isInsideQuote = true;
                quoteType = shader[i];
                
                continue;
            }
            
            if (!isInsideQuote && shader[i] === " ") continue;
            
            if (shader[i] === ":")
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
                shaderData[keywordValue - 1] += shader[i];
                
                continue;
            }
            
            keyword += shader[i];
        }
        
        return {
            name : shaderData[0],
            type : shaderData[1]
        };
    }
    
    static Find (name, type)
    {
        const output = this.#shaders.find(element => element.name === name && (type == null || element.type === type));
        
        return output ?? this.Find("Default/Standard", type);
    }
    
    static Set (shaders)
    {
        for (let i = 0; i < shaders.length; i++)
        {
            if (shaders[i] === "") continue;
            
            const shaderData = this.#GetShaderData(shaders[i]);
            
            const newShader = new Shader(shaderData.name, shaders[i], shaderData.type);
            
            this.#shaders.push(newShader);
        }
        
        this.#loaded = true;
    }
}
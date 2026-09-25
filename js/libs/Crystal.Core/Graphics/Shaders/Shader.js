class Shader
{
    static #loaded = false;
    static #shaders = [];
    
    static get isLoaded ()
    {
        return this.#loaded;
    }

    #vertex = null;
    #fragment = null;
    
    get vertex ()
    {
        return this.#vertex;
    }

    get fragment ()
    {
        return this.#fragment;
    }
    
    constructor (name, shader)
    {
        this.name = name;
        
        const gl = Application.gl;

        const commonHead = "#version 300 es\n#define "
        
        this.#vertex = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(this.#vertex, `${commonHead}VERTEX\n\n${shader}`);
        gl.compileShader(this.#vertex);

        this.#fragment = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.#fragment, `${commonHead}FRAGMENT\n\n${shader}`);
        gl.compileShader(this.#fragment);
    }
    
    static Find (name)
    {
        return this.#shaders.find(item => item.name === name);
    }
    
    static Set (shaders)
    {
        for (let i = 0; i < shaders.length; i++)
        {
            if (shaders[i].length === 0) continue;

            const search = shaders[i].match(/\/\/.*/);
            if (search == null) continue;

            const name = search[0].slice(2).trim();
            
            this.#shaders.push(new Shader(name, shaders[i]));
        }
        
        this.#loaded = true;
    }
}
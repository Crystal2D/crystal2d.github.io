BlankEngine.Core = class
{
    static initiateProgram ()
    {
        document.body.style.height = "100vh";
        document.body.style.margin = "0";
        document.body.style.display = "flex";
        document.body.style.alignItems = "center";
        
        this.loadData();
    }
    
    static loadData ()
    {
        this.compiledData = { shaders : [], loadedScripts : false };
        
        Managers.Data.ReadJSONFile(["../package", "../data/build"], ["BlankEngine.Core.packageData", "BlankEngine.Core.buildData"], () => { this.init(); });
    }
    
    static init ()
    {
        Window.data = this.packageData.window;
        Window.init();
        
        var shaderSrc = [];
        var shaderVar = [];
        
        for (let i = 0; i < this.buildData.shaders.length; i++)
        {
            shaderSrc[i] = `../shaders/${this.buildData.shaders[i]}.shader`;
            shaderVar[i] = `BlankEngine.Core.compiledData.shaders[${i}]`;
        }
        
        if (this.buildData.shaders[0] == null) Shader.Set([]);
        else Managers.Data.ReadFile(shaderSrc, shaderVar, () => { Shader.Set(this.compiledData.shaders); });
        
        for (let i = 0; i < this.buildData.scripts.length; i++)
        {
            while (!Shader.isReady) { }
            
            let scriptSrc = `js/${this.buildData.scripts[i]}.js`;
            let script = document.createElement("script");
            
            script.src = scriptSrc;
            script.type = "text/javascript";
            
            document.body.appendChild(script);
        }
        
        this.compiledData.loadedScripts = true; 
        
        this.requestUpdate();
    }
    
    static requestUpdate ()
    {
        requestAnimationFrame(this.update.bind(this));
    }
    
    static update ()
    {
        if (!document.hasFocus()) return this.requestUpdate();
        
        if (Application.isLoaded) Application.Update();
        this.requestUpdate();
    }
}

class Debug
{
    static #debugMode = false;
    
    static get isDebugMode ()
    {
        return this.#debugMode;
    }
    
    static Set (debugMode)
    {
        this.#debugMode = debugMode;
    }
}

function ThrowError (errorCode, errorDesc)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value is unassigned or invalid";
            break;
        case 1:
            errorText = "No instance to work with";
            break;
        case 2:
            errorText = "File cannot be loaded";
            break;
        case 3:
            errorText = "Shader is invalid";
            break;
    }
    
    if (errorDesc != null) errorText += `\n\nDescription: ${errorDesc}`;
    
    errorText += `\n\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}
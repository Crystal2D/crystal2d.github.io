class Managers { }

Managers.Data = class
{
    static ReadFile (src, varName, callback)
    {
        if (src == null || varName == null) return ThrowError(0);
        
        var hasArrays = 0;
        
        if (Array.isArray(src)) hasArrays++;
        if (Array.isArray(varName)) hasArrays++;
        
        if (hasArrays == 1) return ThrowError(0);
        
        var requestFunc;
        
        switch (hasArrays)
        {
            case 0:
                requestFunc = Function("callback", `let request = new XMLHttpRequest(); request.onload = () => { if (request.status < 400) { ${varName} = request.responseText; callback(); } }; request.onerror = () => { ThrowError(2); }; request.open("GET", "${src}"); request.overrideMimeType("application/json"); request.send();`);
                break;
            case 2:
                var arrayRequest = "";
                let fileLength = src.length - 1;
                
                for (let i = 0; i < fileLength; i++)
                {
                    arrayRequest += `var call_${i} = () => { Managers.Data.ReadFile("${src[i]}", "${varName[i]}", call_${i + 1}); };`;
                }
                
                requestFunc = Function("callback", `${arrayRequest} var call_${fileLength} = () => { Managers.Data.ReadFile("${src[fileLength]}", "${varName[fileLength]}", callback); }; call_0();`);
                break;
        }
        
        requestFunc(callback ?? function () { });
    }
    
    static ReadJSONFile (src, varName, callback)
    {
        if (src == null || varName == null) return ThrowError(0);
        
        var hasArrays = 0;
        
        if (Array.isArray(src)) hasArrays++;
        if (Array.isArray(varName)) hasArrays++;
        
        if (hasArrays == 1) return ThrowError(0);
        
        var requestFunc;
        
        switch (hasArrays)
        {
            case 0:
                requestFunc = Function("callback", `let request = new XMLHttpRequest(); request.onload = () => { if (request.status < 400) { ${varName} = JSON.parse(request.responseText); callback(); } }; request.onerror = () => { ThrowError(2); }; request.open("GET", "${src}.json"); request.overrideMimeType("application/json"); request.send();`);
                break;
            case 2:
                var arrayRequest = "";
                let fileLength = src.length - 1;
                
                for (let i = 0; i < fileLength; i++)
                {
                    arrayRequest += `var call_${i} = () => { Managers.Data.ReadJSONFile("${src[i]}", "${varName[i]}", call_${i + 1}); };`;
                }
                
                requestFunc = Function("callback", `${arrayRequest} var call_${fileLength} = () => { Managers.Data.ReadJSONFile("${src[fileLength]}", "${varName[fileLength]}", callback); }; call_0();`);
                break;
        }
        
        requestFunc(callback ?? function () { });
    }
}

Managers.Scene = class
{
    static #scenes = [];
    static #activeScene = null;
    static #loaded = false;
    static #unloaded = false;
    
    static get sceneLoaded ()
    {
        return this.#loaded;
    }
    
    static get sceneUnloaded ()
    {
        return this.#unloaded;
    }
    
    static Scene = class
    {
        constructor (name, gameObjects)
        {
            if (gameObjects != null && !Array.isArray(gameObjects)) return ThrowError(0);
            
            this.name = name ?? "scene";
            this.gameObjects = gameObjects ?? [];
        }
    }
    
    static Set (scenes)
    {
        if (scenes != null && !Array.isArray(scenes)) return ThrowError(0);
        
        this.#scenes = scenes ?? [new this.Scene()];
        this.Load(0);
    }
    
    static GetActiveScene ()
    {
        return this.#activeScene;
    }
    
    static Load (index)
    {
        this.#activeScene = this.#scenes[index] ?? new this.Scene();
    }
}
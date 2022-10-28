/**
 * The main static class of the engine
 * 
 * @public
 * @static
 * @class
 */
class BlankEngine
{
    // Static Classes
    
    static Inner = class
    {
        static packageData = null;
        static buildData = null;
        static compiledData = {
            libs : [],
            scripts : [],
            shaders : [],
            scenes : []
        };
        
        static #lib = class
        {
            #loaded = false;
            #name = null;
            #desc = "";
            #unloadedScripts = [];
            #scripts = [];
            #src = null;
            
            get isLoaded ()
            {
                return this.#loaded;
            }
            
            get name ()
            {
                return this.#name;
            }
            
            get description ()
            {
                return this.#desc;
            }
            
            get scripts ()
            {
                return this.#scripts;
            }
            
            script = class
            {
                #loaded = false;
                #src = null;
                #classes = [];
                
                get isLoaded ()
                {
                    return this.#loaded;
                }
                
                get src ()
                {
                    return this.#src;
                }
                 
                get classes ()
                {
                    return this.#classes;
                }
                
                constructor (src, classes)
                {
                    if (src == null) BlankEngine.ThrowError(0);
                    
                    this.#src = src;
                    this.#classes = classes ?? [];
                }
                
                async load ()
                {
                    if (this.#loaded) return;
                    
                    let script = document.createElement("script");
                    var newClasses = [];
                    
                    script.src = this.#src;
                    script.type = "text/javascript";
                    script.async = true;
                    
                    document.body.appendChild(script);
                    
                    await new Promise(resolve => script.addEventListener("load", resolve));
                    
                    for (let i = 0; i < this.#classes.length; i++)
                    {
                        if (this.#classes[i].name == null || this.#classes[i].args == null) continue;
                        
                        if (newClasses.length == 0) newClasses[0] = this.#classes[i];
                        else newClasses.push(this.#classes[i]);
                    }
                    
                    this.#classes = newClasses;
                    
                    this.#loaded = true;
                }
            }
            
            constructor (name, desc, scripts, src)
            {
                if (src == null) BlankEngine.ThrowError(0);
                
                this.#name =  name;
                this.#desc = desc;
                this.#unloadedScripts = scripts;
                this.#src = src;
            }
            
            async load ()
            {
                if (this.#loaded) return;
                
                for (let i = 0; i < this.#unloadedScripts.length; i++)
                {
                    if (this.#unloadedScripts[i] == null) continue;
                    
                    var script = null;
                    
                    if (this.#unloadedScripts[i].src != null) script = new this.script(`../js/libs/${this.#src}/${this.#unloadedScripts[i].src}.js`, this.#unloadedScripts[i].classes);
                    else script = new this.script(`../js/libs/${this.#src}/${this.#unloadedScripts[i]}.js`);
                    
                    if (this.#scripts.length == 0) this.#scripts[0] = script;
                    else this.#scripts.push(script);
                }
                
                for (let i = 0; i < this.#scripts.length; i++)
                {
                    await this.#scripts[i].load();
                }
                
                this.#loaded = true;
            }
        }
        
        static initiateProgram ()
        {
            document.body.style.height = "100vh";
            document.body.style.margin = "0";
            document.body.style.display = "flex";
            document.body.style.alignItems = "center";
            
            this.#loadData();
        }
        
        static async #loadData ()
        {
            let packageResponse = await fetch("../package.json");
            let buildResponse = await fetch("../data/build.json");
            
            this.packageData = await packageResponse.json();
            this.buildData = await buildResponse.json();
            
            if (this.buildData.libs.length == 0) this.buildData.libs[0] = "BlankEngine.Core";
            else this.buildData.libs.unshift("BlankEngine.Core");
            
            for (let i = 0; i < this.buildData.libs.length; i++)
            {
                if (this.buildData.libs[i] == null) continue;
                
                let libResponse = await fetch(`../js/libs/${this.buildData.libs[i]}/package.json`);
                let libData = await libResponse.json();
                let lib = new this.#lib(
                    libData.name,
                    libData.description,
                    libData.scripts,
                    this.buildData.libs[i]
                );
                
                if (this.compiledData.libs.length == 0) this.compiledData.libs[0] = lib;
                else this.compiledData.libs.push(lib);
            }
            
            for (let i = 0; i < this.buildData.scripts.length; i++)
            {
                if (this.buildData.scripts[i] == null) continue;
                
                var script = null;
                
                if (this.buildData.scripts[i].src != null) script = new this.#lib.script(`../js/${this.buildData.scripts[i].src}.js`, this.buildData.scripts[i].classes);
                else script = new this.#lib.script(`../js/${this.buildData.scripts[i]}.js`,);
                
                if (this.compiledData.scripts.length == 0) this.compiledData.scripts[0] = script;
                else this.compiledData.scripts.push(script);
            }
            
            for (let i = 0; i < this.buildData.shaders.length; i++)
            {
                let shaderResponse = await fetch(`../shaders/${this.buildData.shaders[i]}.shader`);
                let shader = await shaderResponse.text();
                
                if (this.compiledData.shaders.length == 0) this.compiledData.shaders[0] = shader;
                else this.compiledData.shaders.push(shader);
            }
            
            for (let i = 0; i < this.buildData.scenes.length; i++)
            {
                let sceneResponse = await fetch(`../data/scenes/${this.buildData.scenes[i]}.json`);
                let scene = await sceneResponse.json();
                
                let newScene = {
                    name : scene.name,
                    resources : scene.resources,
                    gameObjects : scene.gameObjects,
                    buildIndex : i,
                    path : `data/scenes/${this.buildData.scenes[i]}.json`
                };
                
                if (this.compiledData.scenes.length == 0) this.compiledData.scenes[0] = newScene;
                else this.compiledData.scenes.push(newScene);
            }
            
            this.#init();
        }
        
        static async #init ()
        {
            for (let i = 0; i < this.compiledData.libs.length; i++)
            {
                await this.compiledData.libs[i].load();
            }
            
            for (let i = 0; i < this.compiledData.scripts.length; i++)
            {
                await this.compiledData.scripts[i].load();
            }
            
            Application.targetFrameRate = this.buildData.targetFrameRate;
            
            Window.data.title = this.packageData.window.title;
            Window.data.width = this.packageData.window.width ?? 250;
            Window.data.height = this.packageData.window.height ?? 250;
            Window.data.marginX = this.packageData.window.marginX ?? 0;
            Window.data.marginY = this.packageData.window.marginY ?? 0;
            Window.data.resizable = this.packageData.window.resizable ?? true;
            Window.data.fillWindow = this.packageData.window.fillWindow ?? true;
            Window.data.icon = this.packageData.window.icon ?? "";
            
            Window.init();
            
            await Shader.Set(this.compiledData.shaders);
            
            await Resources.Set(this.buildData.resources);
            
            await SceneManager.Set(this.compiledData.scenes);
            
            PlayerLoop.init();
        }
    }
    
    
    // Static Methods
    
    static ThrowError (errorCode, errorDesc)
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
                errorText = "Shader is invalid";
                break;
            case 3:
                errorText = "Object cannot be found";
                break;
            case 4:
                errorText = "Class used as component is not derived from class 'Component'";
                break;
        }
        
        if (errorDesc != null) errorText += `\n\nDescription: ${errorDesc}`;
        
        errorText += `\n\nError Code: ${errorCode}`;
        
        alert(errorText);
        throw new Error(errorText);
    }
}
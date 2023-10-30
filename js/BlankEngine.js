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
        static #terminateStart = false;
        
        static buildData = null;
        static compiledData = {
            libs : [],
            scripts : [],
            shaders : [],
            scenes : []
        };
        
        static #Lib = class
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
            
            #Script = class
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
                    if (src == null) BlankEngine.Err(0);
                    
                    this.#src = src;
                    this.#classes = classes ?? [];
                }
                
                async Load ()
                {
                    if (this.#loaded) return;
                    
                    const script = document.createElement("script");
                    
                    let newClasses = [];
                    
                    script.src = this.#src;
                    script.type = "text/javascript";
                    script.async = true;
                    
                    document.body.append(script);
                    
                    await new Promise(resolve => script.addEventListener("load", resolve));
                    
                    for (let i = 0; i < this.#classes.length; i++)
                    {
                        if (this.#classes[i].name == null) continue;
                        
                        if (this.#classes[i].args == null) this.#classes[i].args = [];
                        
                        if (newClasses.length == 0) newClasses[0] = this.#classes[i];
                        else newClasses.push(this.#classes[i]);
                    }
                    
                    this.#classes = newClasses;
                    
                    this.#loaded = true;
                }
            }
            
            constructor (name, desc, scripts, src)
            {
                this.#name =  name;
                this.#desc = desc;
                this.#unloadedScripts = scripts;
                this.#src = src;
            }
            
            async Load ()
            {
                if (this.#loaded) return;
                
                for (let i = 0; i < this.#unloadedScripts.length; i++)
                {
                    if (this.#unloadedScripts[i] == null) continue;
                    
                    let script = null;
                    
                    if (this.#unloadedScripts[i].src != null) script = new this.#Script(`js/libs/${this.#src}/${this.#unloadedScripts[i].src}.js`, this.#unloadedScripts[i].classes);
                    else script = new this.#Script(`js/libs/${this.#src}/${this.#unloadedScripts[i]}.js`);
                    
                    if (this.#scripts.length == 0) this.#scripts[0] = script;
                    else this.#scripts.push(script);
                }
                
                for (let i = 0; i < this.#scripts.length; i++) await this.#scripts[i].Load();
                
                this.#loaded = true;
            }
        }
        
        static #Script = class
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
                this.#src = src;
                this.#classes = classes ?? [];
            }
            
            async Load ()
            {
                if (this.#loaded) return;
                
                const script = document.createElement("script");
                
                let newClasses = [];
                
                script.src = this.#src;
                script.type = "text/javascript";
                script.async = true;
                
                document.body.append(script);
                
                await new Promise(resolve => script.addEventListener("load", resolve));
                
                for (let i = 0; i < this.#classes.length; i++)
                {
                    if (this.#classes[i].name == null) continue;
                    
                    if (this.#classes[i].args == null) this.#classes[i].args = [];
                    
                    if (newClasses.length == 0) newClasses[0] = this.#classes[i];
                    else newClasses.push(this.#classes[i]);
                }
                
                this.#classes = newClasses;
                
                this.#loaded = true;
            }
        }
        
        static InitiateProgram ()
        {
            document.body.style.height = "100vh";
            document.body.style.margin = "0";
            document.body.style.display = "flex";
            document.body.style.alignItems = "center";
            document.body.style.userSelect = "none";
            document.body.style.color = "white";
            
            let caughtErr = false;
            let errLogs = null;
            
            window.addEventListener("error", event => {
                if (caughtErr)
                {
                    errLogs.append(`\n\n${event.stack}`);
                    
                    return;
                }
                
                caughtErr = true;
                
                this.#terminateStart = true;
                
                if (Application.hasLoaded) Application.Unload();
                
                document.body.style.margin = "12px";
                document.body.style.display = "block";
                
                const errWrap = document.createElement("div");
                
                errWrap.style.whiteSpace = "pre-wrap";
                
                errLogs = document.createElement("span");
                
                errLogs.append(event.stack);
                
                const tip = document.createElement("span");
                
                tip.append("\n\n\n----------\n\nPress F5 to refresh");
                
                errWrap.append(errLogs, tip)
                document.body.append(errWrap);
            });
            
            this.#LoadData();
        }
        
        static async #LoadData ()
        {
            const packageResponse = await fetch("package.json");
            const packageData = await packageResponse.json();
            
            Application.Init(packageData.name);
            Window.Init(packageData.window);
            
            const buildResponse = await fetch("data/build.json");
            
            this.buildData = await buildResponse.json();
            
            if (this.buildData.libs.length == 0) this.buildData.libs[0] = "BlankEngine.Core";
            else this.buildData.libs.unshift("BlankEngine.Core");
            
            for (let i = 0; i < this.buildData.libs.length; i++)
            {
                if (this.buildData.libs[i] == null) continue;
                
                const libResponse = await fetch(`js/libs/${this.buildData.libs[i]}/package.json`);
                const libData = await libResponse.json();
                const lib = new this.#Lib(
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
                
                let script = null;
                
                if (this.buildData.scripts[i].src != null) script = new this.#Script(`js/${this.buildData.scripts[i].src}.js`, this.buildData.scripts[i].classes);
                else script = new this.#Script(`js/${this.buildData.scripts[i]}.js`,);
                
                if (this.compiledData.scripts.length == 0) this.compiledData.scripts[0] = script;
                else this.compiledData.scripts.push(script);
            }
            
            for (let i = 0; i < this.buildData.shaders.length; i++)
            {
                const shaderResponse = await fetch(`shaders/${this.buildData.shaders[i]}.glsl`);
                const shader = await shaderResponse.text();
                
                if (this.compiledData.shaders.length == 0) this.compiledData.shaders[0] = shader;
                else this.compiledData.shaders.push(shader);
            }
            
            for (let i = 0; i < this.buildData.scenes.length; i++)
            {
                const sceneResponse = await fetch(`data/scenes/${this.buildData.scenes[i]}.json`);
                const scene = await sceneResponse.json();
                const newScene = {
                    name : scene.name,
                    resources : scene.resources,
                    gameObjects : scene.gameObjects,
                    buildIndex : i,
                    path : `data/scenes/${this.buildData.scenes[i]}.json`
                };
                
                if (this.compiledData.scenes.length == 0) this.compiledData.scenes[0] = newScene;
                else this.compiledData.scenes.push(newScene);
            }
            
            this.#Init();
        }
        
        static async #Init ()
        {
            for (let i = 0; i < this.compiledData.libs.length; i++) await this.compiledData.libs[i].Load();
            
            for (let i = 0; i < this.compiledData.scripts.length; i++) await this.compiledData.scripts[i].Load();
            
            if (this.#terminateStart) return;
            
            Application.targetFrameRate = this.buildData.targetFrameRate;
            
            Time.maximumDeltaTime = this.buildData.Time.maximumDeltaTime;
            Time.timeScale = this.buildData.Time.timeScale;
            Time.fixedDeltaTime = this.buildData.Time.fixedDeltaTime;
            
            Shader.Set(this.compiledData.shaders);
            Resources.Set(this.buildData.resources);
            SceneManager.Set(this.compiledData.scenes);
            
            Input.Init();
            PlayerLoop.Init();
        }
    }
}
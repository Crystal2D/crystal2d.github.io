/**
 * The main static class of the engine
 * 
 * @public
 * @static
 * @class
 */
class CrystalEngine
{
    // Static Classes
    
    static Script = class
    {
        #loaded = false;
        
        #src = null;
        
        get isLoaded ()
        {
            return this.#loaded;
        }
        
        get src ()
        {
            return this.#src;
        }
            
        constructor (src)
        {
            this.#src = src;
        }
        
        OnLoad () { }
        
        async Load ()
        {
            if (this.#loaded) return;
            
            const script = document.createElement("script");
            
            script.src = this.#src;
            script.type = "text/javascript";
            script.async = true;
            
            document.body.append(script);
            
            await new Promise(resolve => script.addEventListener("load", resolve));
            
            this.OnLoad();
            
            this.#loaded = true;
        }
    }

    static IsBehavior (className)
    {
        let classCheck = eval(className).toString().replace(/\s+/g, " ");

        const searchString = `${className} extends `;
        const checkIndex = classCheck.indexOf(searchString);

        if (checkIndex >= 0)
        {
            classCheck = classCheck.substring(checkIndex + searchString.length);
            classCheck = classCheck.substring(0, classCheck.indexOf("{")).trim();
            
            if (classCheck === "Behavior") return true;

            return this.IsBehavior(classCheck);
        }

        return false;
    }
    
    static Inner = class
    {
        static #inited = false;
        static #terminateStart = false;
        static #resources = [];
        static #compiledData = {
            libs : [],
            scripts : [],
            shaders : []
        };
        
        static #buildData = null;
        
        static #Lib = class
        {
            #loaded = false;
            #name = "";
            #desc = "";
            #unloadedScripts = [];
            #scripts = [];
            #classes = [];
            
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
            
            get classes ()
            {
                return this.#classes;
            }
            
            constructor (name, desc, scripts, classes, src)
            {
                this.#name =  name;
                this.#desc = desc ?? "";
                this.#unloadedScripts = scripts;
                this.#classes = classes ?? [];
                this.#src = src;
            }
            
            async Load ()
            {
                if (this.#loaded) return;
                
                for (let i = 0; i < this.#unloadedScripts.length; i++)
                {
                    const script = new CrystalEngine.Script(`js/libs/${this.#src}/${this.#unloadedScripts[i]}.js`);
                    
                    await script.Load();
                    
                    this.#scripts.push(script);
                }
                
                let newClasses = [];
                
                for (let i = 0; i < this.#classes.length; i++)
                {
                    if (this.#classes[i].name == null) continue;
                    else if (this.#classes[i].args == null) this.#classes[i].args = [];

                    if (this.#classes[i].type === 0 && CrystalEngine.IsBehavior(this.#classes[i].name)) this.#classes[i].args.push({
                        type: "boolean",
                        name: "enabled"
                    });
                    
                    newClasses.push(this.#classes[i]);
                }
                
                this.#classes = newClasses;
                
                this.#loaded = true;
            }
        }
        
        static #Script = class extends CrystalEngine.Script
        {
            #classes = [];
            
            get classes ()
            {
                return this.#classes;
            }
            
            constructor (src, classes)
            {
                super(src);
                
                this.#classes = classes ?? [];
            }
            
            OnLoad ()
            {
                let newClasses = [];
                
                for (let i = 0; i < this.#classes.length; i++)
                {
                    if (this.#classes[i].name == null) continue;
                    else if (this.#classes[i].args == null) this.#classes[i].args = [];

                    if (this.#classes[i].type === 0 && CrystalEngine.IsBehavior(this.#classes[i].name)) this.#classes[i].args.push({
                        type: "boolean",
                        name: "enabled"
                    });
                    
                    newClasses.push(this.#classes[i]);
                }
                
                this.#classes = newClasses;
            }
        }
        
        static #IsClassOfType (item, name, type)
        {
            return item.name === name && item.type === type;
        }
        
        static GetClassOfType (name, type)
        {
            const libs = this.#compiledData.libs;
            const scripts = this.#compiledData.scripts;
            
            let output = null;
            
            for (let i = 0; i < libs.length; i++)
            {
                const currentClass = libs[i].classes.find(element => this.#IsClassOfType(element, name, type));
                
                if (currentClass == null) continue;
                
                output = currentClass;
                
                break;
            }
            
            for (let i = 0; i < scripts.length; i++)
            {
                if (output != null) break;
                
                const currentClass = scripts[i].classes.find(element => this.#IsClassOfType(element, name, type));
                
                if (currentClass == null) continue;
                
                output = currentClass;
                
                break;
            }
            
            return output;
        }
        
        static InitiateProgram ()
        {
            if (this.#inited) return;
            
            document.body.style.height = "100vh";
            document.body.style.margin = "0";
            document.body.style.display = "flex";
            document.body.style.userSelect = "none";
            document.body.style.color = "white";
            document.body.style.fontFamily = "monospace";
            document.body.style.overflow = "clip";
            
            let errLogs = null;

            const onError = error => {
                if (this.#terminateStart)
                {
                    errLogs.append(`\n\n${error.stack}`);
                    
                    return;
                }
                
                this.#terminateStart = true;
                
                if (Application.isLoaded)
                {
                    PlayerLoop.OnError();

                    Application.Unload();
                }
                else Application.htmlCanvas.style.display = "none";
                
                document.body.style.height = "";
                document.body.style.overflow = "";

                Window.resizable = true;
                
                const errWrap = document.createElement("div");
                errWrap.style.whiteSpace = "pre-wrap";
                errWrap.style.marginTop = cordova == null ? "12px" : "36px";
                errWrap.style.marginLeft = "12px";

                errLogs = document.createElement("span");
                errLogs.style.userSelect = "text";
                errLogs.append(error.stack);
                
                const tip = document.createElement("span");
                tip.append(`\n\n\n----------\n\n${Application.isMobilePlatform ? "Please report this problem" : "Press F5 to refresh"}`);
                
                errWrap.append(errLogs, tip)
                document.body.append(errWrap);
            };
            
            window.addEventListener("error", event => onError(event.error));
            window.addEventListener("unhandledrejection", event => onError(event.reason));

            if (Application.isInCordova) window.addEventListener("cordovacallbackerror", event => onError(event.error));
            
            this.#inited = true;
            
            this.#LoadData();
        }
        
        static async #LoadData ()
        {
            const manifestResponse = await fetch("manifest.json");
            const manifestData = await manifestResponse.json();
            
            Application.Init(manifestData.name);
            Window.Init(manifestData.window);
            
            const buildResponse = await fetch("data/build.json");
            this.#buildData = await buildResponse.json();
            
            this.#buildData.libs.unshift("Crystal.Core");
            this.#buildData.shaders.unshift("vertex", "fragment");
            
            for (let i = 0; i < this.#buildData.libs.length; i++)
            {
                const libResponse = await fetch(`js/libs/${this.#buildData.libs[i]}/manifest.json`);
                const libData = await libResponse.json();
                
                this.#compiledData.libs.push(new this.#Lib(
                    libData.name,
                    libData.description,
                    libData.scripts,
                    libData.classes,
                    this.#buildData.libs[i]
                ));
            }
            
            for (let i = 0; i < this.#buildData.scripts.length; i++)
            {
                const scriptData = this.#buildData.scripts[i];
                
                let script = null;
                
                if (typeof scriptData === "string") script = new this.#Script(`js/${scriptData}.js`);
                else script = new this.#Script(`js/${scriptData.src}.js`, scriptData.classes);
                
                this.#compiledData.scripts.push(script);
            }
            
            for (let i = 0; i < this.#buildData.shaders.length; i++)
            {
                const shaderResponse = await fetch(`shaders/${this.#buildData.shaders[i]}.glsl`);
                
                this.#compiledData.shaders.push(await shaderResponse.text());
            }

            for (let i = 0; i < this.#buildData.resources.length; i++)
            {
                const resResponse = await fetch(`data/resources/${this.#buildData.resources[i]}.json`);
                const resData = await resResponse.json();

                this.#resources.push(...resData);
            }
            
            this.#Init();
        }
        
        static async #Init ()
        {
            for (let i = 0; i < this.#compiledData.libs.length; i++) await this.#compiledData.libs[i].Load();
            
            for (let i = 0; i < this.#compiledData.scripts.length; i++) await this.#compiledData.scripts[i].Load();
            
            if (this.#terminateStart) return;
            
            Application.targetFrameRate = this.#buildData.targetFrameRate;
            Application.vSyncCount = this.#buildData.vSyncCount;
            Application.runInBackground = this.#buildData.runInBackground;
            
            Time.maximumDeltaTime = this.#buildData.time.maximumDeltaTime;
            Time.timeScale = this.#buildData.time.timeScale;
            Time.fixedDeltaTime = this.#buildData.time.fixedDeltaTime;

            QuadTree.maxDepth = this.#buildData.partioningMaxDepth;
            
            Debug.Set(this.#buildData.debugMode);
            Shader.Set(this.#compiledData.shaders);

            if (this.#terminateStart) return;

            Resources.Set(this.#resources);

            if (this.#terminateStart) return;

            SortingLayer.Add(this.#buildData.layers);
            SceneManager.Set(this.#buildData.scenes);

            if (this.#terminateStart) return;

            Input.Init();
            PlayerLoop.Init();
        }
    }
}
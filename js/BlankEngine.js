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
    
    static Core = class
    {
        static packageData = null;
        static buildData = null;
        static compiledData = { shaders : [], scripts : [], scenes : [] };
        
        static #script = class
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
                this.#src;
            }
            
            get classes ()
            {
                return this.#classes;
            }
            
            constructor (src, classes)
            {
                this.#src = src;
                this.#classes = classes;
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
            
            for (let i = 0; i < this.buildData.shaders.length; i++)
            {
                let shaderResponse = await fetch(`../shaders/${this.buildData.shaders[i]}.shader`);
                let shader = await shaderResponse.text();
                
                if (this.compiledData.shaders.length == 0) this.compiledData.shaders[0] = shader;
                else this.compiledData.shaders.push(shader);
            }
            
            for (let i = 0; i < this.buildData.scripts.length; i++)
            {
                if (this.buildData.scripts[i] == null || !this.buildData.scripts[i].src) continue;
                
                let script = new this.#script(`../js/${this.buildData.scripts[i].src}.js`, this.buildData.scripts[i].classes);
                
                if (this.compiledData.scripts.length == 0) this.compiledData.scripts[0] = script;
                else this.compiledData.scripts.push(script);
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
            
            Application.targetFrameRate = this.buildData.targetFrameRate;
            
            this.#init();
        }
        
        static async #init ()
        {
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
            
            for (let i = 0; i < this.compiledData.scripts.length; i++)
            {
                await this.compiledData.scripts[i].load();
            }
            
            await Resources.Set(this.buildData.resources);
            
            await SceneManager.Set(this.compiledData.scenes);
            
            BlankEngine.PlayerLoop.init();
        }
    }
    
    static PlayerLoop = class
    {
        static #loadedApp = false;
        
        static #requestUpdate ()
        {
            requestAnimationFrame(this.#update.bind(this));
        }
        
        static async #update ()
        {
            if (!this.#loadedApp && !Application.isLoaded)
            {
                Application.Load();
                
                this.#loadedApp = true;
            }
            
            if (!document.hasFocus() || !Application.isLoaded || !SceneManager.GetActiveScene().isLoaded) return this.#requestUpdate();
            
            await this.Start();
            
            await this.Update();
            
            this.Render();
            
            this.#requestUpdate();
        }
        
        static init ()
        {
            this.#requestUpdate();
        }
        
        static async Start ()
        {
            for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
            {
                SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Start", null, { clearAfter : true });
            }
        }
        
        static async Update ()
        {
            var accumulator = (performance.now() / 1000) - Time.unscaledTime;
            
            while (accumulator >= 1 / Application.targetFrameRate)
            {
                Time.unscaledDeltaTime = (performance.now() / 1000) - Time.unscaledTime;
                Time.unscaledTime += Time.unscaledDeltaTime;
                
                var deltaT = Time.unscaledDeltaTime;
                
                if (deltaT > Time.maximumDeltaTime) deltaT = Time.maximumDeltaTime;
                
                Time.deltaTime = deltaT * Time.timeScale;
                Time.time += Time.deltaTime;
                
                for (let i = 0; i < SceneManager.GetActiveScene().gameObjects.length; i++)
                {
                    SceneManager.GetActiveScene().gameObjects[i].BroadcastMessage("Update");
                }
                
                Time.frameCount++;
                
                accumulator -= 1 / Application.targetFrameRate;
            }
        }
        
        static Render ()
        {
            Application.gl.viewport(0, 0, Application.htmlCanvas.width, Application.htmlCanvas.height);
            Application.gl.clear(Application.gl.COLOR_BUFFER_BIT | Application.gl.DEPTH_BUFFER_BIT);
            Application.gl.enable(Application.gl.BLEND);
            Application.gl.blendFunc(Application.gl.SRC_ALPHA, Application.gl.ONE_MINUS_SRC_ALPHA);
            
            for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
            {
                let cameras = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("Camera");
                
                for (let iB = 0; iB < cameras.length; iB++)
                {
                    cameras[iB].Render();
                }
            }
            
            Application.gl.flush();
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



// ---------- Static Classes

class Resources
{
    static #unloadedRes = [];
    static #resources = [];
    
    static get res () { return this.#resources }
    static set res (r) { this.#resources = r; }
    
    static Find (path)
    {
        if (path == null) throw BlankEngine.ThrowError(0);
        
        var newPath = [""];
        var resPath = this.#resources;
        
        for (let i = 0; i < path.length; i++)
        {
            if (path[i] === "/")
            {
                newPath.push("");
                
                continue;
            }
            
            newPath[newPath.length - 1] += path[i];
        }
        
        for (let iA = 0; iA < newPath.length; iA++)
        {
            for (let iB = 0; iB < resPath.length; iB++)
            {
                if (resPath[iB].name != newPath[iA]) continue;
                
                if (iA == newPath.length - 1)
                {
                    if (resPath[iB].type === "subpath") throw BlankEngine.ThrowError(3);
                    
                    return resPath[iB];
                }
                
                resPath = resPath[iB].content;
                
                break;
            }
        }
        
        throw BlankEngine.ThrowError(3);
    }
    
    static async #toObject (data)
    {
        if (data.name == null || data.args == null) throw BlankEngine.ThrowError(0);
        
        let args = data.args;
        var object = null;
        
        switch (data.type)
        {
            case "Texture":
                if (args.src == null) throw BlankEngine.ThrowError(0);
                
                object = await new Texture(args.src);
                
                
                if (args.wrapMode != null) object.wrapMode = args.wrapMode;
                if (args.filterMode != null) object.filterMode = args.filterMode;
                break;
            case "Material":
                var vertexShader = null;
                var fragmentShader = null;
                
                if (args.vertexShader != null) vertexShader = await Shader.Find(args.vertexShader, "VERTEX");
                if (args.fragmentShader != null) fragmentShader = await Shader.Find(args.fragmentShader, "FRAGMENT");
                
                object = await new Material(vertexShader, fragmentShader);
                break;
            default:
                throw BlankEngine.ThrowError(0);
        }
        
        object.name = data.name;
        
        return object;
    }
    
    static async #setRes (path, data)
    {
        if (path == null || data == null) throw BlankEngine.ThrowError(0);
        
        // ROOT VARIABLES
        var resIndexes = [];
        var resPath = [this.#resources];
        var newPath = { final : [], sub : [] };
        
        // DECONSTRUCT
        
        // FOREACH PATH LEVEL
        for (let iA = 0; iA < path.length - 1; iA++)
        {
            // IF RESPATH IS EMPTY
            // OR TARGET PATH IS ROOT
            // THEN BREAK
            if (resPath[resPath.length - 1].length == 0 || path.length == 1) break;
            
            // IF CURRENT PATH IS IN ROOT
            if (iA == 0)
            {
                // FOREACH CONTENT IN CURRENT PATH
                for (let iB = 0; iB < resPath[0].length; iB++)
                {
                    // IF CONTENT IS NOT FOLDER OR
                    // CONTENT NAME IS NOT EQUAL TO PATH
                    // THEN CONTINUE
                    if (resPath[0][iB].type != "subpath" || resPath[0][iB].name != path[0]) continue;
                    
                    // ADD CURRENT PATH INDEX TO RESINDEXES
                    resIndexes[0] = iB;
                    
                    // ADD CURRENT PATH TO RESPATH
                    resPath.push(resPath[0][iB]);
                }
                
                continue;
            }
            
            // IF PATH IS IN SUB
            
            // FOREACH CONTENT IN CURRENT PATH
            for (let iB = 0; iB < resPath[iA].content.length; iB++)
            {
                // IF CONTENT IS NOT FOLDER OR
                // CONTENT NAME IS NOT EQUAL TO PATH
                // THEN CONTINUE
                if (resPath[iA].content[iB].type != "subpath" || resPath[iA].content[iB].name != path[iA]) continue;
                
                // ADD CURRENT PATH TO RESINDEXES
                resIndexes.push(iB);
                
                // ADD CURRENT PATH TO RESPATH
                resPath.push(resPath[iA].content[iB]);
            }
        }
        
        // ADD DATA TO RESPATH
        if (data.type === "subpath") resPath.push({ name : data.name, type : "subpath", content : [] });
        else resPath.push(data);
        
        // RECONSTRUCT
        
        // FOREACH DECONSTRUCTED PATH
        for (let iA = resPath.length - 1; iA > 0; iA--)
        {
            // ADD CURRENT PATH TO NEWPATH
            if (newPath.sub.length == 0) newPath.sub[0] = resPath[iA];
            else newPath.sub.push({ name : resPath[iA].name, type : "subpath", content : [] });
            
            // IF IN DEEPEST THEN CONTINUE
            if (iA == resPath.length - 1) continue;
            
            var addedNewCont = false;
            
            if (resPath[iA].content.length == 0) newPath.sub[newPath.sub.length - 1].content[0] = newPath.sub[newPath.sub.length - 2];
            
            // FOREACH CONTENT IN PATH
            for (let iB = 0; iB < resPath[iA].content.length; iB++)
            {
                // IF HASN'T ADDED NEW CONTENT
                if (!addedNewCont)
                {
                    // IF CURRENT CONTENT HAS MODIFIED OR
                    // RESINDEXES IS EMPTY
                    if (iB == resIndexes[iA] || resIndexes[iA] == null)
                    {
                        // ADD MODIFIED CONTENT TO NEWPATH
                        if (newPath.sub[newPath.sub.length - 1].content.length == 0) newPath.sub[newPath.sub.length - 1].content[0] = newPath.sub[newPath.sub.length - 2];
                        else newPath.sub[newPath.sub.length - 1].content.push(newPath.sub[newPath.sub.length - 2]);
                        
                        // SET IT HAS ADDED NEW CONTENT
                        addedNewCont = true;
                        
                        // IF CURRENT CONTENT HAS MODIFIED THEN CONTINUE
                        if (iB == resIndexes[iA]) continue;
                    }
                }
                
                // ADD CONTENT TO NEWPATH
                if (newPath.sub[newPath.sub.length - 1].content.length == 0) newPath.sub[newPath.sub.length - 1].content[0] = resPath[iA].content[iB];
                else newPath.sub[newPath.sub.length - 1].content.push(resPath[iA].content[iB]);
            }
        }
        
        // ROOT CONSTRUCTION
        if (resPath[0].length == 0) newPath.final[0] = newPath.sub[newPath.sub.length - 1];
        
        var addedNewCont = false;
        
        // FOREACH CONTENT IN PATH
        for (let i = 0; i < resPath[0].length; i++)
        {
            // IF HASN'T ADDED NEW CONTENT
            if (!addedNewCont)
            {
                // IF CURRENT CONTENT HAS MODIFIED OR
                // RESINDEXES IS EMPTY
                if (i == resIndexes[0] || resIndexes.length == 0)
                {
                    // ADD MODIFIED CONTENT TO NEWPATH
                    if (newPath.final.length == 0) newPath.final[0] = newPath.sub[newPath.sub.length - 1];
                    else newPath.final.push(newPath.sub[newPath.sub.length - 1]);
                    
                    // SET IT HAS ADDED NEW CONTENT
                    addedNewCont = true;
                    
                    // IF CURRENT CONTENT HAS MODIFIED THEN CONTINUE
                    if (i == resIndexes[0]) continue;
                }
            }
            
            // ADD CONTENT TO NEW PATH
            if (newPath.final.length == 0) newPath.final[0] = resPath[0][i];
            else newPath.final.push(resPath[0][i]);
        }
        
        // SET RESOURCES TO NEW MODIFIED RESOURCES
        this.#resources = await newPath.final;
    }
    
    static async Set (resources)
    {
        if (resources == null || !Array.isArray(resources)) throw BlankEngine.ThrowError(0);
        
        await this.UnloadAll();
        
        this.#unloadedRes = await resources;
    }
    
    static async Load (path)
    {
        if (path == null) throw BlankEngine.ThrowError(0);
        
        var newPath = [""];
        var uRPath = this.#unloadedRes;
        var inPath = [];
        
        for (let i = 0; i < path.length; i++)
        {
            if (path[i] === "/")
            {
                newPath.push("");
                
                continue;
            }
            
            newPath[newPath.length - 1] += path[i];
        }
        
        // FOREACH WORD
        for (let iA = 0; iA < newPath.length; iA++)
        {
            var resPath = this.#resources;
            
            // ADD CURRENT PATH TO INPATH
            if (inPath.length == 0) inPath[0] = newPath[iA];
            else inPath.push(newPath[iA]);
            
            // REFRESH RESPATH
            for (let iB = 1; iB <= iA; iB++)
            {
                for (let iC = 0; iC < resPath.length; iC++)
                {
                    if (resPath[iC].name != newPath[iA - 1] || resPath[iC].type != "subpath") continue;
                    
                    resPath = resPath[iC].content;
                }
            }
            
            // FOREACH CONTENT IN CURRENT PATH
            for (let iB = 0; iB < uRPath.length; iB++)
            {
                // IF CONTENT NAME IS NOT EQUAL TO URPATH THEN CONTINUE
                if (newPath[iA] != uRPath[iB].name) continue;
                
                var existInRes = 0;
                
                // CHECK IF CONTENT EXIST IN RESPATH
                // DOESN'T EXIST : 0
                // EXIST AS FOLDER : 1
                // EXIST AS OBJECT : 2
                // EXIST AS BOTH : 3
                for (let iC = 0; iC < resPath.length; iC++)
                {
                    if (newPath[iA] != resPath[iC].name) continue;
                    
                    if (existInRes != 0) existInRes = 3;
                    else if (resPath[iC].type === "subpath") existInRes = 1;
                    else existInRes = 2;
                }
                
                // IF LOADING OBJECT
                if (iA == newPath.length - 1)
                {
                    // IF ALREADY EXIST THEN RETURN
                    if (existInRes == 2 || existInRes == 3) return;
                    
                    // LOAD CONTENT
                    await this.#setRes(inPath, await this.#toObject(uRPath[iB]));
                    
                    return;
                }
                
                //IF LOADING FOLDER
                
                //IF ALREADY EXIST THEN BREAK
                if (existInRes == 1 || existInRes == 3)
                {
                    uRPath = uRPath[iB].content;
                    
                    break;
                }
                
                // LOAD CONTENT
                let loaded = await this.#setRes(inPath, uRPath[iB]);
                
                uRPath = uRPath[iB].content;
                
                break;
            }
        }
        
        throw BlankEngine.ThrowError(3);
    }
    
    static async Unload (path)
    {
        if (path == null) throw BlankEngine.ThrowError(0);
        
        var newTargetPath = [""];
        var resIndexes = [];
        var resPath = [this.#resources];
        var newPath = { final : [], sub : [] };
        
        for (let i = 0; i < path.length; i++)
        {
            if (path[i] === "/")
            {
                newTargetPath.push("");
                
                continue;
            }
            
            newTargetPath[newTargetPath.length - 1] += path[i];
        }
        
        // DECONSTRUCT
        
        // FOREACH WORD
        for (let iA = 0; iA < newTargetPath.length; iA++)
        {
            if (iA == 0) // IF CURRENT PATH IS IN ROOT
            {
                // IF RESPATH IS EMPTY THEN RETURN NULL
                if (resPath[0].length == 0) return;
                
                // FOREACH CONTENT IN CURRENT PATH
                for (let iB = 0; iB < resPath[0].length; iB++)
                {
                    // IF CURRENT PATH IS TARGET
                    if (iA == newTargetPath.length - 1)
                    {
                        // IF LAST CONTENT
                        if (iB == resPath[0].length - 1)
                        {
                            // IF CONTENT IS NOT OBJECT OR
                            // CONTENT NAME IS NOT EQUAL TO PATH
                            // THEN RETURN NULL
                            if (resPath[0][iB].type == "subpath" || resPath[0][iB].name != newTargetPath[0]) return;
                        }
                        
                        // IF CONTENT IS NOT OBJECT OR
                        // CONTENT NAME IS NOT EQUAL TO PATH
                        // THEN CONTINUE
                        if (resPath[0][iB].type == "subpath" || resPath[0][iB].name != newTargetPath[0]) continue;
                    }
                    else // IF CURRENT PATH IS NOT TARGET
                    {
                        // IF LAST CONTENT
                        if (iB == resPath[0].length - 1)
                        {
                            // IF CONTENT IS NOT FOLDER OR
                            // CONTENT NAME IS NOT EQUAL TO PATH
                            // THEN RETURN NULL
                            if (resPath[0][iB].type != "subpath" || resPath[0][iB].name != newTargetPath[0]) return;
                        }
                        
                        // IF CONTENT IS NOT FOLDER OR
                        // CONTENT NAME IS NOT EQUAL TO PATH
                        // THEN CONTINUE
                        if (resPath[0][iB].type != "subpath" || resPath[0][iB].name != newTargetPath[0]) continue;
                    }
                    
                    // ADD CURRENT PATH INDEX TO RESINDEXES
                    resIndexes[0] = iB;
                    
                    // IF CURRENT PATH IS NOT TARGET THEN ADD CURRENT PATH TO RESPATH
                    if (iA != newTargetPath.length - 1) resPath.push(resPath[0][iB]);
                }
                
                continue;
            }
            
            // IF PATH IS IN SUB
            
            // IF RESPATH IS EMPTY THEN RETURN NULL
            if (resPath[resPath.length - 1].content.length == 0) return;
            
            // FOREACH CONTENT IN CURRENT PATH
            for (let iB = 0; iB < resPath[iA].content.length; iB++)
            {
                // IF CURRENT PATH IS TARGET
                if (iA == newTargetPath.length - 1)
                {
                    // IF LAST CONTENT
                    if (iB == resPath[iA].content.length - 1)
                    {
                        // IF CONTENT IS NOT OBJECT OR
                        // CONTENT NAME IS NOT EQUAL TO PATH
                        // THEN RETURN NULL
                        if (resPath[iA].content[iB].type == "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) return;
                    }
                    
                    // IF CONTENT IS NOT OBJECT OR
                    // CONTENT NAME IS NOT EQUAL TO PATH
                    // THEN CONTINUE
                    if (resPath[iA].content[iB].type == "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) continue;
                }
                else // IF CURRENT PATH IS NOT TARGET
                {
                    // IF LAST CONTENT
                    if (iB == resPath[iA].content.length - 1)
                    {
                        // IF CONTENT IS NOT FOLDER OR
                        // CONTENT NAME IS NOT EQUAL TO PATH
                        // THEN RETURN NULL
                        if (resPath[iA].content[iB].type != "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) return;
                    }
                    
                    // IF CONTENT IS NOT FOLDER OR
                    // CONTENT NAME IS NOT EQUAL TO PATH
                    // THEN CONTINUE
                    if (resPath[iA].content[iB].type != "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) continue;
                }
                
                // ADD CURRENT PATH TO RESINDEXES
                resIndexes.push(iB);
                
                // IF CURRENT PATH IS NOT TARGET THEN ADD CURRENT PATH TO RESPATH
                if (iA != newPath.length - 1) resPath.push(resPath[iA].content[iB]);
            }
        }
        
        // RECONSTRUCT
        
        // FOREACH DECONSTRUCTED LEVEL
        for (let iA = resPath.length - 2; iA > 0; iA--)
        {
            // ADD CURRENT PATH TO NEWPATH
            if (newPath.sub.length == 0) newPath.sub[0] = { name : resPath[iA].name, type : "subpath", content : [] };
            else newPath.sub.push({ name : resPath[iA].name, type : "subpath", content : [] });
            
            ////////////////////////////////////////
            
            // FOREACH CONTENT IN PATH
            for (let iB = 0; iB < resPath[iA].content.length; iB++)
            {
                // IF ON DEEPEST FOLDER AND
                // CURRENT CONTENT HAS MODIFIED
                // THEN CONTINUE
                if (iA == resPath.length - 2 && iB == resIndexes[iA]) continue;
                else if (iB == resIndexes[iA]) // IF NOT ON DEEPEST FOLDER AND CURRENT CONTENT HAS MODIFIED
                {
                    if (newPath.sub[newPath.sub.length - 2].content.length == 0) continue;
                    
                    // ADD MODIFIED CONTENT TO NEWPATH
                    if (newPath.sub[newPath.sub.length - 1].content.length == 0) newPath.sub[newPath.sub.length - 1].content[0] = newPath.sub[newPath.sub.length - 2];
                    else newPath.sub[newPath.sub.length - 1].content.push(newPath.sub[newPath.sub.length - 2]);
                    
                    continue;
                }
                
                // ADD CONTENT TO NEWPATH
                if (newPath.sub[newPath.sub.length - 1].content.length == 0) newPath.sub[newPath.sub.length - 1].content[0] = resPath[iA].content[iB];
                else newPath.sub[newPath.sub.length - 1].content.push(resPath[iA].content[iB]);
            }
        }
        
        // ROOT CONSTRUCTION
        
        // FOREACH CONTENT IN PATH
        for (let i = 0; i < resPath[0].length; i++)
        {
            // IF ON DEEPEST FOLDER AND
            // CURRENT CONTENT HAS MODIFIED
            // THEN CONTINUE
            if (resPath.length == 1 && i == resIndexes[0]) continue;
            else if (i == resIndexes[0]) // IF NOT ON DEEPEST FOLDER AND CURRENT CONTENT HAS MODIFIED
            {
                if (newPath.sub[newPath.sub.length - 1].content.length == 0) continue;
                
                // ADD MODIFIED CONTENT TO NEWPATH
                if (newPath.final.length == 0) newPath.final[0] = newPath.sub[newPath.sub.length - 1];
                else newPath.final.push(newPath.sub[newPath.sub.length - 1]);
                
                continue;
            }
            
            // ADD CONTENT TO NEW PATH
            if (newPath.final.length == 0) newPath.final[0] = resPath[0][i];
            else newPath.final.push(resPath[0][i]);
        }
        
        // SET RESOURCES TO NEW MODIFIED RESOURCES
        this.#resources = await newPath.final;
    }
    
    static async UnloadAll ()
    {
        this.#resources = await [];
    }
}

class Time
{
    static unscaledTime = 0;
    static unscaledDeltaTime = 0;
    static timeScale = 1;
    static frameCount = 0;
    static time = 0;
    static deltaTime = 0;
    static maximumDeltaTime = 0.3333333;
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



// ---------- Classes

// ----- Data Types

class Matrix3x3
{
    matrix = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    
    static get zero ()
    {
        let output = new Matrix3x3(
            [0, 0 ,0],
            [0, 0, 0],
            [0, 0, 0]
        );
        
        return output;
    }
    
    static get identity ()
    {
        let output = new Matrix3x3(
            [1, 0 ,0],
            [0, 1, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    get transpose ()
    {
        let m = this.matrix;
        let output = new Matrix3x3(
            [m[0][0], m[1][0], m[2][0]],
            [m[0][1], m[1][1], m[2][1]],
            [m[0][2], m[1][2], m[2][2]]
        );
        
        return output;
    }
    
    constructor (a, b, c)
    {
        this.matrix = [
            a ?? [1, 0, 0],
            b ?? [0, 1, 0],
            c ?? [0, 0, 1]
        ];
    }
    
    static Translate (translation)
    {
        let output = new Matrix3x3(
            [1, 0, 0],
            [0, 1, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Rotate (rotation)
    {
        let output = new Matrix3x3(
            [Math.cos(rotation), Math.sin(rotation), 0],
            [-Math.sin(rotation), Math.cos(rotation), 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static Scale (scale)
    {
        let output = new Matrix3x3(
            [scale.x, 0, 0],
            [0, scale.y, 0],
            [0, 0, 1]
        );
        
        return output;
    }
    
    static TRS (translation, rotation, scale)
    {
        let output = new Matrix3x3(
            [Math.cos(rotation) * scale.x, Math.sin(rotation) * scale.y, 0],
            [-Math.sin(rotation) * scale.x, Math.cos(rotation) * scale.y, 0],
            [translation.x, translation.y, 1]
        );
        
        return output;
    }
    
    static Ortho (left, right, bottom, top)
    {
        let output = new Matrix3x3(
            [right - left, 0, 0]
            [0, top - bottom, 0]
            [-(right + left) / (right - left), -(top + bottom) / (top - bottom), 1]
        );
        
        return output;
    }
    
    static Multiply (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        let a = lhs.matrix;
        let b = rhs.matrix;
        let output = new Matrix3x3();
        
        output.matrix = [
            [
                a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
                a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
                a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]
            ],
            [
                a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
                a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
                a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]
            ],
            [
                a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
                a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
                a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]
            ]
        ];
        
        return output;
    }
    
    GetValue (column, row)
    {
        if (column == null || row == null) throw BlankEngine.ThrowError(0);
        
        return this.matrix[column][row];
    }
    
    SetValue (column, row, value)
    {
        if (column == null || row == null || value == null) throw BlankEngine.ThrowError(0);
        
        this.matrix[column][row] = value;
    }
    
    GetColumn (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(index, i);
        }
        
        return output;
    }
    
    SetColumn (index, values)
    {
        if (index == null || values == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(index, i, values[i]);
        }
    }
    
    GetRow (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(i, index);
        }
        
        return output;
    }
    
    SetRow (index, values)
    {
        if (index == null || values == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(i, index, values[i]);
        }
    }
}

/**
 * Used to represent 2D vectors, positions and points
 * 
 * @public
 * @class
 */
class Vector2
{
    // Static Properties
    
    /**
     * Shorthand for Vector2(0, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get zero ()
    {
        return new Vector2(0, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get one ()
    {
        return new Vector2(1, 1);
    }
    
    /**
     * Shorthand for Vector2(0, 1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get up ()
    {
        return new Vector2(0, 1);
    }
    
    /**
     * Shorthand for Vector2(0, -1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get down ()
    {
        return new Vector2(0, -1);
    }
    
    /**
     * Shorthand for Vector2(-1, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get left ()
    {
        return new Vector2(-1, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get right ()
    {
        return new Vector2(1, 0);
    }
    
    
    // Properties
    
    /**
     * The X component of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @type {number}
     */
    x = 0;
    
    /**
     * The Y component of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @type {number}
     */
    y = 0;
    
    /**
     * (Read Only)
     * Returns the length of this vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {number}
     */
    get magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns the squared length of this vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {number}
     */
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns this vector with a magnitude of 1
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {Vector2}
     */
    get normalized ()
    {
        return new Vector2(this.x / this.magnitude || 0.0, this.y / this.magnitude || 0.0);
    }
    
    
    // Constructor
    
    /**
     * Creates a new Vector2 with given x and y components
     * 
     * @memberof Vector2
     * 
     * @param {number} x - The X component of the vector
     * @param {number} y - The Y component of the vector
     */
    constructor (x, y)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
    
    
    // Static Methods
    
    /**
     * Returns the distance of a and b
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} a - The first vector
     * @param {Vector2} b - The second vector
     * 
     * @returns {number}
     */
    static Distance (a, b)
    {
        let x = a.x - b.x;
        let y = a.y - b.y;
        
        return Math.sqrt(x * x + y * y);
    }
    
    /**
     * Returns the dot product of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {number}
     */
    static Dot (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return (lhs.x * rhs.x + lhs.y * rhs.y)
    }
    
    /**
     * Returns a vector made of the smallest components of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {Vector2}
     */
    static Min (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
    }
    
    /**
     * Returns a vector made of the largest components of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {Vector2}
     */
    static Max (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
    }
    
    
    // Methods
    
    /**
     * Sets the x and y components of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @param {number} x - The X component of the vector
     * @param {number} y - The Y component of the vector
     */
    Set (x, y)
    {
        if (x == null || y == null) throw BlankEngine.ThrowError(0);
        
        this.x = x;
        this.y = y;
    }
    
    /**
     * Returns a string format of this vector
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @returns {string}
     */
    toString ()
    {
        return `(${this.x}, ${this.y})`;
    }
    
    /**
     * Compares this vector with another Vector2, returns true if the vectors are equal
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @param {Vector2} other - The vector you want to compare with
     * 
     * @returns {boolean}
     */
    Equals (other)
    {
        return this.x == other.x && this.y == other.y;
    }
    
    /**
     * Makes this vector have a magnitude of 1
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     */
    Normalize ()
    {
        let magnitude = this.magnitude;
        
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
}

class Rect
{
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    
    get rectArray ()
    {
        let x = this.x;
        let y = this.y;
        let w = this.width;
        let h = this.height;
        
        return new Float32Array([x, y, x + w, y, x, y + h, x, y + h, x + w, y, x + w, y + h]);
    }
    
    get position ()
    {
        return new Vector2(this.x, this.y);
    }
    
    set position (value)
    {
        if (value == null) throw BlankEngine.ThrowError(0);
        
        this.x = value.x;
        this.y = value.y
    }
    
    get size ()
    {
        return new Vector2(this.width, this.height);
    }
    
    set size (value)
    {
        if (value == null) throw BlankEngine.ThrowError(0);
        
        this.width = value.x;
        this.height = value.y
    }
    
    constructor (x, y, width, height)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = width ?? 1;
        this.height = height ?? 1;
    }
    
    Set (x, y, width, height)
    {
        if (x == null || y == null || width == null || height == null) throw BlankEngine.ThrowError(0);
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    toString ()
    {
        return `${this.x}, ${this.y}, ${this.width}, ${this.height}`;
    }
}

class Color
{
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    
    get grayscale ()
    {
        let value = (this.r * 0.3 + this.g * 0.59 + this.b * 0.11);
        
        return new Color(value, value, value, this.a);
    }
    
    constructor (r, g, b, a)
    {
        this.r = r ?? 0;
        this.g = g ?? 0;
        this.b = b ?? 0;
        this.a = a ?? 1;
    }
    
    Set (r, g, b, a)
    {
        if (r == null || g == null || b == null) throw BlankEngine.ThrowError(0);
        
        this.r = r;
        this.g = g;
        this.b = b;
        
        if (a != null) this.a = a;
    }
    
    toString ()
    {
        return `${this.r}, ${this.g}, ${this.b}, ${this.a}`;
    }
}


// ----- Objects

class Object
{
    name = null;
    
    constructor () { }
    
    toString ()
    {
        return this.name;
    }
}

class GameObject extends Object
{
    #name = "Empty Object";
    #active = false;
    #components = [new Transform()];
    
    get name ()
    {
        return this.#name;
    }
    
    set name (value)
    {
        this.#name = value;
        
        let components = this.#components;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    get activeSelf ()
    {
        return this.#active;
    }
    
    get components ()
    {
        return this.#components;
    }
    
    set components (value)
    {
        var newComps = [this.#components[0]];
        
        for (let i = 0; i < value.length; i++)
        {
            let validType = value[i] instanceof Component;
            
            if (!validType) throw BlankEngine.ThrowError(4);
            
            newComps.push(value[i]);
        }
        
        this.#components = newComps;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            this.#components[i].gameObject = this;
            this.#components[i].name = this.name;
        }
    }
    
    get transform ()
    {
        return this.#components[0];
    }
    
    set transform (value)
    {
        this.#components[0] = value;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            this.#components[i].gameObject = this;
            this.#components[i].name = this.name;
        }
    }
    
    constructor (name, components, active, transform)
    {
        if (components != null && !Array.isArray(components)) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.components = components ?? [];
        this.transform = transform ?? new Transform();
    }
    
    SetActive (state)
    {
        this.#active = state;
        
        let components = this.#components;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    BroadcastMessage (method, params, data)
    {
        if (method == null) throw BlankEngine.ThrowError(0);
        
        if (!this.#active) return;
        
        let components = this.#components;
        var args = "";
        var data = data ?? { };
        
        if (params == null || typeof params == "string") args = params;
        else 
        {
            for (let i = 0; i < params.length; i++)
            {
                args += `params[${i}]`;
                
                if (i != params.length - 1) args += ",";
            }
        }
        
        for (let i = 0; i < components.length; i++)
        {
            let validType = components[i] instanceof GameBehavior;
            
            if (!components[i].enabled || !validType) continue;
            
            eval(`components[i].${method}(${args})`);
            
            if (data.clearAfter) eval(`components[i].${method} = function () { }`);
            
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    GetComponents (type)
    {
        if (type == null) throw BlankEngine.ThrowError(0);
        
        let components = this.#components;
        var newComps = [];
        
        for (let i = 0; i < components.length; i++)
        {
            let validType = eval(`components[i] instanceof ${type}`);
            
            if (!validType) continue;
            
            let isBehavior = components[i] instanceof Behavior;
            
            if (isBehavior && !components[i].enabled) continue;
            
            if (newComps.length == 0) newComps[0] = components[i];
            else newComps(components[i]);
        }
        
        return newComps;
    }
}

class Shader extends Object
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
        if (!name) throw BlankEngine.ThrowError(2, "Shader Data: Shader name is undefined");
        if (!shader) throw BlankEngine.ThrowError(2, "Shader Data: Shader is undefined");
        if (!type) throw BlankEngine.ThrowError(2, "Shader Data: Shader type is undefined");
        
        super();
        
        this.name = name;
        this.#type = type;
        
        let gl = Application.gl;
        var shaderType;
        
        switch (this.#type)
        {
            case "VERTEX":
                shaderType = gl.VERTEX_SHADER;
                break;
            case "FRAGMENT":
                shaderType = gl.FRAGMENT_SHADER;
                break;
        }
        
        if (shaderType == null) throw BlankEngine.ThrowError(2, `Shader Data: Type "${this.#type}" doesn't exist`);
        
        this.#shader = gl.createShader(shaderType);
        
        gl.shaderSource(this.#shader, shader);
        gl.compileShader(this.#shader);
        
        if (!gl.getShaderParameter(this.#shader, gl.COMPILE_STATUS)) throw BlankEngine.ThrowError(2, gl.getShaderInfoLog(this.#shader));
    }
    
    static Find (name, type)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i < this.#shaders.length; i++)
        {
            if (type != null && this.#shaders[i].type !== type) continue;
            if (this.#shaders[i].name === name) return this.#shaders[i];
        }
        
        throw BlankEngine.ThrowError(3);
    }
    
    static async Set (shaders)
    {
        if (shaders == null || !Array.isArray(shaders)) throw BlankEngine.ThrowError(0);
        
        this.#shaders[0] = new Shader("Default/None", "attribute vec2 aVertexPos; attribute vec2 aTexturePos; varying vec2 vTexturePos; uniform mat3 uWorldSpaceMat; void main () { gl_Position = vec4(uWorldSpaceMat * vec3(aVertexPos, 1), 1); vTexturePos = aTexturePos; }", "VERTEX");
        this.#shaders[1] = new Shader("Default/None", "precision mediump float; uniform sampler2D uSampler; varying vec2 vTexturePos; void main () { gl_FragColor = texture2D(uSampler, vTexturePos); }", "FRAGMENT");
        
        for (let iA = 0; iA < shaders.length; iA++)
        {
            if (shaders[iA] === "") continue;
            
            var slashes = 0;
            var keyword = "";
            var shaderData = ["", ""];
            var keywordValue = 0;
            var isInsideQuote = false;
            var quoteType = "";
            
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
                    
                    if (keywordValue === -1) throw BlankEngine.ThrowError(3, `Shader Data: Keyword "${keyword}" doesn't exist`);
                    
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

class Material extends Object
{
    #gl = null;
    #program = null;
    
    get gl ()
    {
        return this.#gl;
    }
    
    get program ()
    {
        return this.#program;
    }
    
    constructor (vertexShader, fragmentShader)
    {
        super();
        
        this.#gl = Application.gl;
        
        let vShader = vertexShader ?? Shader.Find("Default/None", "VERTEX");
        let fShader = fragmentShader ?? Shader.Find("Default/None", "FRAGMENT");
        
        this.#program = this.#gl.createProgram();
        
        this.#gl.attachShader(this.#program, vShader.shader);
        this.#gl.attachShader(this.#program, fShader.shader);
        this.#gl.linkProgram(this.#program);
        
        if (!this.#gl.getProgramParameter(this.#program, this.#gl.LINK_STATUS)) throw BlankEngine.ThrowError(2, this.#gl.getProgramInfoLog(this.#program));
        
        this.#gl.detachShader(this.#program, vShader.shader);
        this.#gl.detachShader(this.#program, fShader.shader);
    }
    
    getAttribLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.#gl.getAttribLocation(this.#program, name);
    }
    
    getUniformLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.#gl.getUniformLocation(this.#program, name);
    }
}

class Texture extends Object
{
    #loaded = false;
    #img = null;
    
    wrapMode = 0;
    filterMode = 0;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get img ()
    {
        return this.#img;
    }
    
    constructor (src)
    {
        if (src == null) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.#img = new Image();
        this.#img.src = `../img/${src}`;
        this.#img.sprite = this;
        
        this.#img.onload = () => { this.#loaded = true; };
    }
}

class Sprite extends Object
{
    texture = null;
    rect = new Rect();
    
    constructor (texture, rect)
    {
        if (texture == null) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.texture = texture;
        this.rect = rect ?? new Rect();
    }
}


// ----- Components

class Component extends Object
{
    gameObject = null;
    
    constructor ()
    {
        super();
    }
    
    BroadcastMessage (method, params, data)
    {
        if (!gameObject.activeSelf) return;
        
        let components = this.gameObject.components;
        var args = "";
        var data = data ?? { };
        
        if (params == null || typeof params == "string") args = params;
        else
        {
            for (let i = 0; i < params.length; i++)
            {
                args += `params[${i}]`;
                
                if (i != params.length - 1) args += ",";
            }
        }
        
        for (let i = 0; i < components.length; i++)
        {
            let validType = components[i] instanceof GameBehavior;
            
            if (!components[i].enabled || !validType) continue;
            
            eval(`components[i].${method}(${args})`);
            
            if (data.clearAfter) eval(`components[i].${method} = function () { }`);
            
            components[i].gameObject = this.gameObject;
            components[i].name = this.name;
        }
    }
}

class Behavior extends Component
{
    enabled = true;
    
    get isActiveAndEnabled ()
    {
        return this.gameObject.activeSelf && this.enabled;
    }
    
    constructor ()
    {
        super();
    }
}

class GameBehavior extends Behavior
{
    constructor ()
    {
        super();
    }
    
    Awake () { }
    
    OnEnable () { }
    
    Start () { }
    
    FixedUpdate () { }
    
    Update () { }
    
    LateUpdate () { }
    
    OnPreRender () { }
    
    OnRenderObject () { }
    
    OnPostRender () { }
    
    OnRenderImage () { }
    
    OnApplicationQuit () { }
    
    OnDisable () { }
    
    OnDestroy () { }
}

class Transform extends Component
{
    position = new Vector2();
    rotation = 0;
    scale = new Vector2();
    
    constructor (position, rotation, scale)
    {
        super();
        
        this.position = position ?? new Vector2();
        this.rotation = rotation ?? 0;
        this.scale = scale ?? new Vector2();
    }
}

class Camera extends Behavior
{
    orthographicSize = 1;
    projectionMatrix = Matrix3x3.Ortho();
    
    get worldToCameraMatrix ()
    {
        let gOTrans = this.gameObject.transform;
        let output = Matrix3x3.TRS(gOTrans.position, gOTrans.rotation * Math.PI / 180, gOTrans.scale);
        
        return output;
    }
    
    constructor ()
    {
        super();
    }
    
    Render ()
    {
        let projM = this.projectionMatrix.matrix;
        let camM = this.worldToCameraMatrix;
        
        let mPos = new Vector2(-camM.matrix[2][0], -camM.matrix[2][1]);
        let mRot = 0;
        let mScale = new Vector2(1 / (Application.htmlCanvas.width / (Application.htmlCanvas.height / this.orthographicSize)), -1 / this.orthographicSize);
        
        let transM = Matrix3x3.TRS(mPos, mRot * Math.PI / 180, mScale);
        let viewM = new Matrix3x3(
            [
                camM.matrix[0][0] * transM.matrix[0][0],
                camM.matrix[0][1] * transM.matrix[0][1],
                camM.matrix[0][2] * transM.matrix[0][2]
            ],
            [
                camM.matrix[1][0] * transM.matrix[1][0],
                camM.matrix[1][1] * transM.matrix[1][1],
                camM.matrix[1][2] * transM.matrix[1][2]
            ],
            [
                transM.matrix[2][0],
                transM.matrix[2][1],
                camM.matrix[2][2] * transM.matrix[2][2]
            ]
        );
        
        for (let iA = 0; iA < SceneManager.GetActiveScene().gameObjects.length; iA++)
        {
            let renderers = SceneManager.GetActiveScene().gameObjects[iA].GetComponents("SpriteRenderer");
            
            for (let iB = 0; iB < renderers.length; iB++)
            {
                renderers[iB].localSpaceMatrix = viewM;
                renderers[iB].render();
            }
        }
    }
}

class SpriteRenderer extends Component
{
    #loaded = false;
    #sprite = null;
    #material = new Material();
    #texture = null;
    #texBuffer = null;
    #geoBuffer = null;
    #aVPosLoc = null;
    #aTPosLoc = null;
    #uSamplerLoc = null;
    #uWSMatLoc = null;
    
    localSpaceMatrix = new Matrix3x3();
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get sprite ()
    {
        return this.#sprite;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.#loaded = false;
        
        this.checkImg();
    }
    
    get material ()
    {
        return this.#material;
    }
    
    set material (value)
    {
        this.#material = value;
        
        this.#loaded = false;
        
        this.checkImg();
    }
    
    constructor (sprite, material)
    {
        if (sprite == null) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.#sprite = sprite;
        
        this.#material = material ?? new Material();
        
        this.checkImg();
    }
    
    checkImg ()
    {
        requestAnimationFrame(() => { if (this.#sprite.texture.isLoaded) return this.load(); this.checkImg(); });
    }
    
    load ()
    {
        if (this.#loaded) return;
        
        let texture = this.#sprite.texture;
        
        if (isNaN(texture.filterMode) || texture.filterMode < 0 || texture.filterMode > 1 || isNaN(texture.wrapMode) || texture.wrapMode < 0 || texture.wrapMode > 2) throw BlankEngine.ThrowError(0);
        
        let gl = this.#material.gl;
        
        let filterMode;
        let wrapMode;
        let rect = new Rect();
        
        switch (texture.filterMode)
        {
            case 0:
                filterMode = gl.LINEAR;
                break;
            case 1:
                filterMode = gl.NEAREST;
                break;
        }
        
        switch (texture.wrapMode)
        {
            case 0:
                wrapMode = gl.CLAMP_TO_EDGE;
                break;
            case 1:
                wrapMode = gl.REPEAT;
                break;
            case 2:
                wrapMode = gl.MIRRORED_REPEAT;
                break;
        }
        
        gl.useProgram(this.#material.program);
        
        this.#texture = gl.createTexture();
        this.#texBuffer = gl.createBuffer();
        this.#geoBuffer = gl.createBuffer();
        
        this.#aVPosLoc = this.#material.getAttribLocation("aVertexPos");
        this.#aTPosLoc = this.#material.getAttribLocation("aTexturePos");
        this.#uSamplerLoc = this.#material.getUniformLocation("uSampler");
        this.#uWSMatLoc = this.#material.getUniformLocation("uWorldSpaceMat");
        
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#geoBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.useProgram(null);
        
        this.#loaded = true;
    }
    
    render ()
    {
        if (!this.#loaded) return;
        
        let gl = this.#material.gl;
        let localSpaceMat = [
            this.localSpaceMatrix.matrix[0][0],
            this.localSpaceMatrix.matrix[0][1],
            this.localSpaceMatrix.matrix[0][2],
            this.localSpaceMatrix.matrix[1][0],
            this.localSpaceMatrix.matrix[1][1],
            this.localSpaceMatrix.matrix[1][2],
            this.localSpaceMatrix.matrix[2][0],
            this.localSpaceMatrix.matrix[2][1],
            this.localSpaceMatrix.matrix[2][2]
        ];
        
        gl.useProgram(this.#material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        
        gl.uniform1i(this.#uSamplerLoc, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#texBuffer);
        gl.enableVertexAttribArray(this.#aTPosLoc);
        gl.vertexAttribPointer(this.#aTPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#geoBuffer);
        gl.enableVertexAttribArray(this.#aVPosLoc);
        gl.vertexAttribPointer(this.#aVPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.uniformMatrix3fv(this.#uWSMatLoc, false, new Float32Array(localSpaceMat));
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        
        gl.useProgram(null);
    }
}
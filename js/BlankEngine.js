/**
 * The main static class of the engine
 * @public
 * @static
 * @class
 */
class BlankEngine
{
    // Static Classes
    
    static Core = class
    {
        static async #loadData ()
        {
            this.compiledData = { shaders : [], scenes : [] };
            
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
            Window.data = this.packageData.window;
            Window.init();
            
            await Shader.Set(this.compiledData.shaders);
            
            for (let i = 0; i < this.buildData.scripts.length; i++)
            {
                let scriptSrc = `js/${this.buildData.scripts[i]}.js`;
                let script = document.createElement("script");
                
                script.src = scriptSrc;
                script.type = "text/javascript";
                
                await document.body.appendChild(script);
            }
            
            await Resources.Set(this.buildData.resources);
            
            await SceneManager.Set(this.compiledData.scenes);
            
            BlankEngine.PlayerLoop.init();
        }
        
        static initiateProgram ()
        {
            document.body.style.height = "100vh";
            document.body.style.margin = "0";
            document.body.style.display = "flex";
            document.body.style.alignItems = "center";
            
            this.#loadData();
        }
    }
    
    static PlayerLoop = class
    {
        static #requestUpdate ()
        {
            requestAnimationFrame(this.#update.bind(this));
        }
        
        static #update ()
        {
            if (!document.hasFocus() || !Application.isLoaded || !SceneManager.GetActiveScene().isLoaded) return this.#requestUpdate();
            
            Application.Update();
            
            this.#requestUpdate();
        }
        
        static init ()
        {
            this.#requestUpdate();
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
    
    static async #toObject (data)
    {
        if (data.name == null) throw BlankEngine.ThrowError(0);
        
        var object;
        
        switch (data.type)
        {
            case "Texture":
                if (data.args.src == null) throw BlankEngine.ThrowError(0);
                
                object = await new Texture(data.args.src);
                
                
                if (data.args.wrapMode != null) object.wrapMode = data.args.wrapMode;
                if (data.args.filterMode != null) object.filterMode = data.args.filterMode;
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
                    if (existInRes == 2 || existInRes == 3) return null;
                    
                    // LOAD CONTENT
                    await this.#setRes(inPath, await this.#toObject(uRPath[iB]));
                    
                    return null;
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
                if (resPath[0].length == 0) return null;
                
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
                            if (resPath[0][iB].type == "subpath" || resPath[0][iB].name != newTargetPath[0]) return null;
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
                            if (resPath[0][iB].type != "subpath" || resPath[0][iB].name != newTargetPath[0]) return null;
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
            if (resPath[resPath.length - 1].content.length == 0) return null;
            
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
                        if (resPath[iA].content[iB].type == "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) return null;
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
                        if (resPath[iA].content[iB].type != "subpath" || resPath[iA].content[iB].name != newTargetPath[iA]) return null;
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
    get floatArray ()
    {
        return new Float32Array(this.matrix);
    }
    
    get transpose ()
    {
        let output = new Matrix3x3();
        let m = this.matrix;
        
        output.matrix = [
            m[0], m[3], m[6],
            m[1], m[4], m[7],
            m[2], m[5], m[8]
        ];
        
        return output;
    }
    
    constructor ()
    {
        this.matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }
    
    GetValue (row, column)
    {
        if (row == null || column == null) throw BlankEngine.ThrowError(0);
        
        let arrayPos = 0;
        let matVPos = `${row}${column}`;
        
        switch (matVPos)
        {
            case "01":
                arrayPos = 1;
                break;
            case "02":
                arrayPos = 2;
                break;
            case "10":
                arrayPos = 3;
                break;
            case "11":
                arrayPos = 4;
                break;
            case "12":
                arrayPos = 5;
                break;
            case "20":
                arrayPos = 6;
                break;
            case "21":
                arrayPos = 7;
                break;
            case "22":
                arrayPos = 8;
                break;
        }
        
        return this.matrix[arrayPos];
    }
    
    SetValue (row, column, value)
    {
        if (row == null || column == null || value == null) throw BlankEngine.ThrowError(0);
        
        let arrayPos = 0;
        let matVPos = `${row}${column}`;
        
        switch (matVPos)
        {
            case "01":
                arrayPos = 1;
                break;
            case "02":
                arrayPos = 2;
                break;
            case "10":
                arrayPos = 3;
                break;
            case "11":
                arrayPos = 4;
                break;
            case "12":
                arrayPos = 5;
                break;
            case "20":
                arrayPos = 6;
                break;
            case "21":
                arrayPos = 7;
                break;
            case "22":
                arrayPos = 8;
                break;
        }
        
        this.matrix[arrayPos] = value;
    }
    
    SetRow (index, values)
    {
        if (index == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(index, i, values[i]);
        }
    }
    
    SetColumn (index, values)
    {
        if (index == null || values[0] == null || values[1] == null || values[2] == null) throw BlankEngine.ThrowError(0);
        
        for (let i = 0; i <= 2; i++)
        {
            this.SetValue(i, index, values[i]);
        }
    }
    
    GetRow (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(index, i);
        }
        
        return output;
    }
    
    GetColumn (index)
    {
        if (index == null) throw BlankEngine.ThrowError(0);
        
        let output = [0, 0, 0];
        
        for (let i = 0; i <= 2; i++)
        {
            output[i] = this.GetValue(i, index);
        }
        
        return output;
    }
    
    static Multiply (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        let output = new Matrix3x3();
        let a = lhs.matrix;
        let b = rhs.matrix;
        
        output.matrix = [
            a[0] * b[0] + a[3] * b[1] + a[6] * b[2],
            a[1] * b[0] + a[4] * b[1] + a[7] * b[2],
            a[2] * b[0] + a[5] * b[1] + a[8] * b[2],
            a[0] * b[3] + a[3] * b[4] + a[6] * b[5],
            a[1] * b[3] + a[4] * b[4] + a[7] * b[5],
            a[2] * b[3] + a[5] * b[4] + a[8] * b[5],
            a[0] * b[6] + a[3] * b[7] + a[6] * b[8],
            a[1] * b[6] + a[4] * b[7] + a[7] * b[8],
            a[2] * b[6] + a[5] * b[7] + a[8] * b[8],
        ];
        
        return output;
    }
}

/**
 * Used to represent 2D vectors, positions and points
 * @public
 * @class
 */
class Vector2
{
    // Static Properties
    
    /**
     * Shorthand for Vector2(0, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get zero ()
    {
        return new Vector2(0, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get one ()
    {
        return new Vector2(1, 1);
    }
    
    /**
     * Shorthand for Vector2(0, 1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get up ()
    {
        return new Vector2(0, 1);
    }
    
    /**
     * Shorthand for Vector2(0, -1)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get down ()
    {
        return new Vector2(0, -1);
    }
    
    /**
     * Shorthand for Vector2(-1, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get left ()
    {
        return new Vector2(-1, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 0)
     * @memberof Vector2
     * @public
     * @static
     * @returns {Vector2}
     */
    static get right ()
    {
        return new Vector2(1, 0);
    }
    
    
    // Properties
    
    /**
     * (Read Only)
     * Returns the length of this vector
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {float}
     */
    get magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns the squared length of this vector
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {float}
     */
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns this vector with a magnitude of 1
     * @memberof Vector2
     * @readonly
     * @public
     * @returns {Vector2}
     */
    get normalized ()
    {
        return new Vector2(this.x / this.magnitude || 0.0, this.y / this.magnitude || 0.0);
    }
    
    
    // Constructor
    
    /**
     * Creates a new Vector2 with given x and y components
     * @memberof Vector2
     * @param {float} x - The X component of the vector
     * @param {float} y - The Y component of the vector
     */
    constructor (x, y)
    {
        /**
         * The X component of the vector
         * @memberof Vector2
         * @public
         * @member {float}
         */
        this.x = x ?? 0.0;
        
        /**
         * The Y component of the vector
         * @memberof Vector2
         * @public
         * @member {float}
         */
        this.y = y ?? 0.0;
    }
    
    
    // Methods
    
    /**
     * Sets the x and y components of the vector
     * @memberof Vector2
     * @public
     * @function
     * @param {float} x - The X component of the vector
     * @param {float} y - The Y component of the vector
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
     * @public
     * @function
     * @returns {string}
     */
    toString ()
    {
        return `(${this.x}, ${this.y})`;
    }
    
    /**
     * Compares this vector with another Vector2, returns true if the vectors are equal
     * @memberof Vector2
     * @public
     * @function
     * @param {Vector2} other - The vector you want to compare with
     * @returns {bool}
     */
    Equals (other)
    {
        return this.x == other.x && this.y == other.y;
    }
    
    /**
     * Makes this vector have a magnitude of 1
     * @memberof Vector2
     * @public
     * @function
     */
    Normalize ()
    {
        let magnitude = this.magnitude;
        
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
    
    
    // Static Methods
    
    /**
     * Returns the distance of a and b
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} a - The first vector
     * @param {Vector2} b - The second vector
     * @returns {float}
     */
    static Distance (a, b)
    {
        let x = a.x - b.x;
        let y = a.y - b.y;
        
        return Math.sqrt(x * x + y * y);
    }
    
    /**
     * Returns the dot product of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {float}
     */
    static Dot (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return (lhs.x * rhs.x + lhs.y * rhs.y)
    }
    
    /**
     * Returns a vector made of the smallest components of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {Vector2}
     */
    static Min (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
    }
    
    /**
     * Returns a vector made of the largest components of two vectors
     * @memberof Vector2
     * @public
     * @static
     * @function
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * @returns {Vector2}
     */
    static Max (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
    }
}

class Rect
{
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
    
    constructor (x = 0, y = 0, width = 1, height = 1)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
    get grayscale ()
    {
        let value = (this.r * 0.3 + this.g * 0.59 + this.b * 0.11);
        
        return new Color(value, value, value, this.a);
    }
    
    constructor (r = 0.0, g = 0.0, b = 0.0, a = 1.0)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    Set (r, g, b, a = this.a)
    {
        if (r == null || g == null || b == null) throw BlankEngine.ThrowError(0);
        
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    
    toString ()
    {
        return `${this.r}, ${this.g}, ${this.b}, ${this.a}`;
    }
}


// ----- Objects

class Object
{
    constructor ()
    {
        this.name = null;
    }
    
    toString ()
    {
        return this.name;
    }
}

class GameObject extends Object
{
    #active = false;
    
    get activeSelf ()
    {
        return this.#active;
    }
    
    constructor (name, components, active)
    {
        if (components != null && !Array.isArray(components)) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.components = components ?? [];
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].isComponent) throw BlankEngine.ThrowError(4);
            
            this.components[i].name = this.name;
            this.components[i].gameObject = this;
        }
    }
    
    SetActive (state)
    {
        this.#active = state;
        
        for (let i = 0; i < this.components.length; i++)
        {
            this.components[i].gameObject = this;
        }
    }
    
    Awake ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Awake;
            callback();
        }
    }
    
    OnEnable ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled || !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnEnable;
            callback();
        }
    }
    
    Start ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Start;
            callback();
            
            this.components[i].Start = function () {};
        }
    }
    
    FixedUpdate ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].FixedUpdate;
            callback();
        }
    }
    
    Update ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].Update;
            callback();
        }
    }
    
    LateUpdate ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].LateUpdate;
            callback();
        }
    }
    
    OnPreRender ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnPreRender;
            callback();
        }
    }
    
    OnRenderObject ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnRenderObject;
            callback();
        }
    }
    
    OnPostRender ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnPostRender;
            callback();
        }
    }
    
    OnRenderImage ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnRenderImage;
            callback();
        }
    }
    
    OnApplicationQuit ()
    {
        if (!this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnApplicationQuit;
            callback();
        }
    }
    
    OnDisable ()
    {
        if (this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnDisable;
            callback();
        }
    }
    
    OnDestroy ()
    {
        if (this.#active) return null;
        
        for (let i = 0; i < this.components.length; i++)
        {
            if (!this.components[i].enabled && !this.components[i].isGameBehavior) continue;
            
            let callback = this.components[i].OnDestroy;
            callback();
        }
        
        this.OnDisable();
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
    
    constructor (name, shader, type)
    {
        if (shader == null || shader === "") throw BlankEngine.ThrowError(2, "Shader Data: Shader is undefined");
        if (type == null || type === "") throw BlankEngine.ThrowError(2, "Shader Data: Shader type is undefined");
        
        super();
        
        this.name = name;
        this.type = type;
        
        let gl = Application.gl;
        var shaderType;
        
        switch (this.type)
        {
            case "VERTEX":
                shaderType = gl.VERTEX_SHADER;
                break;
            case "FRAGMENT":
                shaderType = gl.FRAGMENT_SHADER;
                break;
        }
        
        if (shaderType == null) throw BlankEngine.ThrowError(2, `Shader Data: Type "${this.type}" doesn't exist`);
        
        this.shader = gl.createShader(shaderType);
        
        gl.shaderSource(this.shader, shader);
        gl.compileShader(this.shader);
        
        if (!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) throw BlankEngine.ThrowError(2, this.gl.getShaderInfoLog(this.shader));
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
        
        this.#shaders[0] = new Shader("Default/None", "attribute vec2 aVertexPos; attribute vec2 aTexturePos; varying vec2 vTexturePos; void main () { gl_Position = vec4(aVertexPos, 1, 1); vTexturePos = aTexturePos; }", "VERTEX");
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
    constructor (vertexShader, fragmentShader)
    {
        super();
        
        this.gl = Application.gl;
        
        let vShader = vertexShader ?? Shader.Find("Default/None", "VERTEX");
        let fShader = fragmentShader ?? Shader.Find("Default/None", "FRAGMENT");
        
        if (vShader == null || fShader == null) return null;
        
        this.program = this.gl.createProgram();
        
        this.gl.attachShader(this.program, vShader.shader);
        this.gl.attachShader(this.program, fShader.shader);
        this.gl.linkProgram(this.program);
        
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) throw BlankEngine.ThrowError(2, this.gl.getProgramInfoLog(this.program));
        
        this.gl.detachShader(this.program, vShader.shader);
        this.gl.detachShader(this.program, fShader.shader);
    }
    
    getAttribLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.gl.getAttribLocation(this.program, name);
    }
    
    getUniformLocation (name)
    {
        if (name == null) throw BlankEngine.ThrowError(0);
        
        return this.gl.getUniformLocation(this.program, name);
    }
}

class Texture extends Object
{
    #loaded = false;
    #sprite = null;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    constructor (src)
    {
        if (src == null) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.wrapMode = 0;
        this.filterMode = 0;
        
        this.img = new Image();
        this.img.src = `../img/${src}`;
        this.img.sprite = this;
        
        this.img.onload = () => { this.#loaded = true; };
    }
}

class Sprite extends Object
{
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
    get isComponent ()
    {
        return true;
    }
    
    constructor ()
    {
        super();
        
        this.gameObject = null;
    }
}

class Behavior extends Component
{
    get isActiveAndEnabled ()
    {
        return this.gameObject.activeSelf && this.enabled;
    }
    
    constructor ()
    {
        super();
        
        this.enabled = true;
    }
}

class GameBehavior extends Behavior
{
    get isGameBehavior ()
    {
        return true;
    }
    
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

class Camera extends Behavior
{
    constructor ()
    {
        super();
    }
}

class SpriteRenderer extends Component
{
    #loaded = false;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get isRenderer ()
    {
        return true;
    }
    
    constructor (sprite, material)
    {
        if (sprite == null) throw BlankEngine.ThrowError(0);
        
        super();
        
        this.sprite = sprite;
        
        this.material = material ?? new Material();
        
        this.checkImg();
    }
    
    checkImg ()
    {
        requestAnimationFrame(() => { if (this.sprite.texture.isLoaded) return this.load(); this.checkImg(); });
    }
    
    load ()
    {
        if (this.#loaded) return null;
        
        let texture = this.sprite.texture;
        
        if (isNaN(texture.filterMode) || texture.filterMode < 0 || texture.filterMode > 1 || isNaN(texture.wrapMode) || texture.wrapMode < 0 || texture.wrapMode > 2) throw BlankEngine.ThrowError(0);
        
        let gl = this.material.gl;
        
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
        
        gl.useProgram(this.material.program);
        
        this.texture = gl.createTexture();
        this.texBuffer = gl.createBuffer();
        this.geoBuffer = gl.createBuffer();
        
        this.aVPosLoc = this.material.getAttribLocation("aVertexPos");
        this.aTPosLoc = this.material.getAttribLocation("aTexturePos");
        this.uSamplerLoc = this.material.getUniformLocation("uSampler");
        
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterMode);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, rect.rectArray, gl.STATIC_DRAW);
        
        gl.useProgram(null);
        
        this.#loaded = true;
    }
    
    render ()
    {
        if (!this.#loaded) return null;
        
        let gl = this.material.gl;
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        
        gl.uniform1i(this.uSamplerLoc, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
        gl.enableVertexAttribArray(this.aTPosLoc);
        gl.vertexAttribPointer(this.aTPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
        gl.enableVertexAttribArray(this.aVPosLoc);
        gl.vertexAttribPointer(this.aVPosLoc, 2, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
        
        gl.useProgram(null);
    }
}
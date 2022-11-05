class Resources
{
    static #unloadedRes = [];
    static #resources = [];
    
    static get res () { return this.#resources }
    static set res (r) { this.#resources = r; }
    
    static Find (path)
    {
        if (path == null) throw BlankEngine.ThrowError(0);
        
        let newPath = [""];
        let resPath = this.#resources;
        
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
        
        const args = data.args;
        
        let object = null;
        
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
        let resIndexes = [];
        let resPath = [this.#resources];
        let newPath = { final : [], sub : [] };
        
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
            
            let addedNewCont = false;
            
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
        
        let addedNewCont = false;
        
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
        
        let newPath = [""];
        let uRPath = this.#unloadedRes;
        let inPath = [];
        
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
            let resPath = this.#resources;
            
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
                
                let existInRes = 0;
                
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
                await this.#setRes(inPath, uRPath[iB]);
                
                uRPath = uRPath[iB].content;
                
                break;
            }
        }
        
        throw BlankEngine.ThrowError(3);
    }
    
    static async Unload (path)
    {
        if (path == null) throw BlankEngine.ThrowError(0);
        
        let newTargetPath = [""];
        let resIndexes = [];
        let resPath = [this.#resources];
        let newPath = { final : [], sub : [] };
        
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
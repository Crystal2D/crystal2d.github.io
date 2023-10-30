class SceneManager
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
    
    static GetActiveScene ()
    {
        return this.#activeScene ?? { isLoaded : false };
    }
    
    static Set (scenes)
    {
        this.#scenes = scenes;
    }
    
    static Load (index)
    {
        this.#activeScene = new this.Scene(this.#scenes[index].name, {
            resources : this.#scenes[index].resources,
            gameObjects : this.#scenes[index].gameObjects,
            buildIndex : this.#scenes[index].buildIndex,
            path : this.#scenes[index].path
        }) ?? new this.Scene();
        
        this.#loaded = true;
    }
    
    static Unload ()
    {
        this.#activeScene = new this.Scene();
    }
    
    static async CreateObject (type, data)
    {
        const dat = data ?? { };
        
        let object = null;
        let keepName = false;
        
        const libs = BlankEngine.Inner.compiledData.libs;
        const scripts = BlankEngine.Inner.compiledData.scripts;
        
        let foundClass = false;
        let construction = null;
        let properties = [];
        
        for (let iA = 0; iA < libs.length; iA++)
        {
            for (let iB = 0; iB < libs[iA].scripts.length; iB++)
            {
                if (libs[iA].scripts[iB].classes == null) continue;
                
                for (let iC = 0; iC < libs[iA].scripts[iB].classes.length; iC++)
                {
                    if (libs[iA].scripts[iB].classes[iC].name !== type || libs[iA].scripts[iB].classes[iC].type !== 0) continue;
                    
                    construction = libs[iA].scripts[iB].classes[iC].construction;
                    properties = libs[iA].scripts[iB].classes[iC].args;
                    
                    foundClass = true;
                    
                    break;
                }
            }
        }
        
        for (let iA = 0; iA < scripts.length; iA++)
        {
            if (scripts[iA].classes == null) continue;
            
            for (let iB = 0; iA < scripts[iA].classes.length; iB++)
            {
                if (scripts[iA].classes[iB].name !== type || scripts[iA].classes[iB].type !== 0) continue;
                
                construction = scripts[iA].classes[iB].construction;
                properties = scripts[iA].classes[iB].args;
                
                foundClass = true;
                
                break;
            }
        }
        
        if (!foundClass) return new Object();
        
        if (construction != null)
        {
            const evalCall = new AsyncFunction("data", "toObject", construction);
            const objData = await evalCall(dat, async (type, data) => await this.CreateObject(type, data));
            
            keepName = objData.keepName;
            object = objData.object;
        }
        else object = eval(`new ${type}()`);
        
        for (let i = 0; i < properties.length; i++)
        {
            if (typeof properties[i] !== "object" || eval(`dat.${properties[i].name}`) === undefined) continue;
            
            let subObj = null;
            
            if (properties[i].evaluation != null)
            {
                const evalCall = new AsyncFunction("data", properties[i].evaluation);
                
                subObj = await evalCall(eval(`dat.${properties[i].name}`));
            }
            else if (properties[i].evalType != null)
            {
                const evalCall = new AsyncFunction("data", properties[i].evalType);
                
                subObj = await eval(`this.CreateObject(${await evalCall(eval(`dat.${properties[i].name}`))}, ${eval(`dat.${properties[i].name}`)})`);
            }
            else if ((["boolean", "number", "string", "object"]).includes(properties[i].type)) subObj = eval(`dat.${properties[i].name}`);
            else if (properties[i].type === "array") subObj = await this.CreateObjectArray(eval(`dat.${properties[i].name}`));
            else subObj = await eval(`this.CreateObject(${properties[i].type}, ${eval(`dat.${properties[i].name}`)})`);
            
            subObj = eval(`dat.${properties[i].name}`);
            
            eval(`object.${properties[i].name} = subObj`);
        }
        
        if (dat.name != null && !keepName) object.name = dat.name;
        
        return object;
    }
    
    static async CreateObjectArray (data)
    {
        let objects = [];
        
        for (let i = 0; i < data.length; i++)
        {
            let newObj = null;
            
            if (Array.isArray(data[i])) newObj = await this.CreateObjectArray(data[i]);
            else if (typeof data[i] === "object" && data[i].__compiled) newObj = await this.CreateObject(data[i].type, data[i].args);
            else newObj = data[i];
            
            if (objects.length === 0) objects[0] = newObj;
            else objects.push(newObj);
        }
        
        return objects;
    }
}
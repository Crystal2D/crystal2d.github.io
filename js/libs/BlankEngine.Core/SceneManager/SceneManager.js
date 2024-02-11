class SceneManager
{
    static #loaded = false;
    static #unloaded = false;
    static #scenes = [];
    
    static #activeScene = null;
    
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
            partioning : this.#scenes[index].partioning,
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
        
        const foundClass = BlankEngine.Inner.GetClassOfType(type, 0);
        
        if (foundClass == null) return new Object();
        
        const construction = foundClass.construction;
        const properties = foundClass.args;
        
        if (construction != null)
        {
            const evalCall = new AsyncFunction("data", "toObject", construction);
            
            object = await evalCall(dat, async (type, data) => await this.CreateObject(type, data));
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
                const objType = await evalCall(eval(`dat.${properties[i].name}`));
                
                subObj = await this.CreateObject(objType, eval(`dat.${properties[i].name}`));
            }
            else if ((["boolean", "number", "string", "object"]).includes(properties[i].type)) subObj = eval(`dat.${properties[i].name}`);
            else if (properties[i].type === "array") subObj = await this.CreateObjectArray(eval(`dat.${properties[i].name}`));
            else subObj = await this.CreateObject(properties[i].type, eval(`dat.${properties[i].name}`));
            
            eval(`object.${properties[i].name} = subObj`);
        }
        
        if (dat.name != null && type !== "GameObject") object.name = dat.name;
        
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
            
            objects.push(newObj);
        }
        
        return objects;
    }
}
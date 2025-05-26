class Resources
{
    static #unloadedRes = [];
    static #resources = [];
    
    static async #ToObject (name, type, data)
    {
        const dat = data ?? { };
        
        let object = null;
        
        const foundClass = CrystalEngine.Inner.GetClassOfType(type, 1);
        
        if (foundClass == null) return new Object();
        
        const construction = foundClass.construction;
        const properties = foundClass.args;
        
        if (construction != null)
        {
            const evalCall = new AsyncFunction("data", "toObject", construction);
            
            object = await evalCall(dat, async (type, data) => await SceneManager.CreateObject(type, data));
        }
        
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
                
                subObj = await SceneManager.CreateObject(objType, eval(`dat.${properties[i].name}`));
            }
            else if ((["boolean", "number", "string", "object"]).includes(properties[i].type)) subObj = eval(`dat.${properties[i].name}`);
            else if (properties[i].type === "array") subObj = await SceneManager.CreateObjectArray(eval(`dat.${properties[i].name}`));
            else subObj = await SceneManager.CreateObject(properties[i].type, eval(`dat.${properties[i].name}`));
            
            eval(`object.${properties[i].name} = subObj`);
        }
        
        if (name != null) object.name = name;
        
        return object;
    }
    
    static Set (resources)
    {
        this.UnloadAll();
        
        this.#unloadedRes = resources;
    }
    
    static Unload (...path)
    {
        for (let i = 0; i < path.length; i++)
        {
            const res = this.#resources.find(item => item.path === path[i]);

            if (res == null) continue;

            res.obj.Unload();

            const index = this.#resources.indexOf(res);

            this.#resources.splice(index, 1);
        }
    }
    
    static UnloadAll ()
    {
        for (let i = 0; i < this.#resources.length; i++) this.#resources[i].obj.Unload();

        this.#resources = [];
    }
    
    static Find (path)
    {
        const res = this.#resources.find(item => item.path === path);
        
        return res?.obj;
    }
    
    static async Load (...path)
    {
        for (let i = 0; i < path.length; i++)
        {
            const data = this.#unloadedRes.find(item => item.path === path[i]);

            if (data == null || this.#resources.find(item => item.path === path) != null) continue;

            const obj = await this.#ToObject(
                path[i].split("/").slice(-1)[0],
                data.type,
                data.args
            );

            this.#resources.push({
                path : path[i],
                obj : obj
            });
        }
    }
}
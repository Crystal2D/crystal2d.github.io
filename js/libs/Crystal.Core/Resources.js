class Resources
{
    static #unloadedRes = new Map();
    static #resources = new Map();
    static #prefabs = [];

    static keepOnLoad = [];
    
    static async #ToObject (name, type, data)
    {
        const dat = data ?? { };
        
        let object = null;
        
        const foundClass = CrystalEngine.Inner.GetClassOfType(type, 1);
        
        if (foundClass == null) return;
        
        const construction = foundClass.construction;
        const properties = foundClass.args;
        
        if (construction != null)
        {
            const evalCall = new AsyncFunction("data", "toObject", construction);
            
            object = await evalCall(dat, async (type, data) => await SceneManager.CreateObject(type, data));
        }
        else object = eval(`new ${type}()`);
        
        for (let i = 0; i < properties.length; i++)
        {
            const dataIn = eval(`dat.${properties[i].name}`);
            
            if (typeof properties[i] !== "object" || dataIn === undefined) continue;
            
            let subObj = null;
            
            if (properties[i].evaluation != null)
            {
                const evalCall = new AsyncFunction("data", properties[i].evaluation);
                
                subObj = await evalCall(dataIn);
            }
            else if (properties[i].evalType != null)
            {
                const evalCall = new AsyncFunction("data", properties[i].evalType);
                const objType = await evalCall(dataIn);
                
                subObj = await SceneManager.CreateObject(objType, dataIn);
            }
            else if ((["bool", "number", "string", "object"]).includes(properties[i].type)) subObj = dataIn;
            else if (properties[i].array) subObj = await SceneManager.CreateObjectArray(properties[i].type, dataIn);
            else subObj = await SceneManager.CreateObject(properties[i].type, dataIn);
            
            eval(`object.${properties[i].name} = subObj`);
        }
        
        if (name != null) object.name = name;
        
        return object;
    }
    
    static Set (resources)
    {
        this.UnloadAll();

        const applyPrefab = obj => {
            obj.__isPrefab = true;

            for (let i = 0; i < obj.children?.length ?? 0; i++) applyPrefab(obj.children[i]);
        };

        this.#prefabs = resources.filter(item => item.type === "GameObject").map(item => {
            const obj = item.args;
            applyPrefab(obj);

            return {
                path: item.path,
                obj: obj
            };
        });

        this.#unloadedRes = new Map(resources.filter(item => item.type !== "GameObject").map(item => [item.path, item]));
    }
    
    static Unload (...path)
    {
        for (let i = 0; i < path.length; i++)
        {
            const res = this.#resources.get(path[i]);

            if (res == null) continue;

            res.Unload();

            const keepinIndex = this.keepOnLoad.indexOf(path[i]);
            if (keepinIndex != null) this.keepOnLoad.splice(keepinIndex, 1);

            this.#resources.delete(path[i]);
        }
    }
    
    static UnloadAll ()
    {
        this.#resources.forEach(item => item.Unload())

        this.#resources = new Map();
        this.keepOnLoad = [];
    }
    
    static Find (path)
    {
        return this.#resources.get(path);
    }

    static FindPrefab (path)
    {
        const prefab = this.#prefabs.find(item => item.path === path);

        return structuredClone(prefab?.obj);
    }
    
    static async Load (...path)
    {
        const pathCount = path.length;
        let pathIndex = 0;
        
        for (let i = 0; i < path.length; i++)
        {
            if (Array.isArray(path[i]))
            {
                (async () => {
                    for (let j = 0; j < path[i].length; j++) await this.Load(path[i][j]);

                    pathIndex++;
                })();

                continue;
            }

            if (this.#resources.has(path)) continue;

            const data = this.#unloadedRes.get(path[i]);

            if (data == null) throw new Error(`Resource Non-existent "${path[i]}"`);

            (async () => {
                const obj = await this.#ToObject(
                    path[i].split("/").slice(-1)[0],
                    data.type,
                    data.args
                );
            
                this.#resources.set(path[i], obj);

                pathIndex++;
            })();
        }

        await CrystalEngine.Wait(() => pathIndex === pathCount);
    }

    static DontDestroyOnLoad (...path)
    {
        this.keepOnLoad.push(...path);
    }

    static DestroyOnLoad (...path)
    {
        for (let i = 0; i < path.length; i++)
        {
            if (path[i] == null) continue;
 
            const index = this.keepOnLoad.indexOf(path[i]);
            this.keepOnLoad.splice(index, 1);
        }
    }
}
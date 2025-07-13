class Resources
{
    static #unloadedRes = [];
    static #resources = [];
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

        this.#prefabs = resources.filter(item => item.type === "GameObject").map(item => {
            const obj = item.args;
            obj.__isPrefab = true;

            return {
                path: item.path,
                obj: obj
            };
        });

        this.#unloadedRes = resources.filter(item => item.type !== "GameObject");
    }
    
    static Unload (...path)
    {
        for (let i = 0; i < path.length; i++)
        {
            const res = this.#resources.find(item => item.path === path[i]);

            if (res == null) continue;

            res.obj.Unload();

            const keepinIndex = this.keepOnLoad.indexOf(path[i]);
            this.keepOnLoad.splice(keepinIndex, 1);

            const resIndex = this.#resources.indexOf(res);
            this.#resources.splice(resIndex, 1);
        }
    }
    
    static UnloadAll ()
    {
        for (let i = 0; i < this.#resources.length; i++) this.#resources[i].obj.Unload();

        this.#resources = [];
        this.keepOnLoad = [];
    }
    
    static Find (path)
    {
        const res = this.#resources.find(item => item.path === path);
        
        return res?.obj;
    }

    static FindPrefab (path)
    {
        const prefab = this.#prefabs.find(item => item.path === path);

        return prefab?.obj;
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

            if (this.#resources.find(item => item.path === path) != null) continue;

            const data = this.#unloadedRes.find(item => item.path === path[i]);

            if (data == null) throw new Error(`Resource Non-existent "${path[i]}"`);

            (async () => {
                const obj = await this.#ToObject(
                    path[i].split("/").slice(-1)[0],
                    data.type,
                    data.args
                );
            
                this.#resources.push({
                    path : path[i],
                    obj : obj
                });

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
            const index = this.keepOnLoad.indexOf(path[i]);
            this.keepOnLoad.splice(index, 1);
        }
    }
}
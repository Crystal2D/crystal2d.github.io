class SceneManager
{
    static #inited = false;
    static #emptyScene = new Scene();
    static #unloadedScenes = [];
    static #scenes = [];
    
    static #activeScene = null;

    static sceneLoaded = new DelegateEvent();
    static sceneUnloaded = new DelegateEvent();
    static activeSceneChanged = new DelegateEvent();

    static get sceneCount ()
    {
        return this.#unloadedScenes.length;
    }

    static get loadedSceneCount ()
    {
        return this.#scenes.filter(item => item.isLoaded).length;
    }
    
    static SetActiveScene (index)
    {
        if (this.GetActiveScene().index === index) return;

        const scene = this.GetScene(index);

        if (scene.isInvalid) return false;

        scene.isDirty = true;

        this.#activeScene = scene;

        this.activeSceneChanged.Invoke();

        return true;
    }

    static GetActiveScene ()
    {
        return this.#activeScene ?? this.#emptyScene;
    }

    static GetScene (index)
    {
        return this.#scenes.find(item => item.index === index && item.isLoaded) ?? new Scene(null, null, true);
    }
    
    static Set (scenes)
    {
        if (this.#inited) return;

        this.#unloadedScenes = scenes;

        this.#inited = true;
    }
    
    static Unload (...index)
    {
        for (let iA = 0; iA < index.length; iA++)
        {
            if (this.GetActiveScene().index === index[iA]) this.#activeScene = null;

            const scene = this.GetScene(index[iA]);

            if (scene.isInvalid) return;

            for (let iB = 0; iB < scene.resources.length; iB++)
            {
                const res = scene.resources[iB];
                const noRes = (this.#scenes.find(item => item.index !== index[iA] && item.resources.find(resItem => resItem === res) != null)) == null;

                if (noRes) Resources.Unload(res);
            }

            const itemIndex = this.#scenes.indexOf(scene);

            this.#scenes.splice(itemIndex, 1);

            this.sceneUnloaded.Invoke();
        }
    }

    static async Load (...index)
    {
        for (let i = 0; i < index.length; i++)
        {
            if (this.#scenes.find(item => item.index === index[i])) return;

            const path = `data/scenes/${this.#unloadedScenes[index[i]]}.json`;
            const response = await fetch(path);
            const data = await response.json();

            const scene = new Scene(data.name, {
                partioning : data.partioning,
                resources : data.resources,
                gameObjects : data.gameObjects,
                path : path,
                index : index[i]
            });

            await Resources.Load(...scene.resources);

            await scene.Load();

            this.#scenes.push(scene);

            this.sceneLoaded.Invoke();
        }
    }
    
    static async CreateObject (type, data)
    {
        const dat = data ?? { };
        
        let object = null;
        
        const foundClass = CrystalEngine.Inner.GetClassOfType(type, 0);
        
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
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
    
    static async SetActiveScene (index)
    {
        let scene = this.GetScene(index);

        if (scene.isInvalid) return false;

        const prevScene = this.#activeScene;
        const prevSceneID = this.#activeScene?.index;

        let keepOnLoad = [];

        if (prevScene != null)
        {
            keepOnLoad = prevScene.gameObjects.filter(item => item.keepOnLoad);

            for (let i = 0; i < keepOnLoad.length; i++)
            {
                const index = prevScene.gameObjects.indexOf(keepOnLoad[i]);

                prevScene.gameObjects.splice(index, 1);
            }

            await this.Unload(prevSceneID);

            if (prevSceneID === index)
            {
                await this.Load(index);

                scene = this.GetScene(index);
            }
        }

        this.#activeScene = scene;

        for (let i = 0; i < keepOnLoad.length; i++)
        {
            prevScene?.tree.Remove(keepOnLoad[i]);

            const renderer = keepOnLoad[i].GetComponent("Renderer");

            if (renderer != null)
            {
                const min = renderer.bounds.min;
                const max = renderer.bounds.max;
                const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

                this.#activeScene.tree.Insert(keepOnLoad[i], rect);
            }

            this.#activeScene.gameObjects.push(keepOnLoad[i]);
        }

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

    static async UnloadAll ()
    {
        await this.Unload(...this.#scenes.map(item => item.index));
    }

    static async Unload (...index)
    {
        for (let i = 0; i < index.length; i++)
        {
            if (this.GetActiveScene().index === index[i])
            {
                for (let i = 0; i < this.#activeScene.gameObjects.length; i++) GameObject.Destroy(this.#activeScene.gameObjects[i]);

                await CrystalEngine.Wait(() => this.#activeScene.gameObjects.length === 0);

                this.#activeScene = null;
            }

            const scene = this.GetScene(index[i]);

            if (scene.isInvalid) continue;

            const resources = scene.resourceList.filter(item => !Resources.keepOnLoad.includes(item) && (this.#scenes.find(subItem => subItem.index !== index[i] && subItem.resourceList.find(resItem => resItem === item) != null)) == null);
            Resources.Unload(...resources);

            const itemIndex = this.#scenes.indexOf(scene);

            this.#scenes.splice(itemIndex, 1);

            this.sceneUnloaded.Invoke();
        }
    }

    static async Load (...index)
    {
        for (let i = 0; i < index.length; i++)
        {
            if (this.#scenes.find(item => item.index === index[i])) continue;

            const path = `data/scenes/${this.#unloadedScenes[index[i]]}.json`;
            const response = await FetchFile(path);
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

    static async EvalProperty (propData, data, out)
    {
        if (typeof propData !== "object" || data === undefined) return;

        let output = null;

        if (propData.gameObject)
        {
            const call = () => {
                if (data.prefab != null) output = Resources.FindPrefab(data.prefab);
                else
                {
                    if (typeof data === "number") output = GameObject.FindByID(data);
                    else output = GameObject.Find(data);
                }

                eval(`out.${propData.realName ?? propData.name} = output`);

                PlayerLoop.onBeforeAwake.Remove(call);
            };

            PlayerLoop.onBeforeAwake.Add(call);

            return;
        }

        if (propData.component)
        {
            let call = null

            if (propData.explicit) call = () => {
                let gameObj = null;

                if (typeof data.gameObject === "number") gameObj = GameObject.FindByID(data.gameObject);
                else gameObj = GameObject.Find(data.gameObject);

                output = gameObj.GetComponent(data.type);

                eval(`out.${propData.realName ?? propData.name} = output`);
                
                PlayerLoop.onBeforeAwake.Remove(call);
            };
            else call = () => {
                let gameObj = null;

                if (typeof data === "number") gameObj = GameObject.FindByID(data);
                else gameObj = GameObject.Find(data);

                output = gameObj.GetComponent(propData.type);

                eval(`out.${propData.realName ?? propData.name} = output`);

                PlayerLoop.onBeforeAwake.Remove(call);
            };

            PlayerLoop.onBeforeAwake.Add(call);

            return;
        }
        
        if (propData.evaluation != null)
        {
            const evalCall = new AsyncFunction("data", propData.evaluation);
            
            output = await evalCall(data);
        }
        else if (propData.evalType != null)
        {
            const evalCall = new AsyncFunction("data", propData.evalType);
            const objType = await evalCall(data);
            
            output = await this.CreateObject(objType, data);
        }
        else if ((["bool", "number", "string", "object"]).includes(propData.type)) output = data;
        else if (propData.array) output = await this.CreateObjectArray(propData.type, data);
        else output = await this.CreateObject(propData.type, data);

        eval(`out.${propData.realName ?? propData.name} = output`);
    }
    
    static async CreateObject (type, data)
    {
        const dat = data ?? { };
        
        let object = null;
        
        const foundClass = CrystalEngine.Inner.GetClassOfType(type, 0);
        
        if (foundClass == null) return;
        
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
            const dataIn = eval(`dat.${properties[i].name}`);

            await this.EvalProperty(properties[i], dataIn, object);
        }
        
        if (dat.name != null && type !== "GameObject") object.name = dat.name;
        
        return object;
    }
    
    static async CreateObjectArray (type, data)
    {
        let objects = [];
        
        for (let i = 0; i < data.length; i++)
        {
            let newObj = null;

            if (type === "array") newObj = await this.CreateObjectArray("bool", data[i]);
            else if (type === "bool" && typeof data[i] === "object" && data[i].__evaluated) newObj = await this.CreateObject(type, data[i]);
            else if ((["bool", "number", "string", "object"]).includes(type)) newObj = data[i];
            else newObj = await this.CreateObject(type, data[i]);
            
            objects.push(newObj);
        }
        
        return objects;
    }
}
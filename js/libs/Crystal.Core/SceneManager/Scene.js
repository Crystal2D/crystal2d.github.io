class Scene
{
    #invalid = false;
    #loaded = false;
    #loadedGameObjs = 0;
    #loadedComponents = 0;
    #res = [];
    #loadComponentCalls = new DelegateEvent();

    #data = null;
    
    name = "scene";
    gameObjects = [];

    tree = null;
    
    get isLoaded ()
    {
        return this.#loaded;
    }

    get loadedComponents ()
    {
        return this.#loadedComponents === this.#loadComponentCalls.count;
    }

    get isInvalid ()
    {
        return this.#invalid;
    }
    
    get path ()
    {
        return this.#data.path;
    }

    get index ()
    {
        return this.#data.index;
    }

    get resources ()
    {
        return this.#data.resources ?? [];
    }

    get resourceList ()
    {
        return this.#res;
    }
    
    constructor (name, data, invalid)
    {
        this.name = name ?? "Scene";
        this.#data = data ?? { };

        for (let i = 0; i < this.resources.length; i++)
        {
            if (Array.isArray(this.resources[i])) this.#res.push(...this.resources[i]);
            else this.#res.push(this.resources[i]);
        }

        if (this.#data.gameObjects == null) this.#data.gameObjects = [];

        this.#invalid = invalid ?? false;
    }
    
    async #LoadComponents (components)
    {
        let output = [];
        
        for (let i = 0; i < components.length; i++) output.push(await SceneManager.CreateObject(components[i].type, components[i].args));
        
        return output;
    }

    #ChangeArgs (a, b)
    {
        const keys = Object.getOwnPropertyNames(b);

        for (let i = 0; i < keys.length; i++)
        {
            if (typeof eval(`b.${keys[i]}`) === "object") this.#ChangeArgs(eval(`a.${keys[i]}`), eval(`b.${keys[i]}`));
            else eval(`a.${keys[i]} = b.${keys[i]}`);
        }
    }

    async LoadComponents ()
    {
        if (this.loadedComponents) return;

        this.#loadComponentCalls.Invoke();

        await CrystalEngine.Wait(() => this.loadedComponents);
    }

    async #LoadGameObjectsBase (data, fromPrefab)
    {
        let prefabData = { };

        if (!fromPrefab && data.prefab != null) prefabData = Resources.FindPrefab(data.prefab);

        const rawComponents = prefabData.components ?? [];
        const objComponents = data.components ?? [];

        for (let i = 0; i < objComponents.length; i++)
        {
            const match = objComponents[i].replace ? rawComponents.find(item => item.type === objComponents[i].type) : null;

            if (match == null)
            {
                rawComponents.push(objComponents[i]);

                continue;
            }
            
            if (match.args == null)
            {
                match.args = objComponents[i].args;

                continue;
            }

            this.#ChangeArgs(match.args, objComponents[i].args);
        }

        let objID = data.id ?? 0;

        while (this.gameObjects.find(item => item.GetSceneID() === objID) != null) objID++;

        const transform = {
            position: data.transform?.position ?? prefabData.transform?.position,
            rotation: data.transform?.rotation ?? prefabData.transform?.rotation,
            scale: data.transform?.scale ?? prefabData.transform?.scale
        };
        
        let objParent = null;
        
        if (data.parent != null) objParent = this.gameObjects.find(element => element.GetSceneID() === data.parent).transform;
        
        const gameObj = await SceneManager.CreateObject("GameObject", {
            name : data.name ?? prefabData.name,
            active : data.active ?? prefabData.active,
            transform : transform,
            id : objID,
            parent : objParent
        });

        gameObj.scene = this;
        this.gameObjects.push(gameObj);
        
        this.#loadComponentCalls.Add(async () => {
            gameObj.components = await this.#LoadComponents(rawComponents);

            const renderer = gameObj.GetComponent(Renderer);

            if (renderer != null)
            {
                const min = renderer.bounds.min;
                const max = renderer.bounds.max;
                const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

                this.tree.Insert(gameObj, rect);
            }

            this.#loadedComponents++;
        });

        if (data.prefab == null && !fromPrefab) return;

        const rawChildren = prefabData.children ?? [];
        const objChildren = data.children ?? [];

        for (let i = 0; i < rawChildren.length; i++)
        {
            const child = rawChildren[i];
            child.parent = objID;

            const match = objChildren.find(item => item.name === child.name);

            if (match != null)
            {
                child.active = match.active ?? child.active;
                child.id = match.id ?? child.id;

                if (child.transform == null) child.transform = match.transform;
                else this.#ChangeArgs(child.transform, match.transform);

                const rawComponents = child.components ?? [];
                const objComponents = match.components ?? [];

                for (let i = 0; i < objComponents.length; i++)
                {
                    const match = objComponents[i].replace ? rawComponents.find(item => item.type === objComponents[i].type) : null;
                
                    if (match == null)
                    {
                        rawComponents.push(objComponents[i]);
                    
                        continue;
                    }

                    if (match.args == null)
                    {
                        match.args = objComponents[i].args;
                    
                        continue;
                    }
                
                    this.#ChangeArgs(match.args, objComponents[i].args);
                }

                child.components = rawComponents;
            }

            await this.#LoadGameObjectsBase(child, true);
        }
    }
    
    async #LoadGameObjects ()
    {
        for (let i = 0; i < this.#data.gameObjects.length; i++)
        {
            const data = structuredClone(this.#data.gameObjects[i]);
            await this.#LoadGameObjectsBase(data);
            this.#loadedGameObjs++;
        }
    }

    async Load ()
    {
        if (this.#loaded || this.#invalid) return;

        const size = new Vector2();

        if (!this.#data.partioning?.disabled)
        {
            size.x = this.#data.partioning?.size?.x ?? 1024;
            size.y = this.#data.partioning?.size?.y ?? 1024;
        }

        const pos = Vector2.Add(
            Vector2.Scale(
                size,
                -0.5
            ),
            new Vector2(
                this.#data.partioning?.offset?.x,
                this.#data.partioning?.offset?.y
            )
        );

        if (this.#data.partioning?.maxDepth != null) QuadTree.maxDepth = this.#data.partioning?.maxDepth;

        this.tree = new QuadTree(new Rect(pos.x, pos.y, size.x, size.y));
        
        this.#LoadGameObjects();

        await CrystalEngine.Wait(() => this.#loadedGameObjs === this.#data.gameObjects.length);
        
        this.#loaded = true;
    }
}
class Scene
{
    #invalid = false;
    #loaded = false;
    #res = [];

    #data = null;
    
    name = "scene";
    gameObjects = [];

    tree = null;
    
    get isLoaded ()
    {
        return this.#loaded;
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
    
    async #LoadObjects ()
    {
        if (this.#data.gameObjects == null) return;

        for (let i = 0; i < this.#data.gameObjects.length; i++)
        {
            const objData = this.#data.gameObjects[i];
            let prefabData = { };

            if (objData.prefab != null) prefabData = Resources.FindPrefab(objData.prefab);

            const rawComponents = structuredClone(prefabData.components ?? []);
            const objComponents = structuredClone(objData.components ?? []);

            for (let i = 0; i < objComponents.length; i++)
            {
                const match = objComponents[i].replace ? rawComponents.find(item => item.type === objComponents[i].type) : null;

                if (match == null)
                {
                    rawComponents.push(objComponents[i])

                    continue;
                }
                
                if (match.args == null)
                {
                    match.args = objComponents[i].args;

                    continue;
                }

                this.#ChangeArgs(match.args, objComponents[i].args);
            }

            const components = await this.#LoadComponents(rawComponents);

            const transform = {
                position: objData.transform?.position ?? prefabData.transform?.position,
                rotation: objData.transform?.rotation ?? prefabData.transform?.rotation,
                scale: objData.transform?.scale ?? prefabData.transform?.scale
            };
            
            let objParent = null;
            
            if (objData.parent != null) objParent = this.gameObjects.find(element => element.GetSceneID() === objData.parent).transform;
            
            const gameObj = await SceneManager.CreateObject("GameObject", {
                name : objData.name ?? prefabData.name,
                components : components,
                active : objData.active ?? prefabData.active,
                transform : transform,
                id : objData.id,
                parent : objParent
            });

            gameObj.scene = this;

            const renderer = gameObj.GetComponent("Renderer");

            if (renderer != null)
            {
                const min = renderer.bounds.min;
                const max = renderer.bounds.max;
                const rect = Rect.MinMaxRect(min.x, min.y, max.x, max.y);

                this.tree.Insert(gameObj, rect);
            }
            
            this.gameObjects.push(gameObj);
        }

        for (let i = 0; i < this.gameObjects; i++) this.gameObjects[i].BroadcastMessage("Awake", null, {
            specialCall : 1,
            passActive : true,
            clearAfter : true
        });
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
        
        await this.#LoadObjects();
        
        this.#loaded = true;
    }
}
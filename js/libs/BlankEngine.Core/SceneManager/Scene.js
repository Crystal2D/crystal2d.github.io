SceneManager.Scene = class
{
    #loaded = false;
    
    #data = null;
    
    name = "scene";
    gameObjects = [];

    tree = null;
    
    get isLoaded ()
    {
        return this.#loaded;
    }
    
    get buildIndex ()
    {
        return this.#data.buildIndex;
    }
    
    get path ()
    {
        return this.#data.path;
    }
    
    constructor (name, data)
    {
        this.name = name ?? "scene";
        this.#data = data ?? { };
        
        this.#Load();
    }
    
    async #Load ()
    {
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

        await this.#LoadRes();
        
        await this.#LoadObjects();
        
        this.#loaded = true;
    }
    
    async #LoadRes ()
    {
        await Resources.Load(...this.#data.resources);
    }
    
    async #LoadComponents (components)
    {
        let output = [];
        
        for (let i = 0; i < components.length; i++) output.push(await SceneManager.CreateObject(components[i].type, components[i].args));
        
        return output;
    }
    
    async #LoadObjects ()
    {
        for (let i = 0; i < this.#data.gameObjects.length; i++)
        {
            const objData = this.#data.gameObjects[i];
            const components = await this.#LoadComponents(objData.components ?? []);
            
            let objParent = null;
            
            if (objData.parent != null) objParent = this.gameObjects.find(element => element.GetSceneID() === objData.parent).transform;
            
            const gameObj = await SceneManager.CreateObject("GameObject", {
                name : objData.name,
                components : components,
                active : objData.active,
                transform : objData.transform,
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
    }
}
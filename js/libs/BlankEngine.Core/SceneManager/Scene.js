SceneManager.Scene = class
{
    #loaded = false;
    
    #data = null;
    
    name = "scene";
    gameObjects = [];
    
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
            
            this.gameObjects.push(gameObj);
        }
    }
}
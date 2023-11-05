SceneManager.Scene = class
{
    #loaded = false;
    
    #data = null;
    
    name = "scene";
    gameObjects = [];
    
    get buildIndex ()
    {
        return this.#data.buildIndex;
    }
    
    get path ()
    {
        return this.#data.path;
    }
    
    get isLoaded ()
    {
        return this.#loaded;
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
        if (this.#data.resources == null) this.#data.resources = [];
        
        for (let i = 0; i < this.#data.resources.length; i++) await Resources.Load(this.#data.resources[i]);
    }
    
    async #LoadObjects ()
    {
        if (this.#data.gameObjects == null) this.#data.gameObjects = [];
        
        let newGameObjs = [];
        
        for (let iA = 0; iA < this.#data.gameObjects.length; iA++)
        {
            let components = [];
            
            for (let iB = 0; iB < this.#data.gameObjects[iA].components.length; iB++)
            {
                let component = await SceneManager.CreateObject(this.#data.gameObjects[iA].components[iB].type, this.#data.gameObjects[iA].components[iB].args);
                
                if (components.length === 0) components[0] = component;
                else components.push(component);
            }
            
            const newGameObj = await SceneManager.CreateObject("GameObject", {
                name : this.#data.gameObjects[iA].name,
                components : components,
                active : this.#data.gameObjects[iA].active,
                transform : this.#data.gameObjects[iA].transform
            });
            
            if (newGameObjs.length === 0) newGameObjs[0] = newGameObj;
            else newGameObjs.push(newGameObj);
        }
        
        this.gameObjects = newGameObjs;
    }
}
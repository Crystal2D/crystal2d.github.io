class SceneManager
{
    static #scenes = [];
    static #activeScene = null;
    static #loaded = false;
    static #unloaded = false;
    
    static get sceneLoaded ()
    {
        return this.#loaded;
    }
    
    static get sceneUnloaded ()
    {
        return this.#unloaded;
    }
    
    static Scene = class
    {
        #data = null;
        #loaded = false;
        
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
            this.#data = data ?? {};
            
            this.#load();
        }
        
        async #toObject (data)
        {
            var object;
            
            switch (data.type)
            {
                case "GameObject":
                    object = await new GameObject(data.name, data.components, data.active);
                    break;
                case "Sprite":
                    if (data.texture == null) throw BlankEngine.ThrowError(0);
                    
                    object = await new Sprite(Resources.Find(data.texture), data.rect);
                    break;
                case "Material":
                    object = await new Material(Shader.Find(data.vertexShader, "VERTEX"), Shader.Find(data.fragmentShader, "FRAGMENT"));
                    break;
                case "SpriteRenderer":
                    if (data.args.sprite == null) throw BlankEngine.ThrowError(0);
                    
                    object = await new SpriteRenderer(await this.#toObject(data.args.sprite), await this.#toObject(data.args.material));
                    break;
            }
            
            if (object == null)
            {
                return console.log("e");
            }
            
            object.name = data.name;
            
            return object;
        }
        
        async #load ()
        {
            await this.#loadRes();
            await this.#loadObjects();
            
            this.#loaded = true;
        }
        
        async #loadRes ()
        {
            if (this.#data.resources == null) this.#data.resources = [];
            
            for (let i = 0; i < this.#data.resources.length; i++)
            {
                await Resources.Load(this.#data.resources[i]);
            }
        }
        
        async #loadObjects ()
        {
            if (this.#data.gameObjects == null) this.#data.gameObjects = [];
            
            var newGameObjs = [];
            
            for (let iA = 0; iA < this.#data.gameObjects.length; iA++)
            {
                var components = [];
                
                for (let iB = 0; iB < this.#data.gameObjects[iA].components.length; iB++)
                {
                    if (components.length == 0) components[0] = await this.#toObject(this.#data.gameObjects[iA].components[iB]);
                    else components.push(await this.#toObject(this.#data.gameObjects[iA].components[iB]));
                }
                
                let newGameObj = await this.#toObject({
                    type : "GameObject",
                    name : this.#data.gameObjects[iA].name,
                    components : components,
                    active : this.#data.gameObjects[iA].active
                });
                
                if (newGameObjs.length == 0) newGameObjs[0] = newGameObj;
                else newGameObjs.push(newGameObjs);
            }
            
            this.gameObjects = await newGameObjs;
        }
    }
    
    static GetActiveScene ()
    {
        return this.#activeScene ?? { isLoaded : false };
    }
    
    static async Set (scenes)
    {
        if (scenes != null && !Array.isArray(scenes)) throw BlankEngine.ThrowError(0);
        
        this.#scenes = await scenes;
    }
    
    static async Load (index)
    {
        this.#activeScene = await new this.Scene(this.#scenes[index].name, {
            resources : this.#scenes[index].resources,
            gameObjects : this.#scenes[index].gameObjects,
            buildIndex : this.#scenes[index].buildIndex,
            path : this.#scenes[index].path
        }) ?? await new this.Scene();
        
        this.#loaded = true;
    }
}
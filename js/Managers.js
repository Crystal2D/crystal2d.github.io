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
        
        async #toObject (type, data)
        {
            if (type == null) throw BlankEngine.ThrowError(0);
            
            if (data == null) return null;
            
            var object;
            
            switch (type)
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
                    if (data.sprite == null) throw BlankEngine.ThrowError(0);
                    
                    object = await new SpriteRenderer(await this.#toObject("Sprite", data.sprite), await this.#toObject("Material", data.material));
                    break;
            }
            
            if (object == null)
            {
                object = eval(`new ${type}()`);
                
                let properties = Object.getOwnPropertyNames(data);
                
                for (let i = 0; i < properties.length; i++)
                {
                    let value = eval(`data.${properties[i]}`);
                    
                    eval(`object.${properties[i]} = value`)
                    
                    if (value != null && value.type != null)
                    {
                        await eval(`object.${properties[i]} = await this.#toObject(value.type, value.args)`);
                    }
                }
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
                    if (components.length == 0) components[0] = await this.#toObject(this.#data.gameObjects[iA].components[iB].type, this.#data.gameObjects[iA].components[iB].args);
                    else components.push(await this.#toObject(this.#data.gameObjects[iA].components[iB].type, this.#data.gameObjects[iA].components[iB].args));
                }
                
                let newGameObj = await this.#toObject("GameObject", {
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
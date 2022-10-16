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
            
            this.#load();
        }
        
        async #toObject (type, data)
        {
            if (type == null) throw BlankEngine.ThrowError(0);
            
            if (data == null) return;
            
            var object;
            
            switch (type)
            {
                case "GameObject":
                    object = await new GameObject(data.name, data.components, data.active, await this.#toObject("Transform", data.transform));
                    break;
                case "Vector2":
                    object = await new Vector2(data.x, data.y);
                    break;
                case "Transform":
                    let pos = data.position ?? { };
                    let sca = data.scale ?? { };
                    
                    object = await new Transform(await new Vector2(pos.x, pos.y), data.rotation, await new Vector2(sca.x, sca.y));
                    break;
                case "Sprite":
                    if (data.texture == null) throw BlankEngine.ThrowError(0);
                    
                    object = await new Sprite(Resources.Find(data.texture), data.rect);
                    break;
                case "Material":
                    if (typeof data == "string") object = await Resources.Find(data);
                    else object = await new Material(await Shader.Find(data.vertexShader, "VERTEX"), await Shader.Find(data.fragmentShader, "FRAGMENT"));
                    break;
                case "Camera":
                    object = new Camera();
                    
                    if (data.orthographicSize != null) object.orthographicSize = data.orthographicSize;
                    break;
                case "SpriteRenderer":
                    if (data.sprite == null) throw BlankEngine.ThrowError(0);
                    
                    object = await new SpriteRenderer(await this.#toObject("Sprite", data.sprite), await this.#toObject("Material", data.material));
                    break;
            }
            
            if (object == null)
            {
                let scripts = BlankEngine.Core.compiledData.scripts;
                var foundClass = false;
                var properties = [];
                
                for (let iA = 0; iA < scripts.length; iA++)
                {
                    for (let iB = 0; iA < scripts[iA].classes.length; iB++)
                    {
                        if (scripts[iA].classes[iB].name != type) continue;
                        
                        properties = scripts[iA].classes[iB].args;
                        
                        foundClass = true;
                        
                        break;
                    }
                    
                    if (!foundClass && iA == scripts.length) throw BlankEngine.ThrowError(3);
                }
                
                object = eval(`new ${type}()`);
                
                for (let i = 0; i < properties.length; i++)
                {
                    if (eval(`data.${properties[i]}`) == null) continue;
                    
                    if (eval(`data.${properties[i]}.type`) != null && eval(`data.${properties[i]}.args`) != null)
                    {
                        let subObj = await eval(`this.#toObject(data.${properties[i]}.type, data.${properties[i]}.args)`);
                        
                        eval(`object.${properties[i]} = subObj`);
                    }
                    else eval(`object.${properties[i]} = data.${properties[i]}`);
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
                    active : this.#data.gameObjects[iA].active,
                    transform : this.#data.gameObjects[iA].transform
                });
                
                if (newGameObjs.length == 0) newGameObjs[0] = newGameObj;
                else newGameObjs.push(newGameObj);
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
SceneManager.Scene = class
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
    
    async #toObject (type, data, constructData)
    {
        if (type == null) throw BlankEngine.ThrowError(0);
        
        if (data == null || constructData == null) return;
        
        let object;
        
        switch (type)
        {
            case "GameObject":
                object = await new GameObject(data.name, data.components, data.active, await this.#toObject("Transform", data.transform, { }));
                break;
            case "Vector2":
                object = await new Vector2(data.x, data.y);
                break;
            case "Transform":
                var pos = data.position ?? { };
                var sca = data.scale ?? { };
                
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
                
                object = await new SpriteRenderer(await this.#toObject("Sprite", data.sprite, { }), await this.#toObject("Material", data.material, { }));
                break;
        }
        
        if (object == null)
        {
            const libs = BlankEngine.Inner.compiledData.libs;
            const scripts = BlankEngine.Inner.compiledData.scripts;
            
            let foundClass = false;
            let construct = [];
            let properties = [];
            let cData = "";
            
            for (let iA = 0; iA < libs.length; iA++)
            {
                for (let iB = 0; iB < libs[iA].scripts.length; iB++)
                {
                    if (libs[iA].scripts[iB].classes == null) continue;
                    
                    for (let iC = 0; iC < libs[iA].scripts[iB].classes.length; iC++)
                    {
                        if (libs[iA].scripts[iB].classes[iC].name != type) continue;
                        
                        construct = libs[iA].scripts[iB].classes[iC].construct;
                        properties = libs[iA].scripts[iB].classes[iC].args;
                        
                        foundClass = true;
                        
                        break;
                    }
                }
            }
            
            for (let iA = 0; iA < scripts.length; iA++)
            {
                if (scripts[iA].classes == null) continue;
                
                for (let iB = 0; iA < scripts[iA].classes.length; iB++)
                {
                    if (scripts[iA].classes[iB].name != type) continue;
                    
                    construct = scripts[iA].classes[iB].construct;
                    properties = scripts[iA].classes[iB].args;
                    
                    foundClass = true;
                    
                    break;
                }
            }
            
            if (!foundClass) throw BlankEngine.ThrowError(3);
            
            for (let i = 0; i < construct.length; i++)
            {
                let subObj = null;
                
                if (eval(`constructData.${construct[i]}`) == null) subObj = eval(`constructData.${construct[i]}`);
                else if (eval(`constructData.${construct[i]}.type`) != null && eval(`constructData.${construct[i]}.args`) != null) subObj = await eval(`this.#toObject(constructData.${construct[i]}.type, constructData.${construct[i]}.args, constructData.${construct[i]}.construct)`);
                else subObj = eval(`constructData.${construct[i]}`);
                
                if (typeof subObj == "string") cData += `"${subObj}"`;
                else cData += `${subObj}`;
                
                if (i != construct.length - 1) cData += ",";
            }
            
            object = eval(`new ${type}(${cData})`);
            
            for (let i = 0; i < properties.length; i++)
            {
                if (eval(`data.${properties[i]}`) === undefined) continue;
                
                if (eval(`data.${properties[i]}.type`) != null && eval(`data.${properties[i]}.args`) != null)
                {
                    let subObj = await eval(`this.#toObject(data.${properties[i]}.type, data.${properties[i]}.args, data.${properties[i]}.construct)`);
                    
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
        
        let newGameObjs = [];
        
        for (let iA = 0; iA < this.#data.gameObjects.length; iA++)
        {
            let components = [];
            
            for (let iB = 0; iB < this.#data.gameObjects[iA].components.length; iB++)
            {
                const component = await this.#toObject(this.#data.gameObjects[iA].components[iB].type, this.#data.gameObjects[iA].components[iB].args, this.#data.gameObjects[iA].components[iB].construct);
                
                if (components.length == 0) components[0] = component;
                else components.push(component);
            }
            
            const newGameObj = await this.#toObject("GameObject", {
                name : this.#data.gameObjects[iA].name,
                components : components,
                active : this.#data.gameObjects[iA].active,
                transform : this.#data.gameObjects[iA].transform
            }, { });
            
            if (newGameObjs.length == 0) newGameObjs[0] = newGameObj;
            else newGameObjs.push(newGameObj);
        }
        
        this.gameObjects = await newGameObjs;
    }
}
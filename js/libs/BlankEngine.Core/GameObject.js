class GameObject
{
    #active = false;
    #name = "Empty Object";
    #components = [];
    
    #id = null;

    scene = null;
    sceneTreeNode = null;
    
    get activeSelf ()
    {
        return this.#active;
    }
    
    get name ()
    {
        return this.#name;
    }
    
    set name (value)
    {
        this.#name = value;
        
        const components = this.#components;
        
        for (let i = 0; i < this.#components.length; i++) components[i].name = this.name;
    }
    
    get transform ()
    {
        return this.#components[0];
    }
    
    set transform (value)
    {
        this.#components[0] = value;
        
        this.#components[0].gameObject = this;
        this.#components[0].name = this.name;
    }
    
    get components ()
    {
        return this.#components;
    }
    
    set components (value)
    {
        let newComps = [this.#components[0]];
        
        for (let i = 0; i < value.length; i++) newComps.push(value[i]);
        
        this.#components = newComps;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            this.#components[i].gameObject = this;
            this.#components[i].name = this.name;
        }
    }
    
    constructor (name, components, active, transform, id)
    {
        this.#id = id;
        this.#name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.#components[0] = transform ?? new Transform();
        this.components = components ?? [];
    }
    
    static Find (name)
    {
        return SceneManager.GetActiveScene().gameObjects.find(element => element.name === name && element.activeSelf);
    }
    
    static FindByID (id)
    {
        return SceneManager.GetActiveScene().gameObjects.find(element => element.GetSceneID() === id);
    }
    
    static FindComponents (type)
    {
        const gameObjs = SceneManager.GetActiveScene().gameObjects.filter(item => item.activeSelf);
        
        let output = [];
        
        for (let i = 0; i < gameObjs.length; i++) output.push(...gameObjs[i].GetComponents(type));
        
        return output;
    }
    
    #IsComponent (item, type, includeInactive)
    {
        if (!(eval(`item instanceof ${type}`)) || (item instanceof Behavior && !item.enabled && !includeInactive)) return false;
        
        return true;
    }
    
    GetSceneID ()
    {
        return this.#id;
    }
    
    SetActive (state)
    {
        this.#active = state;
    }
    
    BroadcastMessage (method, params, data)
    {
        if (!this.#active) return;
        
        let args = "";
        let dat = data ?? { };
        
        if (Array.isArray(params))
        {
            for (let i = 0; i < params.length; i++)
            {
                args += `params[${i}]`;
                
                if (i !== params.length - 1) args += ",";
            }
        }
        else args = params;
        
        const components = this.#components.filter(item => item.enabled && item instanceof GameBehavior);
        
        for (let i = 0; i < components.length; i++)
        {
            eval(`components[i].${method}(${args})`);
            
            if (dat.clearAfter) eval(`components[i].${method} = () => { }`);
            
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    GetComponent (type)
    {
        return this.#components.find(item => this.#IsComponent(item, type, false));
    }
    
    GetComponents (type)
    {
        return this.#components.filter(item => this.#IsComponent(item, type, false));
    }
}
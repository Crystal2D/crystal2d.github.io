class GameObject
{
    #active = false;
    #name = "Empty Object";
    #components = [];
    
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
    
    get activeSelf ()
    {
        return this.#active;
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
    
    constructor (name, components, active, transform)
    {
        this.name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.transform = transform ?? new Transform();
        this.components = components ?? [];
    }
    
    static Find (name)
    {
        return SceneManager.GetActiveScene().gameObjects.find(element => element.name === name);
    }
    
    #IsComponent (item, type, includeInactive)
    {
        if (!(eval(`item instanceof ${type}`)) || (item instanceof Behavior && !item.enabled && !includeInactive)) return false;
        
        return true;
    }
    
    SetActive (state)
    {
        this.#active = state;
    }
    
    BroadcastMessage (method, params, data)
    {
        if (!this.#active) return;
        
        const components = this.#components;
        
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
        
        for (let i = 0; i < components.length; i++)
        {
            if (!components[i].enabled || !(components[i] instanceof GameBehavior)) continue;
            
            eval(`components[i].${method}(${args})`);
            
            if (dat.clearAfter) eval(`components[i].${method} = () => { }`);
            
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    GetComponent (type)
    {
        return this.#components.find(element => this.#IsComponent(element, type, false));
    }
    
    GetComponents (type)
    {
        const components = this.#components;
        
        let newComps = [];
        
        for (let i = 0; i < components.length; i++)
        {
            if (!this.#IsComponent(components[i], type, false)) continue;
            
            if (newComps.length === 0) newComps[0] = components[i];
            else newComps.push(components[i]);
        }
        
        return newComps;
    }
}
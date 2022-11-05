class GameObject
{
    #name = "Empty Object";
    #active = false;
    #components = [new Transform()];
    
    get name ()
    {
        return this.#name;
    }
    
    set name (value)
    {
        this.#name = value;
        
        const components = this.#components;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            components[i].gameObject = this;
            components[i].name = this.name;
        }
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
        
        for (let i = 0; i < value.length; i++)
        {
            const validType = value[i] instanceof Component;
            
            if (!validType) throw BlankEngine.ThrowError(4);
            
            newComps.push(value[i]);
        }
        
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
        
        for (let i = 0; i < this.#components.length; i++)
        {
            this.#components[i].gameObject = this;
            this.#components[i].name = this.name;
        }
    }
    
    constructor (name, components, active, transform)
    {
        if (components != null && !Array.isArray(components)) throw BlankEngine.ThrowError(0);
        
        this.name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.components = components ?? [];
        this.transform = transform ?? new Transform();
    }
    
    SetActive (state)
    {
        this.#active = state;
        
        const components = this.#components;
        
        for (let i = 0; i < this.#components.length; i++)
        {
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    BroadcastMessage (method, params, data)
    {
        if (method == null) throw BlankEngine.ThrowError(0);
        
        if (!this.#active) return;
        
        const components = this.#components;
        
        let args = "";
        let dat = data ?? { };
        
        if (params == null || typeof params == "string") args = params;
        else 
        {
            for (let i = 0; i < params.length; i++)
            {
                args += `params[${i}]`;
                
                if (i != params.length - 1) args += ",";
            }
        }
        
        for (let i = 0; i < components.length; i++)
        {
            let validType = components[i] instanceof GameBehavior;
            
            if (!components[i].enabled || !validType) continue;
            
            eval(`components[i].${method}(${args})`);
            
            if (dat.clearAfter) eval(`components[i].${method} = function () { }`);
            
            components[i].gameObject = this;
            components[i].name = this.name;
        }
    }
    
    GetComponents (type)
    {
        if (type == null) throw BlankEngine.ThrowError(0);
        
        const components = this.#components;
        
        let newComps = [];
        
        for (let i = 0; i < components.length; i++)
        {
            const validType = eval(`components[i] instanceof ${type}`);
            
            if (!validType) continue;
            
            const isBehavior = components[i] instanceof Behavior;
            
            if (isBehavior && !components[i].enabled) continue;
            
            if (newComps.length == 0) newComps[0] = components[i];
            else newComps(components[i]);
        }
        
        return newComps;
    }
}
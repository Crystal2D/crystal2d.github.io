class Component
{
    gameObject = null;
    
    get transform ()
    {
        return this.gameObject.transform;
    }
    
    set transform (value)
    {
        this.gameObject.transform = value;
    }
    
    BroadcastMessage (method, params, data)
    {
        if (!gameObject.activeSelf) return;
        
        const components = this.gameObject.components;
        
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
            
            components[i].gameObject = this.gameObject;
            components[i].name = this.name;
        }
    }
}
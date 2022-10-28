class Component
{
    gameObject = null;
    
    BroadcastMessage (method, params, data)
    {
        if (!gameObject.activeSelf) return;
        
        let components = this.gameObject.components;
        var args = "";
        var data = data ?? { };
        
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
            
            if (data.clearAfter) eval(`components[i].${method} = function () { }`);
            
            components[i].gameObject = this.gameObject;
            components[i].name = this.name;
        }
    }
}
class Component
{
    #gameObj = null;
    
    get transform ()
    {
        return this.#gameObj.transform;
    }
    
    set transform (value)
    {
        this.#gameObj.transform = value;
    }
    
    get gameObject ()
    {
        return this.#gameObj;
    }
    
    set gameObject (value)
    {
        this.#gameObj = value;
    }
    
    BroadcastMessage (method, params, data)
    {
        this.#gameObj.BroadcastMessage(method, params, data);
    }
    
    GetComponent (type)
    {
        return this.#gameObj.GetComponent(type);
    }
    
    GetComponents (type)
    {
        return this.#gameObj.GetComponents(type);
    }

    GetComponentInParent (type)
    {
        return this.#gameObj.GetComponentInParent(type);
    }

    GetComponentsInParent (type)
    {
        return this.#gameObj.GetComponentsInParent(type);
    }
}
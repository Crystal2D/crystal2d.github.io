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
    
    GetComponent (type, includeInactive)
    {
        return this.#gameObj.GetComponent(type, includeInactive);
    }
    
    GetComponents (type, includeInactive)
    {
        return this.#gameObj.GetComponents(type, includeInactive);
    }

    GetComponentInParent (type, includeInactive)
    {
        return this.#gameObj.GetComponentInParent(type, includeInactive);
    }

    GetComponentsInParent (type, includeInactive)
    {
        return this.#gameObj.GetComponentsInParent(type, includeInactive);
    }

    GetComponentInChildren (type, includeInactive)
    {
        return this.#gameObj.GetComponentInChildren(type, includeInactive);
    }

    GetComponentsInChildren (type, includeInactive)
    {
        return this.#gameObj.GetComponentsInChildren(type, includeInactive);
    }
}
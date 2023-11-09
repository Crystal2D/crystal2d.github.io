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
        this.gameObject.BroadcastMessage(method, params, data);
    }
}
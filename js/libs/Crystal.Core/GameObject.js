class GameObject
{
    #active = false;
    #activeOld = false;
    #name = "Empty Object";
    #components = [];
    
    #id = null;

    destroying = false;

    scene = null;
    sceneTreeNode = null;
    
    get activeSelf ()
    {
        return this.#activeOld && this.#active;
    }

    get activeInHierarchy ()
    {
        if (this.transform.parent == null) return this.activeSelf;

        return this.activeSelf && this.transform.parent.gameObject.activeInHierarchy;
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
        return SceneManager.GetActiveScene().gameObjects.find(element => element.name === name && element.activeInHierarchy);
    }
    
    static FindByID (id)
    {
        return SceneManager.GetActiveScene().gameObjects.find(element => element.GetSceneID() === id);
    }
    
    static FindComponents (type)
    {
        const gameObjs = SceneManager.GetActiveScene().gameObjects.filter(item => item.activeInHierarchy);
        
        let output = [];
        
        for (let i = 0; i < gameObjs.length; i++) output.push(...gameObjs[i].GetComponents(type));
        
        return output;
    }

    static Destroy (obj)
    {
        obj.destroying = true;
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
        let args = "";
        let dat = data ?? { };

        // 0 : Normal
        // 1 : Awake
        // 2 : Enable
        // 3 : Disable
        if (dat.specialCall == null) dat.specialCall = 0;

        if (!this.activeSelf && !dat.passActive) return;

        switch (dat.specialCall)
        {
            case 2:
                if (this.#activeOld || !this.#active) return;

                this.#activeOld = true;
                break;
            case 3:
                if (!this.#activeOld || this.#active) return;

                this.#activeOld = false;
                break;
        }
        
        if (Array.isArray(params))
        {
            for (let i = 0; i < params.length; i++)
            {
                args += `params[${i}]`;
                
                if (i !== params.length - 1) args += ",";
            }
        }
        else args = params;
        
        const components = this.#components.filter(item => (item.enabled || dat.specialCall === 1) && item instanceof GameBehavior);

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

    GetComponentInParent (type)
    {
        return this.transform.parent.GetComponent(type);
    }

    GetComponentsInParent (type)
    {
        return this.transform.parent.GetComponents(type);
    }
}
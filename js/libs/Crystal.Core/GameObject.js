class GameObject
{
    #active = false;
    #activeSelfOld = false;
    #activeOld = false;
    #persistent = false;
    #name = "Empty Object";
    #components = [];
    
    #id = null;

    destroying = false;

    scene = null;
    sceneTreeNode = null;
    
    get #parentActive ()
    {
        if (this.transform.parent == null) return true;

        return this.transform.parent.gameObject.activeInHierarchy;
    }

    get activeSelf ()
    {
        return this.#activeSelfOld && this.#active;
    }

    get activeInHierarchy ()
    {
        return this.activeSelf && this.#parentActive && this.#activeOld;
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
        return [...this.#components];
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

    get keepOnLoad ()
    {
        return this.#persistent;
    }

    set keepOnLoad (value)
    {
        this.#persistent = value;

        if (!value || this.#id < 0) return;
        
        let objID = -1;

        while (GameObject.FindByID(objID) != null) objID--;
        
        this.#id = objID;
    }
    
    constructor (name, components, active, transform, id)
    {
        this.#id = id;
        this.#name = name ?? "Empty Object";
        this.#active = active ?? true;
        this.#components[0] = transform ?? new Transform();
        this.components = components ?? [];
    }
    
    static Find (path, includeInactive)
    {
        const pathArray = path.split("/");

        if (pathArray.length === 0) return;

        if (pathArray[0] === "")
        {
            const list = SceneManager.GetActiveScene().gameObjects.filter(item => item.name === pathArray[1] && (includeInactive || item.activeInHierarchy) && item.transform.parent == null);

            if (pathArray.length > 2 && list.length > 0)
            {
                for (let i = 0; i < list.length; i++)
                {
                    const item = list[i].transform.Find(pathArray.slice(2).join("/"));
                
                    if (item == null) continue;
                
                    return item.gameObject;
                }

                return;
            }

            return list[0];
        }

        const list = SceneManager.GetActiveScene().gameObjects.filter(item => item.name === pathArray[0] && (includeInactive || item.activeInHierarchy));

        if (pathArray.length > 1 && list.length > 0)
        {
            for (let i = 0; i < list.length; i++)
            {
                const item = list[i].transform.Find(pathArray.slice(1).join("/"));

                if (item == null) continue;

                return item.gameObject;
            }

            return;
        }

        return list[0];
    }
    
    static FindByID (id)
    {
        return SceneManager.GetActiveScene().gameObjects.find(element => element.GetSceneID() === id);
    }
    
    static FindComponents (type, includeInactive)
    {
        const gameObjs = SceneManager.GetActiveScene().gameObjects.filter(item => item.activeInHierarchy || includeInactive);
        
        let output = [];
        
        for (let i = 0; i < gameObjs.length; i++) output.push(...gameObjs[i].GetComponents(type, includeInactive));
        
        return output;
    }

    static Destroy (obj)
    {
        obj.destroying = true;
    }
    
    #IsComponent (item, type, includeInactive)
    {
        if (typeof type === "string") type = eval(type);

        if (!(item instanceof type) || (item instanceof Behavior && !item.enabled && !includeInactive)) return false;
        
        return true;
    }

    AddComponent (component)
    {
        component.gameObject = this;
        component.name = this.name;

        this.#components.push(component);
    }

    RemoveComponent (component)
    {
        const index = this.#components.indexOf(component);

        if (index < 0) return;

        this.#components.splice(index, 1);

        component.gameObject = null;
        component.name = null;
    }
    
    GetSceneID ()
    {
        return this.#id;
    }
    
    SetActive (state)
    {
        this.#active = state;
    }

    // This is braindamaging
    BroadcastMessageLocal (method, params, data)
    {
        let args = "";
        let dat = data ?? { };

        // 0 : Normal
        // 1 : Awake
        // 2 : Enable
        // 3 : Disable
        if (dat.specialCall == null) dat.specialCall = 0;

        if (!this.activeInHierarchy && !dat.passActive) return;

        switch (dat.specialCall)
        {
            case 2: {
                // if: (SELF) WAS not active & is NOW active
                // then: update active old

                const selfCheck = !this.#activeSelfOld && this.#active;
                if (selfCheck) this.#activeSelfOld = true;
                
                // if: WAS not active & is NOW active
                // then: Enable

                const changed = !this.#activeOld && (this.activeSelf && this.#parentActive);
                if (!changed) return;

                this.#activeOld = true;
            } break;
            case 3: {
                // if: (SELF) WAS active & is NOW not active
                // then: update active old

                const selfCheck = this.#activeSelfOld && !this.#active;
                if (selfCheck) this.#activeSelfOld = false;
                
                // if: WAS active & is NOW not active
                // then: Enable

                const changed = this.#activeOld && !(this.activeSelf && this.#parentActive);
                if (!changed) return;

                this.#activeOld = false;
            } break;
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
    
    BroadcastMessage (method, params, data)
    {
        this.BroadcastMessageLocal(method, params, data);

        const children = this.transform.GetChildren();
        for (let i = 0; i < children.length; i++) children[i].gameObject.BroadcastMessage(method, params, data);
    }
    
    GetComponent (type, includeInactive)
    {
        return this.#components.find(item => this.#IsComponent(item, type, includeInactive));
    }
    
    GetComponents (type, includeInactive)
    {
        return this.#components.filter(item => this.#IsComponent(item, type, includeInactive));
    }

    GetComponentInParent (type, includeInactive)
    {
        const selfComponent = this.GetComponent(type, includeInactive);
        if (selfComponent != null) return selfComponent;

        return this.transform.parent?.GetComponentInParent(type, includeInactive);
    }

    GetComponentsInParent (type, includeInactive)
    {
        let components = [];

        const selfComponent = this.GetComponent(type, includeInactive);
        if (selfComponent != null) components.push(selfComponent);

        if (this.transform.parent != null) components.push(...this.transform.parent.GetComponentsInParent(type, includeInactive));

        return components.filter(item => item != null);
    }

    GetComponentInChildren (type, includeInactive)
    {
        const selfComponent = this.GetComponent(type, includeInactive);
        if (selfComponent != null) return selfComponent;

        const children = this.transform.GetChildren();

        for (let i = 0; i < children.length; i++)
        {
            const component = children[i].GetComponentInChildren(type, includeInactive);
            if (component != null) return component;
        }
    }

    GetComponentsInChildren (type, includeInactive)
    {
        const children = this.transform.GetChildren();
        let components = [];
        
        const selfComponent = this.GetComponent(type, includeInactive);
        if (selfComponent != null) components.push(selfComponent);

        for (let i = 0; i < children.length; i++) components.push(...children[i].GetComponentsInChildren(type, includeInactive));

        return components.filter(item => item != null);
    }
}
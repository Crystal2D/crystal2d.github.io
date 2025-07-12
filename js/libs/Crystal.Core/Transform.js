class Transform extends Component
{
    #rotation = 0;
    #child = [];
    
    #position = Vector2.zero;
    #scale = Vector2.one;
    #lWMat = new Matrix3x3();
    #lWMatInv = new Matrix3x3();
    
    #parent = null;
    
    get localRotation ()
    {
        return this.#rotation;
    }
    
    set localRotation (value)
    {
        if (this.#rotation === value) return;

        this.#rotation = value;
        
        this.Recalc();
    }
    
    get localPosition ()
    {
        return new Vector2(this.#position.x, this.#position.y);
    }
    
    set localPosition (value)
    {
        if (this.#position.Equals(value)) return;

        this.#position = value.Duplicate();
        
        this.Recalc();
    }
    
    get localScale ()
    {
        return new Vector2(this.#scale.x, this.#scale.y);
    }
    
    set localScale (value)
    {
        if (this.#scale.Equals(value)) return;

        this.#scale = value.Duplicate();
        
        this.Recalc();
    }
    
    get rotation ()
    {
        return this.localRotation + (this.parent?.rotation ?? 0);
    }
    
    set rotation (value)
    {
        this.localRotation = value - (this.parent?.rotation ?? 0);
    }
    
    get position ()
    {
        return Vector2.Add(this.localPosition, this.parent?.position ?? Vector2.zero);
    }
    
    set position (value)
    {
        this.localPosition = Vector2.Subtract(value, this.parent?.position ?? Vector2.zero);
    }
    
    get scale ()
    {
        return Vector2.Scale(this.localScale, this.parent?.scale ?? Vector2.one);
    }
    
    set scale (value)
    {
        this.localScale = Vector2.Divide(value, this.parent?.scale ?? Vector2.one);
    }
    
    get childCount ()
    {
        return this.#child.length;
    }
    
    get localToWorldMatrix ()
    {
        return this.#lWMat.Duplicate();
    }
    
    get worldToLocalMatrix ()
    {
        return this.#lWMatInv.Duplicate();;
    }
    
    get parent ()
    {
        return this.#parent;
    }
    
    set parent (value)
    {
        this.SetParent(value);
    }
    
    get gameObject ()
    {
        return super.gameObject;
    }
    
    set gameObject (value)
    {
        super.gameObject = value;
        
        this.#BindData();
    }
    
    #BindData ()
    {
        if (this.#parent == null || this.gameObject == null) return;
        
        this.#parent.AttachChild(this);

        this.#lWMat = Matrix3x3.TRS(
            Vector2.Scale(this.position, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.rotation * Math.PI,
            this.scale
        );
        this.#lWMatInv = this.#lWMat.inverse;
    }
    
    Recalc ()
    {
        this.#lWMat = Matrix3x3.TRS(
            Vector2.Scale(this.position, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.rotation * Math.PI,
            this.scale
        );
        this.#lWMatInv = this.#lWMat.inverse;

        if (this.gameObject != null) this.GetComponent("Renderer")?.RecalcBounds();
        
        for (let i = 0; i < this.childCount; i++) this.GetChild(i).Recalc();
    }
    
    SetParent (parent)
    {
        if (this.#parent === parent) return;
        
        const parentOld = this.#parent;
        
        this.#parent = parent;
        
        if (this.gameObject != null) parentOld?.DetachChildByID(this.gameObject.GetSceneID());
        
        this.#parent = parent;
        
        this.#BindData();
    }
    
    IsChildOf (parent)
    {
        return this.#parent === parent;
    }
    
    Find (path)
    {
        const pathArray = path.split("/");

        if (pathArray.length === 0) return;

        if (pathArray[0] === "") return GameObject.Find(path);

        const list = [];

        for (let i = 0; i < this.childCount; i++)
        {
            const gameObj = GameObject.FindByID(this.#child[i]);

            if (gameObj.name === pathArray[0]) list.push(gameObj.transform);
        }

        if (pathArray.length > 1 && list.length > 0)
        {
            for (let i = 0; i < list.length; i++)
            {
                const item = list[i].Find(pathArray.slice(1).join("/"));

                if (item == null) continue;

                return item;
            }

            return;
        }
        
        return list[0];
    }
    
    DetachChildByID (id)
    {
        let newChild = [];
        
        for (let i = 0; i < this.childCount; i++)
        {
            const child = this.#child[i];
            
            if (child === id)
            {
                const target = this.GetChild(i);
                
                target.parent = null;
                
                target.Recalc();
                
                continue;
            }
            
            newChild.push(child);
        }
        
        this.#child = newChild;
    }
    
    DetachChild (index)
    {
        const id = this.#child[index]; 
        
        this.DetachChildByID(id);
    }
    
    DetachChildren ()
    {
        for (let i = 0; i < this.childCount; i++)
        {
            const child = this.GetChild(i);
            
            child.parent = null;
            
            child.Recalc();
        }
        
        this.#child = [];
    }
    
    AttachChild (child)
    {
        if (child.parent !== this)
        {
            child.parent = this;
            
            child.Recalc();
        }
        
        const id = child.gameObject.GetSceneID();
        
        this.#child.push(id);
    }
    
    AttachChildByID (id)
    {
        const child = GameObject.FindByID(id).transform;
        
        this.AttachChild(child);
    }
    
    GetChild (index)
    {
        const id = this.#child[index];
        
        return GameObject.FindByID(id).transform;
    }

    Duplicate ()
    {
        const output = new Transform();

        output.localPosition = this.#position.Duplicate();
        output.localRotation = this.#rotation;
        output.localScale = this.#scale.Duplicate();

        for (let i = 0; i < this.childCount; i++) this.Instantiate(GameObject.FindByID(this.#child[i]), output);

        return output;
    }
}
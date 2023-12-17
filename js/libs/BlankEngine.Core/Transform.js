class Transform extends Component
{
    #rotation = 0;
    #child = [];
    
    #position = Vector2.zero;
    #scale = Vector2.one;
    #lWMat = new Matrix3x3();
    #lWMatInv = new Matrix3x3();
    
    #parent = null;
    
    get rotation ()
    {
        return this.#rotation;
    }
    
    set rotation (value)
    {
        this.#rotation = value;
        
        this.Recalc();
    }
    
    get position ()
    {
        return this.#position;
    }
    
    set position (value)
    {
        this.#position = value;
        
        this.Recalc();
    }
    
    get scale ()
    {
        return this.#scale;
    }
    
    set scale (value)
    {
        this.#scale = value;
        
        this.Recalc();
    }
    
    get localRotation ()
    {
        return this.rotation + (this.parent?.rotation ?? 0);
    }
    
    set localRotation (value)
    {
        this.rotation = value - (this.parent?.rotation ?? 0);
    }
    
    get localPosition ()
    {
        return Vector2.Add(this.position, this.parent?.position ?? Vector2.zero);
    }
    
    set localPosition (value)
    {
        this.position = Vector2.Subtract(value, this.parent?.position ?? Vector2.zero);
    }
    
    get localScale ()
    {
        return Vector2.Scale(this.scale, this.parent?.scale ?? Vector2.one);
    }
    
    set localScale (value)
    {
        this.scale = Vector2.Divide(value, this.parent?.scale ?? Vector2.one);
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
    
    constructor ()
    {
        super();
    }
    
    #BindData ()
    {
        if (this.#parent == null || this.gameObject == null) return;
        
        this.#parent.AttachChild(this);
    }
    
    Recalc ()
    {
        this.#lWMat = Matrix3x3.TRS(
            this.localPosition,
            5.555555555555556e-3 * this.localRotation * Math.PI,
            this.localScale
        );
        this.#lWMatInv = this.#lWMat.inverse;
        
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
    
    Find (name)
    {
        let output = null;
        
        this.#child.find(element => {
            const gameObj = GameObject.FindByID(element);
            
            if (gameObj.name !== name) return false;
            
            output = gameObj.transform;
            
            return true;
        });
        
        return output;
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
            
            if (newChild.length === 0) newChild[0] = child;
            else newChild.push(child);
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
        const id = child.gameObject.GetSceneID();
        
        if (child.parent === this) return;
        
        child.parent = this;
        
        child.Recalc();
        
        if (this.childCount === 0) this.#child[0] = id;
        else this.#child.push(id);
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
}
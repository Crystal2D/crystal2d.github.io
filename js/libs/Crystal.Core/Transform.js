class Transform extends Component
{
    #rotation = 0;
    #child = [];
    
    #position = Vector2.zero;
    #globalPosition = Vector2.zero;
    #scale = Vector2.one;
    #globalScale = Vector2.zero;
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
        return this.#globalPosition.Duplicate();
    }
    
    set position (value)
    {
        if (this.#globalPosition.Equals(value)) return;

        if (this.#parent == null)
        {
            this.localPosition = value;
            return;
        }

        const rotatedPos = Vector2.Divide(
            Vector2.Subtract(value, this.#parent.position),
            this.#parent.lossyScale
        );
        const rotation = -this.#parent.rotation / (180 / Math.PI);
        this.localPosition = new Vector2(
            rotatedPos.x * Math.cos(rotation) - rotatedPos.y * Math.sin(rotation),
            rotatedPos.x * Math.sin(rotation) + rotatedPos.y * Math.cos(rotation)
        );
    }
    
    get lossyScale ()
    {
        return this.#globalScale.Duplicate();
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

    #Calc ()
    {
        if (this.#parent == null)
        {
            this.#globalPosition = this.#position;
            this.#globalScale = this.#scale;
        }
        else
        {
            const rotation = this.#parent.rotation / (180 / Math.PI);
            this.#globalPosition = Vector2.Add(
                this.#parent.position,
                Vector2.Scale(
                    new Vector2(
                        this.#position.x * Math.cos(rotation) - this.#position.y * Math.sin(rotation),
                        this.#position.x * Math.sin(rotation) + this.#position.y * Math.cos(rotation)
                    ),
                    this.#parent.lossyScale
                )
            );
            this.#globalScale = Vector2.Scale(this.#scale, this.#parent.lossyScale);
        }

        this.#lWMat = Matrix3x3.TRS(
            Vector2.Scale(this.#globalPosition, new Vector2(1, -1)),
            5.555555555555556e-3 * -this.rotation * Math.PI,
            this.#globalScale
        );
        this.#lWMatInv = this.#lWMat.inverse;
    }
    
    #BindData ()
    {
        if (this.gameObject == null) return;
        if (this.#parent == null)
        {
            this.#Calc();
            return;
        }
        
        this.#parent.AttachChild(this, true);

        this.#Calc();

        for (let i = 0; i < this.childCount; i++) this.GetChild(i).Recalc();
    }
    
    Recalc ()
    {
        this.#Calc();

        if (this.gameObject != null)
        {
            this.GetComponent(Renderer)?.RecalcBounds();
            this.GetComponent(Camera)?.RecalcBounds();
        }
        
        for (let i = 0; i < this.childCount; i++) this.GetChild(i).Recalc();
    }
    
    SetParent (parent)
    {   
        if (this.#parent === parent) return;
        
        const parentOld = this.#parent;
        this.#parent = parent;
        
        if (this.gameObject != null) parentOld?.DetachChildByID(this.gameObject.GetSceneID());
        
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
        const index = this.#child.indexOf(id);

        if (index < 0) return;

        this.#child.splice(index, 1);

        const child = GameObject.FindByID(id);

        if (child.parent !== this) return;
            
        child.parent = null;
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
        }
        
        this.#child = [];
    }
    
    AttachChild (child, bind)
    {
        const id = child.gameObject.GetSceneID();

        if (child.parent !== this) child.parent = this;
        
        if (bind && !this.HasChild(id)) this.#child.push(id);
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

    HasChild (id)
    {
        return this.#child.includes(id);
    }

    GetChildren ()
    {
        return this.#child.map(item => GameObject.FindByID(item).transform);
    }

    Duplicate ()
    {
        const output = new Transform();

        output.localPosition = this.#position.Duplicate();
        output.localRotation = this.#rotation;
        output.localScale = this.#scale.Duplicate();

        for (let i = 0; i < this.childCount; i++) this.Instantiate(GameObject.FindByID(this.#child[i]), output, null, null, true);

        return output;
    }
}
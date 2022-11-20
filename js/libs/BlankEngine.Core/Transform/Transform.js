class Transform extends Component
{
    position = new Vector2();
    rotation = 0;
    scale = new Vector2();
    
    get localToWorldMatrix ()
    {
        const gOTrans = this.gameObject.transform;
        const output = Matrix3x3.TRS(gOTrans.position, gOTrans.rotation * Math.PI / 180, gOTrans.scale);
        
        return output;
    }
    
    get worldToLocalMatrix ()
    {
        
    }
    
    constructor (position, rotation, scale)
    {
        super();
        
        this.position = position ?? new Vector2();
        this.rotation = rotation ?? 0;
        this.scale = scale ?? new Vector2();
    }
}
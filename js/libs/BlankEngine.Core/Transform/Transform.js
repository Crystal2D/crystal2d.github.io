class Transform extends Component
{
    rotation = 0;
    
    position = new Vector2();
    scale = new Vector2();
    
    get localToWorldMatrix ()
    {
        const output = Matrix3x3.TRS(this.position, 5.555555555555556e-3 * this.rotation * Math.PI, this.scale);
        
        return output;
    }
    
    get worldToLocalMatrix ()
    {
        return localToWorldMatrix.inverse;
    }
    
    constructor (position, rotation, scale)
    {
        super();
        
        this.position = position ?? Vector2.zero;
        this.rotation = rotation ?? 0;
        this.scale = scale ?? Vector2.one;
    }
}
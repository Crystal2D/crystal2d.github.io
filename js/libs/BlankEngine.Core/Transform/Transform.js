class Transform extends Component
{
    position = new Vector2();
    rotation = 0;
    scale = new Vector2();
    
    get localToWorldMatrix ()
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
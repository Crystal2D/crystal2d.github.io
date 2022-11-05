class Rect
{
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    
    get rectArray ()
    {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        
        return new Float32Array([x, y, x + w, y, x, y + h, x, y + h, x + w, y, x + w, y + h]);
    }
    
    get position ()
    {
        return new Vector2(this.x, this.y);
    }
    
    set position (value)
    {
        if (value == null) throw BlankEngine.ThrowError(0);
        
        this.x = value.x;
        this.y = value.y
    }
    
    get size ()
    {
        return new Vector2(this.width, this.height);
    }
    
    set size (value)
    {
        if (value == null) throw BlankEngine.ThrowError(0);
        
        this.width = value.x;
        this.height = value.y
    }
    
    constructor (x, y, width, height)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.width = width ?? 1;
        this.height = height ?? 1;
    }
    
    Set (x, y, width, height)
    {
        if (x == null || y == null || width == null || height == null) throw BlankEngine.ThrowError(0);
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    toString ()
    {
        return `${this.x}, ${this.y}, ${this.width}, ${this.height}`;
    }
}
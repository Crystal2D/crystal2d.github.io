class Rect
{
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    
    get xMin ()
    {
        return this.x;
    }
    
    set xMin (value)
    {
        const max = this.xMax;
        
        this.x = value;
        
        this.width = max - this.x;
    }
    
    get yMin ()
    {
        return this.y;
    }
    
    set yMin (value)
    {
        const max = this.yMax;
        
        this.y = value;
        
        this.height = max - this.y;
    }
    
    get xMax ()
    {
        return this.x + this.width;
    }
    
    set xMax (value)
    {
        this.width = value - this.x;
    }
    
    get yMax ()
    {
        return this.y + this.height;
    }
    
    set yMax (value)
    {
        this.height = value - this.y;
    }
    
    get position ()
    {
        return new Vector2(this.x, this.y);
    }
    
    set position (value)
    {
        this.x = value.x;
        this.y = value.y;
    }
    
    get size ()
    {
        return new Vector2(this.width, this.height);
    }
    
    set size (value)
    {
        this.width = value.x;
        this.height = value.y;
    }
    
    get center ()
    {
        return new Vector2(this.x + 0.5 * this.width, this.y + 0.5 * this.height)
    }
    
    set center (value)
    {
        this.x = value.x - 0.5 * this.width;
        this.y = value.y - 0.5 * this.height;
    }
    
    constructor (x, y, width, height)
    {
        this.Set(x ?? 0, y ?? 0, width ?? 1, height ?? 1);
    }
    
    toString ()
    {
        return `${this.x}, ${this.y}, ${this.width}, ${this.height}`;
    }
    
    Set (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
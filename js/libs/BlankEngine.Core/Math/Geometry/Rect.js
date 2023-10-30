class Rect
{
    x = 0;
    y = 0;
    width = 1;
    height = 1;
    xMin = 0;
    yMin = 0;
    center = new Vector2();
    
    get xMax ()
    {
        return this.width;
    }
    
    set xMax (value)
    {
        this.width = value;
    }
    
    get yMax ()
    {
        return this.height;
    }
    
    set yMax (value)
    {
        this.height = value;
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
    
    constructor (x, y, width, height)
    {
        this.Set(x ?? 0, y ?? 0, width ?? 1, height ?? 1);
    }
    
    Set (x, y, width, height)
    {
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
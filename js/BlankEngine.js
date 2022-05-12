function BlankEngine ()
{
    ThrowError(1);
}

class Vector2
{
    constructor (x, y)
    {
        this.x = x ?? 0.0;
        this.y = y ?? 0.0;
    }
    
    Set (x, y)
    {
        if (x == null || y == null) return ThrowError(0);
        
        this.x = x;
        this.y = y;
    }
    
    zero ()
    {
        this.Set(0, 0);
    }
    
    one ()
    {
        this.Set(1, 1);
    }
    
    up ()
    {
        this.Set(0, 1);
    }
    
    down ()
    {
        this.Set(0, -1);
    }
    
    left ()
    {
        this.Set(-1, 0);
    }
    
    right ()
    {
        this.Set(1, 0);
    }
    
    magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    normalized ()
    {
        return (this.x / this.sqrMagnitude() + this.y / this.sqrMagnitude()) ?? 0.0;
    }
}

class Color
{
    constructor (r, g, b, a)
    {
        this.r = r ?? 0.0;
        this.g = g ?? 0.0;
        this.b = b ?? 0.0;
        this.a = a ?? 1.0;
    }
    
    grayscale ()
    {
        let value = (this.r * 0.3 + this.g * 0.59 + this.b * 0.11);
        
        return new Color(value, value, value, this.a);
    }
}
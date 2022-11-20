class Color
{
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    
    get grayscale ()
    {
        let value = (this.r * 0.3 + this.g * 0.59 + this.b * 0.11);
        
        return new Color(value, value, value, this.a);
    }
    
    constructor (r, g, b, a)
    {
        this.r = r ?? 0;
        this.g = g ?? 0;
        this.b = b ?? 0;
        this.a = a ?? 1;
    }
    
    Set (r, g, b, a)
    {
        if (r == null || g == null || b == null) throw BlankEngine.Err(0);
        
        this.r = r;
        this.g = g;
        this.b = b;
        
        if (a != null) this.a = a;
    }
    
    toString ()
    {
        return `${this.r}, ${this.g}, ${this.b}, ${this.a}`;
    }
}
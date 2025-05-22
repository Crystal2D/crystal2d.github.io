class Color
{
    static get black ()
    {
        return new Color();
    }

    static get white ()
    {
        return new Color(1, 1, 1);
    }

    static get red ()
    {
        return new Color(1, 0, 0);
    }

    static get green ()
    {
        return new Color(0, 1, 0);
    }

    static get blue ()
    {
        return new Color(0, 0, 1);
    }
    
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    
    get grayscale ()
    {
        let value = this.r * 0.3 + this.g * 0.59 + this.b * 0.11;
        
        return new Color(value, value, value, this.a);
    }
    
    constructor (r, g, b, a)
    {
        this.Set(r, g, b, a ?? 1);
    }
    
    toString ()
    {
        return `${this.r.toFixed(2)}, ${this.g.toFixed(2)}, ${this.b.toFixed(2)}, ${this.a.toFixed(2)}`;
    }
    
    Set (r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        
        if (a != null) this.a = a;
    }

    Equals (other)
    {
        return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
    }
    
    Duplicate ()
    {
        return new Color(this.r, this.g, this.b, this.a);
    }
}
class Bounds
{
    center = null;
    extents = null;
    
    get size ()
    {
        return Vector2.Scale(this.extents, 2);
    }
    
    set size (value)
    {
        this.extents = Vector2.Scale(value, 0.5);
    }
    
    get min ()
    {
        return Vector2.Subtract(this.center, this.extents);
    }
    
    set min (value)
    {
        this.SetMinMax(value, this.max);
    }
    
    get max ()
    {
        return Vector2.Add(this.center, this.extents);
    }
    
    set max (value)
    {
        this.SetMinMax(this.min, value);
    }
    
    constructor (center, size)
    {
        this.center = center ?? Vector2.zero;
        this.size = size ?? Vector2.one;
    }
    
    Contains (point)
    {
        return point.x >= this.min.x && point.x <= this.max.x && point.y >= this.min.y && point.y <= this.max.y;
    }
    
    ClosestPoint (point)
    {
        return new Vector2(Math.clamp(point.x, this.min.x, this.max.x), Math.clamp(point.y, this.min.y, this.max.y))
    }
    
    Expand (amount)
    {
        if (typeof amount === "number") this.extents = Vector2.Add(this.extents, 0.5 * amount);
        else this.extents = Vector2.Add(this.extents, Vector2.Scale(amount, 0.5));
    }
    
    Intersects (bounds)
    {
        return bounds.min.x <= this.max.x && bounds.max.x >= this.min.x && bounds.min.y <= this.max.y && bounds.max.y >= this.min.y;
    }
    
    SetMinMax (min, max)
    {
        this.extents = Vector2.Scale(Vector2.Subtract(max, min), 0.5);
        this.center = Vector2.Add(min, this.extents);
    }
    
    SqrDistance (point)
    {
        const end = this.ClosestPoint(point);
        
        return (point.x - end.center.x) ** 2 + (point.y - end.center.y) ** 2;
    }
    
    toString ()
    {
        return `Center: ${this.center.toString()}, Extents: ${this.extents.toString()}`;
    }
}
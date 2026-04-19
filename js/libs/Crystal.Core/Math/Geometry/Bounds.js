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
    
    Contains (value)
    {
        if (value instanceof Bounds) return this.Contains(value.min) && this.Contains(value.max);
        
        return value.x >= this.min.x && value.x <= this.max.x && value.y >= this.min.y && value.y <= this.max.y;
    }
    
    ClosestPoint (point)
    {
        return new Vector2(
            Math.clamp(point.x, this.min.x, this.max.x),
            Math.clamp(point.y, this.min.y, this.max.y)
        );
    }
    
    Intersects (bounds)
    {
        return bounds.min.x <= this.max.x && bounds.max.x >= this.min.x && bounds.min.y <= this.max.y && bounds.max.y >= this.min.y;
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
    
    SetMinMax (min, max)
    {
        this.extents = Vector2.Scale(Vector2.Subtract(max, min), 0.5);
        this.center = Vector2.Add(min, this.extents);
    }
    
    Encapsulate (value)
    {
        if (value instanceof Bounds)
        {
            this.Encapsulate(Vector2.Subtract(value.center, value.extents));
            this.Encapsulate(Vector2.Add(value.center, value.extents));
            
            return;
        }
        
        this.SetMinMax(
            Vector2.Min(this.min, value),
            Vector2.Max(this.max, value)
        );
    }
    
    Expand (amount)
    {
        this.extents = Vector2.Add(
            this.extents,
            Vector2.Scale(
                new Vector2(0.5, 0.5),
                amount
            )
        );
    }

    Duplicate ()
    {
        return new Bounds(this.center.Duplicate(), this.size.Duplicate());
    }
}
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

    get min ()
    {
        return new Vector2(this.xMin, this.yMin);
    }

    set min (value)
    {
        this.xMin = value.x;
        this.yMin = value.y;
    }

    get max ()
    {
        return new Vector2(this.xMax, this.yMax);
    }

    set max (value)
    {
        this.xMax = value.x;
        this.yMax = value.y;
    }
    
    constructor (x, y, width, height)
    {
        this.Set(x ?? 0, y ?? 0, width ?? 1, height ?? 1);
    }

    static MinMaxRect (xmin, ymin, xmax, ymax)
    {
        return new Rect(xmin, ymin, xmax - xmin, ymax - ymin);
    }

    Contains (value)
    {
        if (value instanceof Rect) return this.Contains(value.min) && this.Contains(value.max);

        return (value.x >= this.xMin) && (value.x < this.xMax) && (value.y >= this.yMin) && (value.y < this.yMax);
    }

    Overlaps (other)
    {
        return (other.xMax > this.xMin && other.xMin < this.xMax && other.yMax > this.yMin && other.yMin < this.yMax);
    }
    
    toString ()
    {
        return `${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.width.toFixed(2)}, ${this.height.toFixed(2)}`;
    }
    
    Set (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
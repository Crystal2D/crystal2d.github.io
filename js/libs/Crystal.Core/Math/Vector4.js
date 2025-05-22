class Vector4
{
    static get zero ()
    {
        return new Vector4();
    }

    static get one ()
    {
        return new Vector4(1, 1, 1, 1);
    }
    
    x = 0;
    y = 0;
    z = 0;
    w = 0;
    
    get magnitude ()
    {
        return Math.sqrt(this.sqrMagnitude);
    }
    
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    
    get normalized ()
    {
        return new Vector4(
            (this.x / this.magnitude) || 0,
            (this.y / this.magnitude) || 0,
            (this.z / this.magnitude) || 0,
            (this.w / this.magnitude) || 0
        );
    }
    
    get abs ()
    {
        return new Vector4(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w));
    }
    
    constructor (x, y, z, w)
    {
        this.Set(x ?? 0, y ?? 0, z ?? 0, w ?? 0);
    }
    
    static Distance (a, b)
    {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 + (a.w - b.w) ** 2);
    }

    static Dot (lhs, rhs)
    {
        return (lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w)
    }

    static Min (lhs, rhs)
    {
        return new Vector4(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y), Math.min(lhs.z, rhs.z), Math.min(lhs.w, rhs.w));
    }

    static Max (lhs, rhs)
    {
        return new Vector4(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y), Math.max(lhs.z, rhs.z), Math.max(lhs.w, rhs.w));
    }

    static Clamp (value, min, max)
    {
        return Vector4.Min(Vector4.Max(value, min), max);
    }

    static Abs (value)
    {
        return value.abs;
    }
    
    static Add (a, b)
    {
        if (typeof b === "number") return new Vector4(a.x + b, a.y + b, a.z + b, a.w + b);
        
        return new Vector4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
    }
    
    static Subtract (a, b)
    {
        if (typeof b === "number") return new Vector4(a.x - b, a.y - b, a.z - b, a.w - b);
        
        return new Vector4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
    }
    
    static Scale (a, b)
    {
        if (typeof b === "number") return new Vector4(a.x * b, a.y * b, a.z * b, a.w * b);
        
        return new Vector4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
    }
    
    static Divide (a, b)
    {
        if (typeof b === "number") return new Vector4(a.x / b, a.y / b, a.z / b, a.w / b);
        
        return new Vector4(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
    }

    static Lerp (a, b, t)
    {
        return new Vector4(
            Math.Lerp(a.x, b.x, t),
            Math.Lerp(a.y, b.y, t),
            Math.Lerp(a.z, b.z, t),
            Math.Lerp(a.w, b.w, t)
        );
    }

    static LerpUnclamped (a, b, t)
    {
        return new Vector4(
            Math.LerpUnclamped(a.x, b.x, t),
            Math.LerpUnclamped(a.y, b.y, t),
            Math.LerpUnclamped(a.z, b.z, t),
            Math.LerpUnclamped(a.w, b.w, t)
        );
    }
    
    toString ()
    {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)}, ${this.w.toFixed(2)})`;
    }
    
    Equals (other)
    {
        return this.x == other.x && this.y == other.y && this.z == other.z && this.w == other.w;
    }

    Greater (other)
    {
        const inv = [
            this.x < other.x,
            this.y < other.y,
            this.z < other.z,
            this.w < other.w
        ];

        const output = [
            this.x > other.x && !inv[0],
            this.y > other.y && !inv[1],
            this.z > other.z && !inv[2],
            this.w > other.w && !inv[3]
        ];

        return output[0] || output[1] || output[2] || output[3];
    }
    
    Normalize ()
    {
        const normed = this.normalized;
        
        this.x = normed.x;
        this.y = normed.y;
        this.z = normed.z;
        this.w = normed.w;
    }
    
    Set (x, y, z, w)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
}
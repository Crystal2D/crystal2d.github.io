class Ray
{
    #direction = null;
    
    origin = null;
    
    get direction ()
    {
        return this.#direction;
    }
    
    set direction (value)
    {
        this.#direction = value.normalized;
    }
    
    constructor (origin, direction)
    {
        this.origin = origin ?? Vector2.zero;
        this.direction = direction ?? Vector2.zero;
    }
    
    GetPoint (distance)
    {
        return Vector2.Add(this.origin, Vector2.Scale(this.#direction, distance));
    }
    
    toString ()
    {
        return `Origin: ${this.origin.toString()}, Dir: ${this.#direction.toString()}`;
    }
}
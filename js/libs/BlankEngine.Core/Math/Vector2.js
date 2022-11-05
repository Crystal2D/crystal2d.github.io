/**
 * Used to represent 2D vectors, positions and points
 * 
 * @public
 * @class
 */
class Vector2
{
    // Static Properties
    
    /**
     * Shorthand for Vector2(0, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get zero ()
    {
        return new Vector2(0, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get one ()
    {
        return new Vector2(1, 1);
    }
    
    /**
     * Shorthand for Vector2(0, 1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get up ()
    {
        return new Vector2(0, 1);
    }
    
    /**
     * Shorthand for Vector2(0, -1)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get down ()
    {
        return new Vector2(0, -1);
    }
    
    /**
     * Shorthand for Vector2(-1, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get left ()
    {
        return new Vector2(-1, 0);
    }
    
    /**
     * Shorthand for Vector2(1, 0)
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @type {Vector2}
     */
    static get right ()
    {
        return new Vector2(1, 0);
    }
    
    
    // Properties
    
    /**
     * The X component of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @type {number}
     */
    x = 0;
    
    /**
     * The Y component of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @type {number}
     */
    y = 0;
    
    /**
     * (Read Only)
     * Returns the length of this vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {number}
     */
    get magnitude ()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns the squared length of this vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {number}
     */
    get sqrMagnitude ()
    {
        return (this.x * this.x + this.y * this.y);
    }
    
    /**
     * (Read Only)
     * Returns this vector with a magnitude of 1
     * 
     * @memberof Vector2
     * 
     * @public
     * @readonly
     * @type {Vector2}
     */
    get normalized ()
    {
        return new Vector2(this.x / this.magnitude || 0.0, this.y / this.magnitude || 0.0);
    }
    
    
    // Constructor
    
    /**
     * Creates a new Vector2 with given x and y components
     * 
     * @memberof Vector2
     * 
     * @param {number} x - The X component of the vector
     * @param {number} y - The Y component of the vector
     */
    constructor (x, y)
    {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }
    
    
    // Static Methods
    
    /**
     * Returns the distance of a and b
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} a - The first vector
     * @param {Vector2} b - The second vector
     * 
     * @returns {number}
     */
    static Distance (a, b)
    {
        const x = a.x - b.x;
        const y = a.y - b.y;
        
        return Math.sqrt(x * x + y * y);
    }
    
    /**
     * Returns the dot product of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {number}
     */
    static Dot (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return (lhs.x * rhs.x + lhs.y * rhs.y)
    }
    
    /**
     * Returns a vector made of the smallest components of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {Vector2}
     */
    static Min (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
    }
    
    /**
     * Returns a vector made of the largest components of two vectors
     * 
     * @memberof Vector2
     * 
     * @public
     * @static
     * @method
     * 
     * @param {Vector2} lhs - The left hand side of the equation
     * @param {Vector2} rhs - The right hand side of the equation
     * 
     * @returns {Vector2}
     */
    static Max (lhs, rhs)
    {
        if (lhs == null || rhs == null) throw BlankEngine.ThrowError(0);
        
        return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
    }
    
    
    // Methods
    
    /**
     * Sets the x and y components of the vector
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @param {number} x - The X component of the vector
     * @param {number} y - The Y component of the vector
     */
    Set (x, y)
    {
        if (x == null || y == null) throw BlankEngine.ThrowError(0);
        
        this.x = x;
        this.y = y;
    }
    
    /**
     * Returns a string format of this vector
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @returns {string}
     */
    toString ()
    {
        return `(${this.x}, ${this.y})`;
    }
    
    /**
     * Compares this vector with another Vector2, returns true if the vectors are equal
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     * 
     * @param {Vector2} other - The vector you want to compare with
     * 
     * @returns {boolean}
     */
    Equals (other)
    {
        return this.x == other.x && this.y == other.y;
    }
    
    /**
     * Makes this vector have a magnitude of 1
     * 
     * @memberof Vector2
     * 
     * @public
     * @method
     */
    Normalize ()
    {
        const magnitude = this.magnitude;
        
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }
}
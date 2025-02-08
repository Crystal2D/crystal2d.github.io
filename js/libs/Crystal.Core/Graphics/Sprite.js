class Sprite
{
    pivot = new Vector2(0.5, 0.5);
    
    texture = null;
    rect = null;
    
    get pixelPerUnit ()
    {
        return this.texture.pixelPerUnit;
    }
    
    get triangles ()
    {
        return [
            0, 2, 1,
            2, 3, 1
        ];
    }
    
    get vertices ()
    {
        const rect = new Rect(
            this.rect.x / this.texture.width, 
            this.rect.y / this.texture.height,
            this.rect.width / this.texture.width,
            this.rect.height / this.texture.height
        );
        
        return [
            new Vector2(rect.x, rect.y),
            new Vector2(rect.xMax, rect.y),
            new Vector2(rect.x, rect.yMax),
            new Vector2(rect.xMax, rect.yMax)
        ];
    }
    
    constructor (name, texture, rect)
    {
        this.name = name;
        this.texture = texture;
        this.rect = rect ?? new Rect(0, 0, texture.width, texture.height);
    }
    
    Duplicate ()
    {
        const output = new Sprite(this.name, this.texture, this.rect);
        
        output.pivot = this.pivot;
        
        return output;
    }
}
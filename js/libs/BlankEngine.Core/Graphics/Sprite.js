class Sprite
{
    texture = null;
    rect = new Rect();
    
    constructor (texture, rect)
    {
        if (texture == null) throw BlankEngine.Err(0);
        
        this.texture = texture;
        this.rect = rect ?? new Rect();
    }
}
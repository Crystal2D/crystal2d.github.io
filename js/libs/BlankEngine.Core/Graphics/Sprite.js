class Sprite
{
    texture = null;
    rect = null;
    
    constructor (texture, rect)
    {
        this.texture = texture;
        this.rect = rect ?? new Rect();
    }
}
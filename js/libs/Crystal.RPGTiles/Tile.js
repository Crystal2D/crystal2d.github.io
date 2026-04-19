class Tile
{   
    palette = "";
    spriteID = 0;
    position = Vector2.zero;

    sprite = null;

    constructor (palette, spriteID, position)
    {
        this.palette = palette;
        this.spriteID = spriteID ?? 0;
        this.position = position ?? Vector2.zero;
    }

    Duplicate ()
    {
        return new Tile(this.palette, this.spriteID, this.position);
    }
}
class FontGlyph
{
    character = "";
    
    rect = null;
    
    constructor (character, rect)
    {
        this.character = character ?? "";
        this.rect = rect ?? new Rect();
    }
}
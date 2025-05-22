class FontAtlas
{
    forcedLineHeight = true;
    lineHeight = 16;
    
    texture = null;
    
    constructor (texture, glyphs)
    {
        this.texture = texture;
        
        for (let i = 0; i < glyphs.length; i++)
        {
            const sprite = new Sprite(glyphs[i].character, this.texture, glyphs[i].rect);
            
            this.texture.sprites.push(sprite);
        }
    }

    Unload () { }
    
    GetGlyph (character)
    {
        return this.texture.sprites.find(item => item.name === character);
    }
}
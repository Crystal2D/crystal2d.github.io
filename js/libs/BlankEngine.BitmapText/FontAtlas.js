class FontAtlas
{
    #glyphs = [];
    
    lineHeight = 20;
    
    texture = null;
    
    constructor (texture, glyphs)
    {
        this.texture = texture;
        
        const initSpriteCount = this.texture.sprites.length;
        
        for (let i = 0; i < glyphs.length; i++)
        {
            const sprite = new Sprite(this.texture, glyphs[i].rect);
            
            const spriteCount = initSpriteCount + i;
            
            if (spriteCount === 0) this.texture.sprites[0] = sprite;
            else this.texture.sprites.push(sprite);
            
            const glyph = {
                character : glyphs[i].character,
                index : spriteCount
            };
            
            if (i === 0) this.#glyphs[0] = glyph;
            else this.#glyphs.push(glyph);
        }
    }
    
    GetGlyph (character)
    {
        const index = this.#glyphs.find(element => element.character === character).index;
        
        return this.texture.sprites[index];
    }
}
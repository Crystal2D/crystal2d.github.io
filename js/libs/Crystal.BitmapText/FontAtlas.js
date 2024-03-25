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
            
            this.texture.sprites.push(sprite);
            
            this.#glyphs.push({
                character : glyphs[i].character,
                index : spriteCount
            });
        }
    }
    
    GetGlyph (character)
    {
        const index = this.#glyphs.find(element => element.character === character).index;
        
        return this.texture.sprites[index];
    }
}
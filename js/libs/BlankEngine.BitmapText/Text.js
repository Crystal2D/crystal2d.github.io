class Text extends DynamicRenderer
{
    #meshChanged = false;
    #overflowX = false;
    #overflowY = false;
    #tempHeight = 0;
    #width = 4;
    #height = 1;
    #size = 1;
    #text = "";
    #words = [];
    #widths = [];
    
    #boundsSize = Vector2.zero;
    #boundsOffset = Vector2.zero;
    #scale = Vector2.one;
    #scalePos = Vector2.zero;
    
    #font = null;
    #colorOld = null;
    
    horizontalAlign = 0;
    verticalAlign = 0;
    characters = [];
    
    pivot = new Vector2(0.5, 0.5);
    
    get meshChanged ()
    {
        return this.#meshChanged;
    }
    
    get bounds ()
    {
        const scale = Vector2.Scale(
            this.transform.localScale,
            this.#boundsSize
        );
        const pivot = this.pivot;
        const offset = this.#boundsOffset;
        
        let pos = this.transform.localPosition;
        
        switch (this.horizontalAlign)
        {
            case 0:
                pos.x += offset.x;
                break;
            case 2:
                pos.x -= offset.x;
                break
        }
        
        switch (this.verticalAlign)
        {
            case 0:
                pos.y += offset.y;
                break;
            case 2:
                pos.y -= offset.y;
                break
        }
        
        return new Bounds(
            Vector2.Add(
                pos,
                Vector2.Scale(
                    scale,
                    new Vector2(
                        0.5 - pivot.x,
                        pivot.y - 0.5
                    )
                )
            ),
            scale
        );
    }
    
    get fontSize ()
    {
        return this.#size;
    }
    
    set fontSize (value)
    {
        this.#size = value;
        
        this.#ReloadScale();
        
        this.#meshChanged = true;
    }
    
    get font ()
    {
        return this.#font;
    }
    
    set font (value)
    {
        this.#font = value;
        
        this.#ReloadWords();
        this.#ReloadScale();
    }
    
    get width ()
    {
        return this.#width;
    }
    
    set width (value)
    {
        this.#width = value;
        
        this.#meshChanged = true;
    }
    
    get height ()
    {
        return this.#height;
    }
    
    set height (value)
    {
        this.#height = value;
        
        this.#meshChanged = true;
    }
    
    get overflowWidth ()
    {
        return this.#overflowX;
    }
    
    set overflowWidth (value)
    {
        this.#overflowX = value;
        
        this.#meshChanged = true;
    }
    
    get overflowHeight ()
    {
        return this.#overflowY;
    }
    
    set overflowHeight (value)
    {
        this.#overflowY = value;
        
        this.#meshChanged = true;
    }
    
    get text ()
    {
        return this.#text;
    }
    
    set text (value)
    {
        if (this.#text === value) return;

        this.#text = value;
        
        this.#ReloadWords();
    }
    
    get pixelPerUnit ()
    {
        return this.font.texture.pixelPerUnit;
    }
    
    #Word = class
    {
        lineBreak = false;
        space = false;
        width = 0;
        height = 0;
        sprites = [];
        
        Add (sprite)
        {
            if (this.sprites.length === 0) this.sprites[0] = sprite;
            else this.sprites.push(sprite);
        }
        
        Update ()
        {
            let x = 0;
            let y = 0;
            
            for (let i = 0; i < this.sprites.length; i++)
            {
                const rect = this.sprites[i].rect;
                
                x += rect.width;
                
                if (y < rect.height) y = rect.height;
            }
            
            this.width = x;
            this.height = y;
        }
    }
    
    constructor (font, material)
    {
        super(material);
        
        this.Reload();
        
        this.font = font;
    }
    
    #NewChar (sprite, pos)
    {
        const vertices = sprite.vertices;
        const tris = sprite.triangles;
        
        let rectArray = [];
        
        for (let i = 0; i < tris.length; i++)
        {
            const vertex = vertices[tris[i]];
            const index = i * 2;
            
            rectArray[index] = vertex.x;
            rectArray[index + 1] = vertex.y;
        }
        
        const rectPos = vertices[0];
        
        const center = new Vector2(
            ((rectPos.x + 0.5 * (vertices[3].x - rectPos.x)) - 0.5) * this.#scale.x,
            ((rectPos.y + 0.5 * (vertices[3].y - rectPos.y)) - 0.5) * this.#scale.y
        );
        
        const newChar = new TextChar();

        
        newChar.trisCount = tris.length;
        newChar.rectArray = rectArray;
        
        newChar.initialOffset = Vector2.Add(
            this.#scalePos,
            center
        );
        newChar.position = pos;
        
        newChar.color = this.#colorOld.Duplicate();
        
        return newChar;
    }
    
    #RenderSprite (sprite, trisCount, rectArray, glyphOffset, color, pivot)
    {
        const gl = this.material.gl;
        
        const offset = Vector2.Add(
            glyphOffset,
            pivot
        );
        
        const localMatrix = Matrix3x3.Multiply(
            this.localSpaceMatrix,
            Matrix3x3.TRS(
                Vector2.Scale(offset, -1),
                0,
                this.#scale
            )
        );
        
        this.material.color = color;
        
        this.material.SetMatrix(this.uMatrixID,
            localMatrix.matrix[0][0],
            localMatrix.matrix[0][1],
            localMatrix.matrix[0][2],
            localMatrix.matrix[1][0],
            localMatrix.matrix[1][1],
            localMatrix.matrix[1][2],
            localMatrix.matrix[2][0],
            localMatrix.matrix[2][1],
            localMatrix.matrix[2][2]
        );
        
        this.material.SetBuffer(this.geometryBufferID, rectArray);
        
        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.font.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, trisCount);
        
        gl.useProgram(null);
    }
    
    #ReloadWords ()
    {
        const text = this.#text;
        
        let newWords = [new this.#Word()];
        
        for (let i = 0; i < text.length; i++)
        {
            const lineBreak = text[i] === "\n";
            
            let sprite = null;
            
            if (!lineBreak) sprite = this.font.GetGlyph(text[i]);
            
            if (text[i] === " ")
            {
                if (i !== 0 && !newWords[newWords.length - 1].space)
                {
                    newWords[newWords.length - 1].Update();
                    
                    newWords.push(new this.#Word());
                }
                
                newWords[newWords.length - 1].Add(sprite);
                
                newWords[newWords.length - 1].space = true;
                
                continue;
            }
            else if (lineBreak)
            {
                if (i !== 0)
                {
                    newWords[newWords.length - 1].Update();
                    
                    newWords.push(new this.#Word());
                }
                
                newWords[newWords.length - 1].lineBreak = true;
                
                newWords.push(new this.#Word());
                
                continue;
            }
            
            if (newWords[newWords.length - 1].space)
            {
                newWords[newWords.length - 1].Update();
                
                newWords.push(new this.#Word());
            }
            
            newWords[newWords.length - 1].Add(sprite);
        }
        
        newWords[newWords.length - 1].Update();
        
        this.#words = newWords;
        
        this.#meshChanged = true;
    }
    
    #ReloadScale ()
    {
        const ppu = this.pixelPerUnit / this.#size;
        const texture = this.font.texture;
        const texX = texture.width;
        const texY = texture.height;
        
        let scale = null;
        let ppuScaler = 0;
        
        if (texX > texY)
        {
            scale = new Vector2(1, texY / texX);
            
            ppuScaler = texX / ppu;
        }
        else
        {
            scale = new Vector2(texX / texY, 1);
            
            ppuScaler = texY / ppu;
        }
        
        this.#scale = Vector2.Scale(scale, ppuScaler);
        this.#scalePos = Vector2.Scale(
            Vector2.Subtract(
                Vector2.one,
                this.#scale
            ),
            -0.5
        );
    }
    
    #GetWordChars (sprites, pos)
    {
        const ppu = this.pixelPerUnit / this.#size;
        
        let x = pos.x;
        let chars = [];
        
        for (let i = 0; i < sprites.length; i++)
        {
            const sprite = sprites[i];
            const width = sprite.rect.width / ppu;
            
            const newChar = this.#NewChar(
                sprite,
                new Vector2(
                    x - ((1 - width) * 0.5),
                    -pos.y
                )
            );
            
            if (i === 0) chars[0] = newChar;
            else chars.push(newChar);
            
            x += width;
        }
        
        return chars;
    }
    
    ForceMeshUpdate ()
    {
        this.#colorOld = this.color;
        
        const ppu = this.pixelPerUnit / this.#size;
        const defaultLH = this.font.lineHeight / ppu;
        
        let x = 0;
        let y = 0;
        let lineHeight = defaultLH;
        let chars = [];
        let widths = [
            {
                size : 0,
                count : 0
            }
        ];
        let bestWidth = 0;
        
        for (let iA = 0; iA < this.#words.length; iA++)
        {
            const word = this.#words[iA];
            
            if (word.lineBreak)
            {
                const currentWidth = widths[widths.length - 1].size;
                
                if (currentWidth > bestWidth) bestWidth = currentWidth;
                
                y += lineHeight;
                x = 0;
                lineHeight = defaultLH;
                
                widths.push({
                    size : 0,
                    count : 0
                });
                
                continue;
            }
            
            const width = word.width / ppu;
            const wrapX = !this.#overflowX && x + width > this.#width;
            
            if (x === 0 && wrapX && !word.space)
            {
                const sprites = word.sprites;
                
                let stop = false;
                
                for (let iB = 0; iB < sprites.length; iB++)
                {
                    const sprite = sprites[iB];
                    const charWidth = sprite.rect.width / ppu;
                    const charWX = !this.overflowWidth && x + charWidth > this.#width;
                    
                    if (charWX)
                    {
                        const currentWidth = widths[widths.length - 1].size;
                        
                        if (currentWidth > bestWidth) bestWidth = currentWidth;
                        
                        y += lineHeight;
                        x = 0;
                        lineHeight = defaultLH;
                        
                        widths.push({
                            size : 0,
                            count : 0
                        });
                    }
                    
                    const charHeight = sprite.rect.height / ppu;
                    
                    if (lineHeight < charHeight) lineHeight = charHeight;
                    
                    if (!this.overflowHeight && y + charHeight > this.#height)
                    {
                        stop = true;
                        
                        break;
                    }
                    
                    const newChar = this.#NewChar(
                        sprite,
                        new Vector2(
                            x - ((1 - charWidth) * 0.5),
                            -y
                        )
                    );
                    
                    if (chars.length === 0) chars[0] = newChar;
                    else chars.push(newChar);
                    
                    x += charWidth;
                    
                    widths[widths.length - 1].size += charWidth;
                    widths[widths.length - 1].count++;
                }
                
                if (stop) break;
                
                continue;
            }
            
            if (wrapX)
            {
                const currentWidth = widths[widths.length - 1].size;
                
                if (currentWidth > bestWidth) bestWidth = currentWidth;
                
                y += lineHeight;
                x = 0;
                lineHeight = defaultLH;
                
                widths.push({
                    size : 0,
                    count : 0
                });
            }
            
            const height = word.height / ppu;
            
            if (lineHeight < height) lineHeight = height;
            
            if (!this.#overflowY && y + lineHeight > this.#height) break;
            
            if (word.space)
            {
                if (x === 0) continue;
                else if (!this.#overflowX)
                {
                    const nextWord = this.#words[iA + 1];
                    
                    if (nextWord == null || x + width + nextWord.width / ppu > this.#width)
                    {
                        const currentWidth = widths[widths.length - 1].size;
                        
                        if (currentWidth > bestWidth) bestWidth = currentWidth;
                        
                        y += lineHeight;
                        x = 0;
                        lineHeight = defaultLH;
                        
                        widths.push({
                            size : 0,
                            count : 0
                        });
                        
                        continue;
                    }
                }
            }
            
            const newChars = this.#GetWordChars(word.sprites, new Vector2(x, y));
            
            if (chars.length === 0) chars = newChars;
            else chars.push(...newChars);
            
            x += width;
            
            widths[widths.length - 1].size += width;
            widths[widths.length - 1].count += word.sprites.length;
        }
        
        const currentWidth = widths[widths.length - 1].size;
        
        if (currentWidth > bestWidth) bestWidth = currentWidth;
        
        y += defaultLH;
        
        this.characters = chars;
        this.#widths = widths;
        this.#tempHeight = y;
        
        const boundsSize = new Vector2(
            bestWidth,
            this.#overflowY ? y : Math.min(y, this.#height)
        );
        
        this.#boundsSize = boundsSize;
        this.#boundsOffset = Vector2.Scale(
            new Vector2(
                boundsSize.x - this.#width,
                this.#height - boundsSize.y
            ),
            0.5
        );
        
        this.#meshChanged = false;
        
        super.ForceMeshUpdate();
    }
    
    Render ()
    {
        if (!this.isLoaded || !this.gameObject.activeSelf) return;
        
        if (this.#colorOld !== this.color) this.ForceMeshUpdate();
        
        const chars = this.characters;
        
        if (chars.length === 0) return;
        
        const widths = this.#widths;
        
        let widthI = 0;
        let widthC = widths[0].count;
        
        const initialPivot = Vector2.Scale(
            new Vector2(this.#width, this.#height),
            this.pivot
        );
        
        let pivot = new Vector2(
            initialPivot.x,
            initialPivot.y + this.font.lineHeight / (this.pixelPerUnit / this.#size)
        );
        
        const tempWidth = widths[0].size;
        
        switch (this.horizontalAlign)
        {
            case 1:
                pivot.x -= (this.#width - tempWidth) * 0.5;
                break;
            case 2:
                pivot.x -= this.#width - tempWidth;
                break;
        }
        
        switch (this.verticalAlign)
        {
            case 1:
                pivot.y -= (this.#height - this.#tempHeight) * 0.5;
                break;
            case 2:
                pivot.y -= this.#height - this.#tempHeight;
                break;
        }
        
        for (let i = 0; i < chars.length; i++)
        {
            if (this.horizontalAlign !== 0)
            {
                if (widthC === 0)
                {
                    widthI++;
                    
                    const width = widths[widthI];
                    
                    widthC = width.count;
                    
                    const tempWidth = width.size;
                    
                    pivot.x = initialPivot.x;
                    
                    switch (this.horizontalAlign)
                    {
                        case 1:
                            pivot.x -= (this.#width - tempWidth) * 0.5;
                            break;
                        case 2:
                            pivot.x -= this.#width - tempWidth;
                            break;
                    }
                }
                
                widthC--;
            }
            
            const currentChar = chars[i];
            
            this.#RenderSprite(
                currentChar.sprite,
                currentChar.trisCount,
                currentChar.rectArray,
                currentChar.offset,
                currentChar.color,
                pivot
            );
        }
    }
}
class Text extends Renderer
{
    #meshChanged = false;
    #remapArrays = false;
    #overflowX = false;
    #overflowY = false;
    #alignX = 0;
    #alignY = 0;
    #tempHeight = 0;
    #width = 8.5;
    #height = 1.5;
    #size = 1;
    #text = "";
    #words = [];
    #widths = [];
    #trisCounts = [];
    #indexes = [];
    
    #boundsSize = Vector2.zero;
    #boundsOffset = Vector2.zero;
    #bounds = new Bounds();
    #scale = Vector2.one;
    
    #font = null;
    #colorOld = null;
    #lineHeight = null;

    characters = [];
    
    pivot = new Vector2(0.5, 0.5);
    
    get meshChanged ()
    {
        return this.#meshChanged;
    }
    
    get bounds ()
    {
        return new Bounds(this.#bounds.center, this.#bounds.size);
    }
    
    get fontSize ()
    {
        return this.#size;
    }
    
    set fontSize (value)
    {
        this.#size = value;
        
        this.#ReloadScale();
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

    get horizontalAlign ()
    {
        return this.#alignX;
    }

    set horizontalAlign (value)
    {
        this.#alignX = value;

        this.#remapArrays = true;
    }

    get verticalAlign ()
    {
        return this.#alignY;
    }

    set verticalAlign (value)
    {
        this.#alignY = value;

        this.#remapArrays = true;
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

    get localToWorldMatrix ()
    {
        return Matrix3x3.Multiply(
            this.transform.localToWorldMatrix,
            Matrix3x3.TRS(
                Vector2.Scale(
                    this.pivot,
                    new Vector2(-this.#width, -this.#height)
                ),
                0,
                this.#scale
            )
        );
    }

    get lineHeight ()
    {
        return this.#lineHeight;
    }

    set lineHeight (value)
    {
        this.#lineHeight = value;

        this.#meshChanged = true;
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
            this.sprites.push(sprite);
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
        const vertexPos = vertices[0];
        const tris = sprite.triangles;
        
        let vertexArray = [];
        let textureArray = [];
        
        for (let i = 0; i < tris.length; i++)
        {
            const vertex = vertices[tris[i]];
            const index = i * 2;
            
            vertexArray[index] = vertex.x - vertexPos.x;
            vertexArray[index + 1] = vertex.y - vertexPos.y;
            
            textureArray[index] = vertex.x;
            textureArray[index + 1] = vertex.y;
        }
        
        const newChar = new TextChar();

        newChar.parent = this;
        
        newChar.trisCount = tris.length;
        newChar.vertexArray = vertexArray;
        newChar.textureArray = textureArray;
        
        newChar.position = pos;
        
        newChar.color = this.#colorOld.Duplicate();
        
        return newChar;
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

        this.#scale = Vector2.Scale(
            texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1),
            texX > texY ? (texX / ppu) : (texY / ppu)
        );

        this.#meshChanged = true;
    }
    
    #GetWordChars (sprites, pos)
    {
        const texX = this.#font.texture.width;

        let x = pos.x;
        let chars = [];

        for (let i = 0; i < sprites.length; i++)
        {
            const sprite = sprites[i];
            const width = sprite.rect.width / texX;
            
            const newChar = this.#NewChar(
                sprite,
                new Vector2(x, -pos.y)
            );
            
            chars.push(newChar);
            
            x += width;
        }
        
        return chars;
    }

    #RemapArrays ()
    {
        const ppu = this.pixelPerUnit / this.#size;
        const maxW = this.#width / (this.#font.texture.width / ppu);
        const maxH = this.#height / (this.#font.texture.height / ppu);
        const widths = this.#widths;
        const offsetY = (maxH - this.#tempHeight) * 0.5 * this.#alignY;
        const chars = this.characters;

        let index = 0;
        let widthI = 0;
        let widthC = widths[0].count;
        let offsetX = (maxW - widths[0].size) * 0.5 * this.#alignX;
        let vertexArray = [];
        let textureArray = [];
        let colorArray = [];
        let trisCounts = [];
        let indexes = [];

        for (let i = 0; i < chars.length; i++)
        {
            if (this.horizontalAlign !== 0)
            {
                if (widthC === 0)
                {
                    widthI++;
                    
                    const width = widths[widthI];
                    
                    widthC = width.count;
                    offsetX = (maxW - width.size) * 0.5 * this.#alignX;
                }
                
                widthC--;
            }

            chars[i].offset = new Vector2(offsetX, offsetY);

            const trisCount = chars[i].trisCount;
            const newIndex = index + trisCount;

            vertexArray.push(...chars[i].localVertexArray);
            textureArray.push(...chars[i].textureArray);
            colorArray.push(...chars[i].colorArray);

            indexes.push(index);
            index = newIndex;
            trisCounts.push(trisCount - 1);
        }

        this.material.SetBuffer(this.geometryBufferID, vertexArray);
        this.material.SetBuffer(this.textureBufferID, textureArray);
        this.material.SetBuffer(this.colorBufferID, colorArray);

        this.#trisCounts = trisCounts;
        this.#indexes = indexes;

        this.#remapArrays = false;
    }

    RecalcBounds ()
    {
        const pivot = this.pivot;
        const offset = this.#boundsOffset;
        
        let pos = Vector2.zero;
        
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
                pos.y -= offset.y;
                break;
            case 2:
                pos.y += offset.y;
                break
        }

        const bounds = new Bounds(
            Vector2.zero,
            this.#boundsSize
        );

        const refMat = this.transform.localToWorldMatrix;
        const pointA = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(bounds.min));
        const pointB = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(new Vector2(bounds.min.x, bounds.max.y)));
        const pointC = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(new Vector2(bounds.max.x, bounds.min.y)));
        const pointD = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(bounds.max));

        bounds.SetMinMax(
            new Vector2(
                Math.min(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.min(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            ),
            new Vector2(
                Math.max(pointA.GetValue(2, 0), pointB.GetValue(2, 0), pointC.GetValue(2, 0), pointD.GetValue(2, 0)),
                Math.max(-pointA.GetValue(2, 1), -pointB.GetValue(2, 1), -pointC.GetValue(2, 1), -pointD.GetValue(2, 1))
            )
        );

        const posMat = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(Vector2.Add(
            pos,
            Vector2.Scale(
                new Vector2(
                    0.5 - pivot.x,
                    0.5 - pivot.y
                ),
                2
            )
        )));

        bounds.center = new Vector2(posMat.GetValue(2, 0), -posMat.GetValue(2, 1))

        this.#bounds = bounds;

        super.RecalcBounds();
    }
    
    ForceMeshUpdate ()
    {
        this.#colorOld = this.color.Duplicate();

        const ppu = this.pixelPerUnit / this.#size;
        const texX = this.#font.texture.width;
        const texY = this.#font.texture.height;
        const rescaleW = texX / ppu;
        const rescaleH = texY / ppu;
        const maxW = this.#width / rescaleW;
        const maxH = this.#height / rescaleH;
        const defaultLH = (this.#lineHeight ?? this.font.lineHeight) / texY;
        
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
                if (!this.#overflowY && y + lineHeight * 2 > maxH) break;

                if (x !== 0)
                {
                    const currentWidth = widths[widths.length - 1].size;
                    
                    if (currentWidth > bestWidth) bestWidth = currentWidth;

                    widths.push({
                        size : 0,
                        count : 0
                    });
                }

                y += lineHeight;
                x = 0;
                lineHeight = defaultLH;
                
                continue;
            }
            
            const width = word.width / texX;
            const wrapX = !this.#overflowX && x + width > maxW;
            
            if (x === 0 && wrapX && !word.space)
            {
                const sprites = word.sprites;
                
                let stop = false;
                
                for (let iB = 0; iB < sprites.length; iB++)
                {
                    const sprite = sprites[iB];
                    const charWidth = sprite.rect.width / texX;
                    const charWX = !this.overflowWidth && x + charWidth > maxW;
                    
                    if (charWX)
                    {
                        if (!this.#overflowY && y + lineHeight * 2 > maxH)
                        {
                            stop = true;

                            break;
                        }

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
                    
                    const charHeight = sprite.rect.height / texY;
                    
                    if (!this.#font.forcedLineHeight && lineHeight < charHeight) lineHeight = charHeight;
                    
                    if (!this.#overflowY && y + lineHeight > maxH)
                    {
                        stop = true;
                        
                        break;
                    }
                    
                    const newChar = this.#NewChar(
                        sprite,
                        new Vector2(x, -y)
                    );
                    
                    chars.push(newChar);
                    
                    x += charWidth;
                    
                    widths[widths.length - 1].size += charWidth;
                    widths[widths.length - 1].count++;
                }
                
                if (stop) break;
                
                continue;
            }
            
            if (wrapX)
            {
                if (!this.#overflowY && y + lineHeight * 2 > maxH) break;

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
            
            const height = word.height / texY;
            
            if (!this.#font.forcedLineHeight && lineHeight < height) lineHeight = height;
            
            if (!this.#overflowY && y + lineHeight > maxH) break;
            
            if (word.space)
            {
                if (x === 0) continue;
                else if (!this.#overflowX)
                {
                    const nextWord = this.#words[iA + 1];
                    
                    if (nextWord == null || x + width + nextWord.width / texX > maxW)
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
            
            chars.push(...newChars);
            
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
            bestWidth * rescaleW,
            (this.#overflowY ? y : Math.min(y, maxH)) * rescaleH
        );
        
        this.#boundsSize = boundsSize;
        this.#boundsOffset = Vector2.Scale(
            new Vector2(
                boundsSize.x - maxW * rescaleW,
                maxH * rescaleH - boundsSize.y
            ),
            0.5
        );
        
        this.#meshChanged = false;

        this.#RemapArrays();
        
        super.ForceMeshUpdate();
    }

    RemapGraphicArrays ()
    {
        this.#remapArrays = true;
    }
    
    Render ()
    {   
        if (!this.#colorOld.Equals(this.color)) this.ForceMeshUpdate();
        
        const chars = this.characters;
        
        if (chars.length === 0) return;

        if (this.#remapArrays) this.#RemapArrays();
        
        const gl = this.material.gl;

        const renderMatrix = this.renderMatrix;
        
        this.material.SetMatrix(this.uMatrixID,
            renderMatrix.matrix[0][0],
            renderMatrix.matrix[0][1],
            renderMatrix.matrix[0][2],
            renderMatrix.matrix[1][0],
            renderMatrix.matrix[1][1],
            renderMatrix.matrix[1][2],
            renderMatrix.matrix[2][0],
            renderMatrix.matrix[2][1],
            renderMatrix.matrix[2][2]
        );

        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        this.material.SetAttribute(this.aTexturePosID, this.textureBufferID);
        this.material.SetAttribute(this.aColorID, this.colorBufferID);
        
        gl.useProgram(this.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.font.texture.GetNativeTexture());
        
        Application.gl_multidraw.multiDrawArraysWEBGL(
            gl.TRIANGLE_STRIP,
            this.#indexes,
            0,
            this.#trisCounts,
            0,
            chars.length
        );
        
        gl.useProgram(null);
    }
}
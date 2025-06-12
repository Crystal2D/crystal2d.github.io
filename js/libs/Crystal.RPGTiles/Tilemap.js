class Tilemap extends Renderer
{
    #loaded = false;
    #meshChanged = true;
    #merging = true;
    #tiles = [];
    #rendersets = [];
    #gridSize = Vector2.zero;
    #bounds = new Bounds(new Vector2(NaN, NaN));
    #transMat = Matrix3x3.identity;

    #colorOld = null;
    #min = null;
    #max = null;
    #sprite = null;

    mergeResolution = 16;

    grid = null;

    get meshChanged ()
    {
        return this.#meshChanged;
    }

    get bounds ()
    {
        return new Bounds(this.#bounds.center, this.#bounds.size);
    }

    get localToWorldMatrix ()
    {
        return Matrix3x3.Multiply(
            this.grid.transform.localToWorldMatrix,
            this.#transMat
        );
    }

    // tells if tilemap is binted
    get mergedRendering ()
    {
        return this.#sprite != null;
    }

    #RenderSet = class
    {
        colorsUpdated = false;
        arraysUpdated = false;
        currentIndex = 0;
        uMatrixID = 0;
        geometryBufferID = 0;
        textureBufferID = 0;
        colorBufferID = 0;
        aVertexPosID = 0;
        aTexturePosID = 0;
        aColorID = 0;
        tiles = [];
        vertexArray = [];
        textureArray = [];
        color = [];
        colorArray = [];
        indexes = [];
        trisCounts = [];
        scaler = Vector2.zero;

        texture = null;
        material = null;
        parent = null;

        #GetArrays (tile)
        {
            const vertices = tile.sprite.vertices;
            const vertexPos = vertices[0];
            const tris = tile.sprite.triangles;

            const pos = Vector2.Divide(
                Vector2.Subtract(
                    this.parent.grid.CellToWorldUnscaled(new Vector2(tile.position.x, -tile.position.y)),
                    Vector2.Divide(
                        Vector2.Scale(
                            new Vector2(tile.sprite.rect.width, tile.sprite.rect.height),
                            tile.sprite.pivot
                        ),
                        this.texture.pixelPerUnit
                    )
                ),
                this.scaler
            );
            
            let vertexArray = [];
            let textureArray = [];
            
            for (let i = 0; i < tris.length; i++)
            {
                const vertex = vertices[tris[i]];
                const index = i * 2;

                vertexArray[index] = vertex.x - vertexPos.x + pos.x;
                vertexArray[index + 1] = vertex.y - vertexPos.y + pos.y;

                textureArray[index] = vertex.x;
                textureArray[index + 1] = vertex.y;
            }

            return {
                vertexArray: vertexArray,
                textureArray: textureArray,
                trisCount: tris.length
            };
        }

        SetMaterial (material)
        {
            this.material?.Unload();

            this.material = material.Duplicate();

            this.material.SetSampler2D("uSampler", 0);
        
            this.uMatrixID = this.material.GetPropertyNameID("uMatrix");
        
            this.geometryBufferID = this.material.AddBuffer("geometry", null, 2);
            this.textureBufferID = this.material.AddBuffer("texture", null, 2);
            this.colorBufferID = this.material.AddBuffer("color", null, 4);

            this.aVertexPosID = this.material.GetAttributeNameID("aVertexPos");
            this.aTexturePosID = this.material.GetAttributeNameID("aTexturePos");
            this.aColorID = this.material.GetAttributeNameID("aColor");
        }

        SetColors (color)
        {
            this.color = color;
            
            this.colorArray = [];

            for (let i = 0; i < this.tiles.length; i++) this.colorArray.push(
                ...color,
                ...color,
                ...color,
                ...color,
                ...color,
                ...color
            );

            this.colorsUpdated = true;
        }

        UpdateMesh ()
        {
            const ppu = this.texture.pixelPerUnit;
            const texX = this.texture.width;
            const texY = this.texture.height;
            const rescaleW = texX / ppu;
            const rescaleH = texY / ppu;

            this.scaler = Vector2.Scale(
                texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1),
                texX > texY ? rescaleW : rescaleH
            );
            
            this.currentIndex = 0;
            this.vertexArray = [];
            this.textureArray = [];
            this.trisCounts = [];
            this.indexes = [];

            for (let i = 0; i < this.tiles.length; i++)
            {
                const arrays = this.#GetArrays(this.tiles[i]);
                this.vertexArray.push(...arrays.vertexArray);
                this.textureArray.push(...arrays.textureArray);
                this.trisCounts.push(arrays.trisCount - 1);
                this.indexes.push(this.currentIndex);

                this.currentIndex += arrays.trisCount;
            }

            this.arraysUpdated = true;

            this.SetColors(this.color);
        }

        Add (tile)
        {
            this.tiles.push(tile);

            const arrays = this.#GetArrays(tile);
            this.vertexArray.push(...arrays.vertexArray);
            this.textureArray.push(...arrays.textureArray);
            this.trisCounts.push(arrays.trisCount - 1);
            this.indexes.push(this.currentIndex);

            this.currentIndex += arrays.trisCount;

            this.colorArray.push(
                ...this.color,
                ...this.color,
                ...this.color,
                ...this.color,
                ...this.color,
                ...this.color
            );

            this.arraysUpdated = true;
            this.colorsUpdated = true;
        }

        Remove (tile)
        {
            const index = this.tiles.indexOf(tile);
            const arrayIndex = index * 12;

            this.tiles.splice(index, 1);
            this.vertexArray.splice(arrayIndex, 12);
            this.textureArray.splice(arrayIndex, 12);
            this.trisCounts.splice(index, 1);
            this.indexes.pop();

            this.currentIndex -= tile.sprite.triangles.length;

            this.colorArray.splice(0, 24);

            this.arraysUpdated = true;
            this.colorsUpdated = true;
        }
    }

    constructor (material)
    {
        super(material);

        this.Reload();
    }

    #RemapColors ()
    {
        this.#colorOld = this.color.Duplicate();

        const color = [
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a
        ];

        if (this.#sprite == null) for (let i = 0; i < this.#rendersets.length; i++) this.#rendersets[i].SetColors(color);
        else this.material.SetBuffer(this.colorBufferID, [
            ...color,
            ...color,
            ...color,
            ...color,
            ...color,
            ...color
        ]);
    }

    #RenderRenderSet (renderset)
    {
        if (renderset.colorsUpdated)
        {
            renderset.material.SetBuffer(renderset.colorBufferID, renderset.colorArray);
            renderset.colorsUpdated = false;
        }

        if (renderset.arraysUpdated)
        {
            renderset.material.SetBuffer(renderset.geometryBufferID, renderset.vertexArray);
            renderset.material.SetBuffer(renderset.textureBufferID, renderset.textureArray);
            renderset.arraysUpdated = false;
        }
        
        const renderMatrix = Matrix3x3.Multiply(
            this.renderMatrix,
            Matrix3x3.Scale(renderset.scaler)
        );

        renderset.material.SetMatrix(renderset.uMatrixID,
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

        renderset.material.SetAttribute(renderset.aVertexPosID, renderset.geometryBufferID);
        renderset.material.SetAttribute(renderset.aTexturePosID, renderset.textureBufferID);
        renderset.material.SetAttribute(renderset.aColorID, renderset.colorBufferID);
        
        const gl = renderset.material.gl;

        gl.useProgram(renderset.material.program);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, renderset.texture.GetNativeTexture());
        
        Application.gl_multidraw.multiDrawArraysWEBGL(
            gl.TRIANGLE_STRIP,
            renderset.indexes,
            0,
            renderset.trisCounts,
            0,
            renderset.tiles.length
        );

        gl.useProgram(null);

        gl.flush();
    }

    Reload ()
    {
        super.Reload();

        for (let i = 0; i < this.#rendersets.length; i++) this.#rendersets[i].SetMaterial(this.material);
    }

    ForceMeshUpdate ()
    {
        if (!this.#loaded) this.grid = this.GetComponentInParent("Grid");

        this.#gridSize = Vector2.Add(this.grid.cellSize, this.grid.cellGap);

        for (let i = 0; i < this.#rendersets.length; i++)
        {
            this.#rendersets[i].SetMaterial(this.material);
            this.#rendersets[i].UpdateMesh();
        }

        this.#meshChanged = false;
        this.#loaded = true;

        this.#RemapColors();
        
        super.ForceMeshUpdate();
    }

    RecalcBounds ()
    {
        if (this.#min == null && this.#max == null)
        {
            super.RecalcBounds();

            return;
        }

        const bounds = new Bounds();
        bounds.SetMinMax(
            this.grid.CellToWorld(Vector2.Add(this.#min, new Vector2(-0.5, -0.5))),
            this.grid.CellToWorld(Vector2.Add(this.#max, new Vector2(0.5, 0.5)))
        );

        this.#bounds = bounds;

        super.RecalcBounds();
    }

    Render ()
    {   
        if (!this.#gridSize.Equals(Vector2.Add(this.grid.cellSize, this.grid.cellGap))) this.ForceMeshUpdate();
        if (!this.#colorOld.Equals(this.color)) this.#RemapColors();

        if (this.#sprite != null)
        {
            this.#RenderMerged();

            return;
        }

        if (this.#rendersets.length > 0) for (let i = 0; i < this.#rendersets.length; i++) this.#RenderRenderSet(this.#rendersets[i]);
        if (this.#merging) this.#Merge();
    }

    #RenderMerged ()
    {
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
        gl.bindTexture(gl.TEXTURE_2D, this.#sprite.texture.GetNativeTexture());
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 5);
        
        gl.useProgram(null);
    }

    GetTile (position)
    {
        return this.#tiles.find(item => item.position.Equals(position));
    }

    async AddTile (tile)
    {
        const existed = this.GetTile(tile.position);

        if (existed != null)
        {
            const existedID = this.#tiles.indexOf(existed);

            if (existed.spriteID === tile.spriteID) return existedID;

            this.RemoveTile(existedID);
        }
        else if (this.#min != null && this.#max != null)
        {
            this.#min = new Vector2(
                Math.min(this.#min.x, tile.position.x),
                Math.min(this.#min.y, tile.position.y)
            );
            this.#max = new Vector2(
                Math.max(this.#max.x, tile.position.x),
                Math.max(this.#max.y, tile.position.y)
            );
        }
        else
        {
            this.#min = new Vector2(tile.position.x, tile.position.y);
            this.#max = new Vector2(tile.position.x, tile.position.y);
        }

        this.#tiles.push(tile);

        let palette = TilePalette.Find(tile.palette);

        if (palette == null)
        {
            await TilePalette.Load(tile.palette);
            palette = TilePalette.Find(tile.palette);
        }

        tile.sprite = palette.sprites.find(item => item.id === tile.spriteID).sprite;

        let renderSet = this.#rendersets.find(item => item.texture === tile.sprite.texture);
        const makeSet = renderSet == null;

        if (makeSet)
        {
            renderSet = new this.#RenderSet();
            renderSet.texture = tile.sprite.texture;
            renderSet.color = [
                this.color.r,
                this.color.g,
                this.color.b,
                this.color.a
            ];
            renderSet.parent = this;

            this.#rendersets.push(renderSet);
        }

        if (this.#loaded)
        {
            if (makeSet)
            {
                renderSet.tiles.push(tile);
                renderSet.SetMaterial(this.material);
                renderSet.UpdateMesh();
            }
            else renderSet.Add(tile);

            this.RecalcBounds();
        }
        else renderSet.tiles.push(tile);

        return this.#tiles.length;
    }

    RemoveTile (id)
    {
        if (id < 0 || id >= this.#tiles.length) return;

        const tile = this.#tiles[id];

        this.#tiles.splice(id, 1);

        for (let i = 0; i < this.#tiles.length; i++)
        {
            const pos = this.#tiles[i].position;

            if (i === 0)
            {
                this.#min = new Vector2(pos.x, pos.y);
                this.#max = new Vector2(pos.x, pos.y);

                continue;
            }

            this.#min = new Vector2(
                Math.min(this.#min.x, pos.x),
                Math.min(this.#min.y, pos.y)
            );
            this.#max = new Vector2(
                Math.max(this.#max.x, pos.x),
                Math.max(this.#max.y, pos.y)
            );
        }

        if (this.#tiles.length === 0)
        {
            this.#min = null;
            this.#max = null;

            this.#bounds = new Bounds(new Vector2(NaN, NaN));
        }

        this.RecalcBounds();

        const renderset = this.#rendersets.find(item => item.texture === tile.sprite.texture);

        if (this.#loaded) renderset.Remove(tile);
        else
        {
            const setID = renderset.tiles.indexOf(tile);
            renderset.tiles.splice(setID, 1);
        }

        if (renderset.tiles.length === 0) this.#rendersets.splice(this.#rendersets.indexOf(renderset), 1);
    }

    RemoveTileByPosition (position)
    {
        const tile = this.GetTile(position);

        if (tile != null) this.RemoveTile(this.#tiles.indexOf(tile));
    }

    async #Merge ()
    {
        this.#merging = false;

        const res = this.mergeResolution;
        const canvas = document.createElement("canvas");
        canvas.width = (this.#max.x - this.#min.x + 1) * this.#gridSize.x * res;
        canvas.height = (this.#max.y - this.#min.y + 1) * this.#gridSize.y * res;
        canvas.style.imageRendering = "pixelated";
        const context = canvas.getContext("2d");
        
        for (let i = 0; i < this.#tiles.length; i++)
        {
            const sprite = this.#tiles[i].sprite;
            const texture = sprite.texture;
            const rect = sprite.rect;

            const pos = new Vector2(
                (this.#tiles[i].position.x - this.#min.x) * this.#gridSize.x,
                (this.#tiles[i].position.y - this.#max.y) * this.#gridSize.y
            )
            const offset = new Vector2(
                (rect.width * 0.5 / sprite.pixelPerUnit) - this.#gridSize.x * 0.5,
                (rect.height * 0.5 / sprite.pixelPerUnit) - this.#gridSize.y * 0.5
            );
            const pivotOffset = Vector2.Scale(
                Vector2.Add(Vector2.Scale(sprite.pivot, -2), 1),
                new Vector2(
                    rect.width * 0.5,
                    rect.height * 0.5
                )
            );
        
            context.imageSmoothingEnabled = false;
            context.drawImage(
                texture.img,
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                (pos.x - offset.x) * res + pivotOffset.x,
                (-pos.y - offset.y) * res + pivotOffset.y,
                rect.width * res / sprite.pixelPerUnit,
                rect.height * res / sprite.pixelPerUnit
            );
        }
        
        const texture = new Texture(canvas.toDataURL("image/png"), "");
        await texture.Load();

        canvas.width = 0;
        canvas.height = 0;
        
        context.reset();

        const sprite = texture.sprites[0];
        const verts = sprite.vertices;
        const tris = sprite.triangles;

        let vertexArray = [];

        for (let i = 0; i < tris.length; i++)
        {
            const vert = verts[tris[i]];

            vertexArray.push(
                vert.x,
                vert.y
            );
        }

        const texX = texture.width;
        const texY = texture.height;
        const rescaleW = texX / res;
        const rescaleH = texY / res;

        this.material.SetBuffer(this.geometryBufferID, vertexArray);
        this.material.SetBuffer(this.textureBufferID, vertexArray);
        
        this.#transMat = Matrix3x3.TRS(
            Vector2.Add(
                new Vector2(
                    -0.5 * rescaleW,
                    -0.5 * rescaleH
                ),
                Vector2.Scale(
                    Vector2.Add(this.#min, this.#max),
                    Vector2.Scale(
                        this.#gridSize,
                        new Vector2(
                            0.5,
                            -0.5
                        )
                    )
                )
            ),
            0,
            Vector2.Scale(
                texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1),
                texX > texY ? rescaleW : rescaleH
            )
        );

        this.#sprite = sprite;

        this.#RemapColors();
    }

    Merge ()
    {
        this.Unmerge();

        this.#merging = true;
    }

    Unmerge ()
    {
        if (!this.mergedRendering) return;

        this.#sprite.texture.Unload();
        this.#sprite = null;

        this.#transMat = Matrix3x3.identity;
    }
}
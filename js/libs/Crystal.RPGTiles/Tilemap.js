class Tilemap extends DynamicRenderer
{
    #loaded = false;
    #meshChanged = true;
    #tiles = [];
    #rendersets = [];
    #gridSize = Vector2.zero;

    #colorOld = null;

    grid = null;

    get meshChanged ()
    {
        return this.#meshChanged;
    }

    get localToWorldMatrix ()
    {
        return this.grid.transform.localToWorldMatrix;
    }

    #RenderSet = class
    {
        currentIndex = 0;
        tiles = [];
        vertexArray = [];
        textureArray = [];
        color = [];
        colorArray = [];
        indexes = [];
        trisCounts = [];
        scaler = Vector2.zero;

        texture = null;
        parent = null;

        #GetArrays (tile)
        {
            const vertices = tile.sprite.vertices;
            const vertexPos = vertices[0];
            const tris = tile.sprite.triangles;

            const pos = Vector2.Divide(
                Vector2.Subtract(
                    this.parent.grid.CellToWorld(new Vector2(tile.position.x, -tile.position.y)),
                    4 / this.texture.pixelPerUnit
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
        }
    }

    constructor (material)
    {
        super(material);

        this.Reload();
    }

    #RemapColors ()
    {
        this.#colorOld = this.color;

        const color = [
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a
        ];

        for (let i = 0; i < this.#rendersets.length; i++) this.#rendersets[i].SetColors(color);
    }

    #RenderRenderSet (renderset)
    {
        const renderMatrix = Matrix3x3.Multiply(
            this.renderMatrix,
            Matrix3x3.Scale(renderset.scaler)
        );

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
        
        this.material.SetBuffer(this.geometryBufferID, renderset.vertexArray);
        this.material.SetBuffer(this.textureBufferID, renderset.textureArray);
        this.material.SetBuffer(this.colorBufferID, renderset.colorArray);

        this.material.SetAttribute(this.aVertexPosID, this.geometryBufferID);
        this.material.SetAttribute(this.aTexturePosID, this.textureBufferID);
        this.material.SetAttribute(this.aColorID, this.colorBufferID);

        const gl = this.material.gl;

        gl.useProgram(this.material.program);
        
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
    }

    ForceMeshUpdate ()
    {
        if (!this.#loaded) this.grid = this.GetComponentInParent("Grid");

        this.#gridSize = Vector2.Add(this.grid.cellSize, this.grid.cellGap);

        for (let i = 0; i < this.#rendersets.length; i++) this.#rendersets[i].UpdateMesh();

        this.#meshChanged = false;
        this.#loaded = true;

        this.#RemapColors();
        
        super.ForceMeshUpdate();
    }

    Render ()
    {
        if (!this.isLoaded || !this.gameObject.activeSelf) return;
        
        if (!this.#gridSize.Equals(Vector2.Add(this.grid.cellSize, this.grid.cellGap))) this.ForceMeshUpdate();

        if (this.#colorOld !== this.color) this.#RemapColors();
        
        if (this.#rendersets.length === 0) return;

        for (let i = 0; i < this.#rendersets.length; i++) this.#RenderRenderSet(this.#rendersets[i]);
        
        this.material.gl.useProgram(null);
    }

    async AddTile (tile)
    {
        const existed = this.#tiles.find(item => item.position.Equals(tile.position));

        if (existed != null)
        {
            const existedID = this.#tiles.indexOf(existed);

            if (existed.spriteID === tile.spriteID) return existedID;

            this.RemoveTile(existedID);
        }

        this.#tiles.push(tile);

        let palette = TilePalette.Find(tile.palette);

        if (palette == null)
        {
            await TilePalette.Load(tile.palette);
            palette = TilePalette.Find(tile.palette);
        }

        tile.sprite = palette.sprites[tile.spriteID];

        let renderSet = this.#rendersets.find(item => item.texture === tile.sprite.texture);

        if (renderSet == null)
        {
            renderSet = new this.#RenderSet();
            renderSet.texture = tile.sprite.texture;
            renderSet.parent = this;

            this.#rendersets.push(renderSet);
        }

        if (this.#loaded) renderSet.Add(tile);
        else renderSet.tiles.push(tile);

        return this.#tiles.length;
    }

    RemoveTile (id)
    {
        if (id < 0 || id >= this.#tiles.length) return;

        const tile = this.#tiles[id];

        this.#tiles.splice(id, 1);

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
        const tile = this.#tiles.find(item => item.position.Equals(position));

        if (tile != null) this.RemoveTile(this.#tiles.indexOf(tile));
    }
}
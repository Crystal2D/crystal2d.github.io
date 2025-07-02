class SpriteRenderer extends Renderer
{
    #changedDrawMode = false;
    #meshChanged = true;
    #drawMode = 0;
    #indexes = [];
    #trisCounts = [];
    
    #boundsSize = Vector2.zero;
    #bounds = new Bounds();
    #transMat = new Matrix3x3();
    
    #sprite = null;
    #spriteOld = null;
    #colorOld = null;
    #size = null;

    get meshChanged ()
    {
        return this.#meshChanged;
    }

    get bounds ()
    {
        return new Bounds(this.#bounds.center, this.#bounds.size);
    }
    
    get sprite ()
    {
        return this.#spriteOld;
    }
    
    set sprite (value)
    {
        this.#sprite = value;
        
        this.Reload();
    }

    get drawMode ()
    {
        return this.#drawMode;
    }

    set drawMode (value)
    {
        this.#drawMode = value;
        this.#changedDrawMode = true;

        this.Reload();
    }

    get localToWorldMatrix ()
    {
        return Matrix3x3.Multiply(
            this.transform.localToWorldMatrix,
            this.#transMat
        );
    }

    get size ()
    {
        return this.#size;
    }

    set size (value)
    {
        this.#size = value;

        this.Reload();
    }
    
    constructor (sprite, material)
    {
        super(material);
        
        this.#sprite = sprite;
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
        const colorArray = [];

        for (let i = 0; i < this.#indexes.length; i++) colorArray.push(
            ...color,
            ...color,
            ...color,
            ...color,
            ...color,
            ...color
        );

        this.material.SetBuffer(this.colorBufferID, colorArray);
    }
    
    Reload ()
    {
        super.Reload();

        this.#spriteOld = this.#sprite;

        const ppu = this.sprite.pixelPerUnit;

        if (this.#size == null) this.#size = Vector2.Divide(Vector2.one, ppu);

        this.#indexes = [];
        this.#trisCounts = [];
        
        const verts = this.sprite.vertices;
        const renderSize = Vector2.Scale(this.#size, ppu);

        if (!renderSize.Equals(Vector2.one))
        {
            const vertBounds = new Bounds();
            vertBounds.SetMinMax(verts[0], verts[3]);
            vertBounds.extents = Vector2.Scale(vertBounds.extents, renderSize);

            verts[0] = vertBounds.min;
            verts[1] = new Vector2(vertBounds.max.x, vertBounds.min.y);
            verts[2] = new Vector2(vertBounds.min.x, vertBounds.max.y);
            verts[3] = vertBounds.max;
        }

        const texVerts = this.sprite.vertices;

        const texX = this.sprite.texture.width;
        const texY = this.sprite.texture.height;
        const tris = this.sprite.triangles;
        
        let currentIndex = 0;
        let vertexArray = [];
        let textureArray = [];
        let vertexPos = verts[0];

        const rescaleW = texX / ppu;
        const rescaleH = texY / ppu;

        this.#boundsSize = new Vector2(
            rescaleW * (verts[3].x - vertexPos.x),
            rescaleH * (verts[3].y - vertexPos.y)
        );

        if (this.#drawMode > 0 && !renderSize.Equals(Vector2.one))
        {
            const ends = [
                Vector2.Add(verts[0], new Vector2(
                    this.sprite.border.x / texX,
                    this.sprite.border.y / texY
                )),
                Vector2.Add(verts[3], new Vector2(
                    -this.sprite.border.z / texX,
                    -this.sprite.border.w / texY
                ))
            ];
            const texEnds = [
                Vector2.Add(texVerts[0], new Vector2(
                    this.sprite.border.x / texX,
                    this.sprite.border.y / texY
                )),
                Vector2.Add(texVerts[3], new Vector2(
                    -this.sprite.border.z / texX,
                    -this.sprite.border.w / texY
                ))
            ];
            const newVerts = [];
            const newTexVerts = [];

            vertexPos = Vector2.Add(
                vertexPos,
                new Vector2(
                    this.sprite.border.z / texX,
                    this.sprite.border.w / texY
                )
            );

            // #--
            // ---
            // ---
            newVerts.push([
                verts[0],
                new Vector2(ends[0].x, verts[0].y),
                new Vector2(verts[0].x, ends[0].y),
                ends[0]
            ]);
            newTexVerts.push([
                texVerts[0],
                new Vector2(texEnds[0].x, texVerts[0].y),
                new Vector2(texVerts[0].x, texEnds[0].y),
                texEnds[0]
            ]);

            // --#
            // ---
            // ---
            newVerts.push([
                new Vector2(ends[1].x, verts[1].y),
                verts[1],
                new Vector2(ends[1].x, ends[0].y),
                new Vector2(verts[1].x, ends[0].y)
            ]);
            newTexVerts.push([
                new Vector2(texEnds[1].x, texVerts[1].y),
                texVerts[1],
                new Vector2(texEnds[1].x, texEnds[0].y),
                new Vector2(texVerts[1].x, texEnds[0].y)
            ]);

            // ---
            // ---
            // #--
            newVerts.push([
                new Vector2(verts[2].x, ends[1].y),
                new Vector2(ends[0].x, ends[1].y),
                verts[2],
                new Vector2(ends[0].x, verts[2].y)
            ]);
            newTexVerts.push([
                new Vector2(texVerts[2].x, texEnds[1].y),
                new Vector2(texEnds[0].x, texEnds[1].y),
                texVerts[2],
                new Vector2(texEnds[0].x, texVerts[2].y)
            ]);

            // ---
            // ---
            // --#
            newVerts.push([
                ends[1],
                new Vector2(verts[3].x, ends[1].y),
                new Vector2(ends[1].x, verts[3].y),
                verts[3]
            ]);
            newTexVerts.push([
                texEnds[1],
                new Vector2(texVerts[3].x, texEnds[1].y),
                new Vector2(texEnds[1].x, texVerts[3].y),
                texVerts[3]
            ]);

            if (this.#drawMode === 1)
            {
                // -#-
                // ---
                // ---
                newVerts.push([
                    new Vector2(ends[0].x, verts[0].y),
                    new Vector2(ends[1].x, verts[1].y),
                    ends[0],
                    new Vector2(ends[1].x, ends[0].y)
                ]);
                newTexVerts.push([
                    new Vector2(texEnds[0].x, texVerts[0].y),
                    new Vector2(texEnds[1].x, texVerts[1].y),
                    texEnds[0],
                    new Vector2(texEnds[1].x, texEnds[0].y)
                ]);

                // ---
                // ---
                // -#-
                newVerts.push([
                    new Vector2(ends[0].x, ends[1].y),
                    ends[1],
                    new Vector2(ends[0].x, verts[2].y),
                    new Vector2(ends[1].x, verts[3].y)
                ]);
                newTexVerts.push([
                    new Vector2(texEnds[0].x, texEnds[1].y),
                    texEnds[1],
                    new Vector2(texEnds[0].x, texVerts[2].y),
                    new Vector2(texEnds[1].x, texVerts[3].y)
                ]);

                // ---
                // #--
                // ---
                newVerts.push([
                    new Vector2(verts[0].x, ends[0].y),
                    ends[0],
                    new Vector2(verts[2].x, ends[1].y),
                    new Vector2(ends[0].x, ends[1].y)
                ]);
                newTexVerts.push([
                    new Vector2(texVerts[0].x, texEnds[0].y),
                    texEnds[0],
                    new Vector2(texVerts[2].x, texEnds[1].y),
                    new Vector2(texEnds[0].x, texEnds[1].y)
                ]);

                // ---
                // --#
                // ---
                newVerts.push([
                    new Vector2(ends[1].x, ends[0].y),
                    new Vector2(verts[1].x, ends[0].y),
                    ends[1],
                    new Vector2(verts[3].x, ends[1].y)
                ]);
                newTexVerts.push([
                    new Vector2(texEnds[1].x, texEnds[0].y),
                    new Vector2(texVerts[1].x, texEnds[0].y),
                    texEnds[1],
                    new Vector2(texVerts[3].x, texEnds[1].y)
                ]);
            }
            else
            {
                const cutSize = Vector2.Subtract(texEnds[1], texEnds[0]);
                const realCutCount = new Vector2(
                    ((renderSize.x * (texVerts[3].x - texVerts[0].x)) - (this.sprite.border.x + this.sprite.border.z) / texX) / cutSize.x,
                    ((renderSize.y * (texVerts[3].y - texVerts[0].y)) - (this.sprite.border.y + this.sprite.border.w) / texY) / cutSize.y
                );
                const cutCount = new Vector2(Math.ceil(realCutCount.x), Math.ceil(realCutCount.y));
                
                for (let y = 0; y < cutCount.y; y++)
                {
                    for (let x = 0; x < cutCount.x; x++)
                    {
                        const startPoint = Vector2.Add(ends[0], new Vector2(cutSize.x * x, cutSize.y * y));
                        const endPoint = Vector2.Min(
                            Vector2.Add(startPoint, cutSize),
                            ends[1]
                        );
                        const texEndPoint = Vector2.Scale(
                            texEnds[1],
                            new Vector2(
                                x === cutCount.x - 1 ? (realCutCount.x % 1) || 1 : 1,
                                y === cutCount.y - 1 ? (realCutCount.y % 1) || 1 : 1
                            )
                        );

                        // ---
                        // -#-
                        // ---
                        newVerts.push([
                            startPoint,
                            new Vector2(endPoint.x, startPoint.y),
                            new Vector2(startPoint.x, endPoint.y),
                            endPoint
                        ]);
                        newTexVerts.push([
                            texEnds[0],
                            new Vector2(texEndPoint.x, texEnds[0].y),
                            new Vector2(texEnds[0].x, texEndPoint.y),
                            texEndPoint
                        ]);

                        // -#-
                        // ---
                        // ---
                        if (y === 0)
                        {
                            newVerts.push([
                                new Vector2(startPoint.x, verts[0].y),
                                new Vector2(endPoint.x, verts[1].y),
                                startPoint,
                                endPoint,
                            ]);
                            newTexVerts.push([
                                new Vector2(texEnds[0].x, texVerts[0].y),
                                new Vector2(texEndPoint.x, texVerts[1].y),
                                texEnds[0],
                                new Vector2(texEndPoint.x, texEnds[1].y),
                            ]);
                        }
                        
                        // ---
                        // ---
                        // -#-
                        if (y === cutCount.y - 1)
                        {
                            newVerts.push([
                                new Vector2(startPoint.x, endPoint.y),
                                endPoint,
                                new Vector2(startPoint.x, verts[2].y),
                                new Vector2(endPoint.x, verts[3].y)
                            ]);
                            newTexVerts.push([
                                new Vector2(texEnds[0].x, texEnds[1].y),
                                new Vector2(texEndPoint.x, texEnds[1].y),
                                new Vector2(texEnds[0].x, texVerts[2].y),
                                new Vector2(texEndPoint.x, texVerts[3].y)
                            ]);
                        }

                        // ---
                        // #--
                        // ---
                        if (x === 0)
                        {
                            newVerts.push([
                                new Vector2(verts[0].x, startPoint.y),
                                startPoint,
                                new Vector2(verts[2].x, endPoint.y),
                                new Vector2(startPoint.x, endPoint.y)
                            ]);
                            newTexVerts.push([
                                new Vector2(texVerts[0].x, texEnds[0].y),
                                texEnds[0],
                                new Vector2(texVerts[2].x, texEndPoint.y),
                                new Vector2(texEnds[0].x, texEndPoint.y)
                            ]);
                        }

                        // ---
                        // --#
                        // ---
                        if (x === cutCount.x - 1)
                        {
                            newVerts.push([
                                new Vector2(endPoint.x, startPoint.y),
                                new Vector2(verts[1].x, startPoint.y),
                                endPoint,
                                new Vector2(verts[3].x, endPoint.y)
                            ]);
                            newTexVerts.push([
                                new Vector2(texEnds[1].x, texEnds[0].y),
                                new Vector2(texVerts[1].x, texEnds[0].y),
                                new Vector2(texEnds[1].x, texEndPoint.y),
                                new Vector2(texVerts[3].x, texEndPoint.y)
                            ]);
                        }
                    }
                }
            }

            for (let i = 0; i < newVerts.length; i++)
            {
                const verts = newVerts[i];
                const texVerts = newTexVerts[i];

                for (let i = 0; i < tris.length; i++)
                {
                    const vert = verts[tris[i]];
                    const texVert = texVerts[tris[i]];

                    vertexArray.push(
                        vert.x - vertexPos.x,
                        vert.y - vertexPos.y
                    );

                    textureArray.push(
                        texVert.x,
                        texVert.y
                    );
                }

                this.#indexes.push(currentIndex);
                this.#trisCounts.push(tris.length - 1);

                currentIndex += tris.length;
            }

            verts[0] = ends[0];
            verts[1] = new Vector2(ends[1].x, ends[0].y);
            verts[2] = new Vector2(ends[0].x, ends[1].y);
            verts[3] = ends[1];

            if (this.#drawMode === 1)
            {
                texVerts[0] = texEnds[0];
                texVerts[1] = new Vector2(texEnds[1].x, texEnds[0].y);
                texVerts[2] = new Vector2(texEnds[0].x, texEnds[1].y);
                texVerts[3] = texEnds[1];
            }
        }

        if (this.#drawMode < 2 || renderSize.Equals(Vector2.one))
        {
            for (let i = 0; i < tris.length; i++)
            {
                const vert = verts[tris[i]];
                const texVert = texVerts[tris[i]];

                vertexArray.push(
                    vert.x - vertexPos.x,
                    vert.y - vertexPos.y
                );

                textureArray.push(
                    texVert.x,
                    texVert.y
                );
            }

            this.#indexes.push(currentIndex);
            this.#trisCounts.push(tris.length - 1);
        }

        this.material.SetBuffer(this.geometryBufferID, vertexArray);
        this.material.SetBuffer(this.textureBufferID, textureArray);

        if (this.#colorOld == null || this.#changedDrawMode) this.#RemapColors();

        this.#transMat = Matrix3x3.TRS(
            Vector2.Scale(
                this.sprite.pivot,
                Vector2.Scale(
                    new Vector2(
                        rescaleW * (verts[3].x - vertexPos.x),
                        rescaleH * (verts[3].y - vertexPos.y)
                    ),
                    -1
                )
            ),
            0,
            Vector2.Scale(
                texX > texY ? new Vector2(1, texY / texX) : new Vector2(texX / texY, 1),
                texX > texY ? rescaleW : rescaleH
            )
        );

        this.#meshChanged = true;
    }

    RecalcBounds ()
    {
        const bounds = new Bounds(Vector2.zero, this.#boundsSize);

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
            ),
        );

        const posMat = Matrix3x3.Multiply(refMat, Matrix3x3.Translate(
            Vector2.Scale(
                Vector2.Add(Vector2.Scale(this.sprite.pivot, -2), 1),
                0.5
            )
        ));

        bounds.center = new Vector2(posMat.GetValue(2, 0), -posMat.GetValue(2, 1));

        this.#bounds = bounds;

        super.RecalcBounds();
    }

    ForceMeshUpdate ()
    {
        super.ForceMeshUpdate();

        this.#meshChanged = false;
    }
    
    Render ()
    {
        if (!this.#colorOld.Equals(this.color)) this.#RemapColors();
        
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
        gl.bindTexture(gl.TEXTURE_2D, this.sprite.texture.GetNativeTexture());
        
        if (this.#drawMode === 0) gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.#trisCounts[0]);
        else Application.gl_multidraw.multiDrawArraysWEBGL(
            gl.TRIANGLE_STRIP,
            this.#indexes,
            0,
            this.#trisCounts,
            0,
            this.#indexes.length
        );
        
        gl.useProgram(null);
    }

    Duplicate ()
    {
        const output = new SpriteRenderer(this.sprite.Duplicate(), this.material.Duplicate());

        output.color = this.color.Duplicate();
        output.sortingLayer = this.sortingLayer;
        output.sortingOrder = this.sortingOrder;
        output.drawMode = this.drawMode;
        output.size = this.size.Duplicate();

        return output;
    }
}
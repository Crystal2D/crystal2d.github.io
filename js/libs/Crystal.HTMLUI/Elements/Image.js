HTMLUI.Image = class extends HTMLUI.Element
{
    #bounds = new Bounds();
    #drawMat = Matrix3x3.zero;

    #texture = null;

    get texture ()
    {
        return this.#texture;
    }

    set texture (value)
    {
        if (this.#texture === value) return;

        this.#texture = value;

        this.htmlElement.src = this.#texture.img.src;

        const smallerW = this.#texture.width < this.#texture.height;

        this.htmlElement.style.width = smallerW ? "32px" : "";
        this.htmlElement.style.height = smallerW ? "" : "32px";

        if (this.#texture.filterMode === 0) this.htmlElement.style.imageRendering = "pixelated";

        this.Recalc();
    }

    get drawMatrix ()
    {
        return this.#drawMat;
    }

    get bounds ()
    {
        return new Bounds(this.#bounds.center, this.#bounds.size);
    }

    constructor (texture)
    {
        super();

        this.htmlElement = document.createElement("img");
        this.htmlElement.style.position = "fixed";

        this.texture = texture;

        HTMLUI.AddContent(this);
    }

    Recalc ()
    {
        const ppu = HTMLUI.pixelPerUnit;
        const texX = this.#texture.width;
        const texY = this.#texture.height;
        const rescaleW = texX / ppu;
        const rescaleH = texY / ppu;
        const targetRes = texX < texY ? rescaleW : rescaleH;
        const texAspect = texX / texY;

        this.#drawMat = Matrix3x3.TRS(
            Vector2.Add(
                Vector2.Scale(
                    Vector2.Add(
                        // Main pos
                        this.position,

                        // Pivot
                        Vector2.Scale(
                            Vector2.Add(
                                Vector2.Scale(this.pivot, -2),
                                1
                            ),
                            new Vector2(
                                rescaleW * 0.5,
                                rescaleH * 0.5
                            )
                        )
                    ),
                    new Vector2(32, -32)
                ),
                
                // Fix offset
                new Vector2(
                    (texAspect > 1 ? texAspect : 1) * -32 * 0.5 / HTMLUI.scale,
                    (texAspect < 1 ? texAspect : 1) * -32 * 0.5 / HTMLUI.scale
                )
            ),
            5.555555555555556e-3 * -this.rotation * Math.PI,
            Vector2.Scale(this.scale, targetRes)
        );

        super.Recalc();
    }

    RecalcBounds ()
    {
        const size = new Vector2(
            this.#texture.width / HTMLUI.pixelPerUnit,
            this.#texture.height / HTMLUI.pixelPerUnit
        );
        const bounds = new Bounds(Vector2.zero, size);

        const refMat = this.transformMatrix;
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
                Vector2.Add(Vector2.Scale(this.pivot, -2), 1),
                Vector2.Scale(size, 0.5)
            )
        ));

        bounds.center = new Vector2(posMat.GetValue(2, 0), -posMat.GetValue(2, 1));

        this.#bounds = bounds;
    }
}
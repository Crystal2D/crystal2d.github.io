HTMLUI.Element = class
{
    #originX = 0;
    #originY = 0;
    #alpha = 1;
    #rot = 0;
    #pivot = new Vector2(0.5, 0.5);
    #pos = Vector2.zero;
    #scale = Vector2.one;
    #mat = new Matrix3x3();
    
    htmlElement = null;

    get horizontalOrigin ()
    {
        return this.#originX;
    }

    set horizontalOrigin (value)
    {
        this.#originX = value;

        this.htmlElement.style.left = `${value * 50}%`;

        this.Recalc();
    }

    get verticalOrigin ()
    {
        return this.#originY;
    }

    set verticalOrigin (value)
    {
        this.#originY = value;

        this.htmlElement.style.top = `${value * 50}%`;

        this.Recalc();
    }

    get opacity ()
    {
        return this.#alpha;
    }

    set opacity (value)
    {
        this.#alpha = value;

        this.htmlElement.style.opacity = value;
    }

    get position ()
    {
        return this.#pos;
    }

    set position (value)
    {
        this.#pos = value;

        this.Recalc();
    }

    get rotation ()
    {
        return this.#rot;
    }

    set rotation (value)
    {
        this.#rot = value;

        this.Recalc();
    }

    get scale ()
    {
        return this.#scale;
    }

    set scale (value)
    {
        this.#scale = value;

        this.Recalc();
    }

    get pivot ()
    {
        return this.#pivot;
    }

    set pivot (value)
    {
        this.#pivot = value;

        this.Recalc();
    }

    get transformMatrix ()
    {
        return this.#mat;
    }

    get drawMatrix ()
    {
        return Matrix3x3.zero;
    }

    get bounds ()
    {
        return new Bounds();
    }

    Recalc ()
    {
        this.#mat = Matrix3x3.TRS(
            Vector2.Add(
                // Main pos
                Vector2.Scale(
                    this.#pos,
                    new Vector2(1, -1)
                ),

                // Origin
                Vector2.Scale(
                    Vector2.Add(
                        new Vector2(this.#originX, this.#originY),
                        -1
                    ),
                    new Vector2(
                        window.innerWidth / 64 / HTMLUI.scale,
                        window.innerHeight / 64 / HTMLUI.scale,
                    )
                )
            ),
            5.555555555555556e-3 * -this.#rot * Math.PI,
            this.#scale
        );

        this.RecalcBounds();
        
        const projM = Matrix3x3.Scale(new Vector2(HTMLUI.scale, HTMLUI.scale));
        const renM = Matrix3x3.Multiply(
            projM,
            this.drawMatrix,
        );

        this.htmlElement.style.transform = `matrix(
            ${renM.matrix[0][0]}, ${renM.matrix[0][1]},
            ${renM.matrix[1][0]}, ${renM.matrix[1][1]},
            ${renM.matrix[2][0]}, ${renM.matrix[2][1]}
        )`;
    }

    RecalcBounds () { }

    Update () { }

    UpdateEnd () { }
}
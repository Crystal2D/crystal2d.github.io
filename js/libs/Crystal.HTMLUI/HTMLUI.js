class HTMLUI
{
    static #ppu = 16;
    static #scaleMode = 0;
    static #scale = 1;
    static #matchMode = 0;
    static #match = 0.5;
    static #physicalUnit = 0;
    static #fallbackDPI = 96;
    static #spriteDPI = 96;
    static #refRes = Vector2.zero;

    static content = [];

    static htmlElement = null;

    static get pixelPerUnit ()
    {
        return this.#ppu;
    }

    static set pixelPerUnit (value)
    {
        this.#ppu = value;

        for (let i = 0; i < this.content.length; i++) this.content[i].Recalc();
    }

    static get scaleMode ()
    {
        return this.#scaleMode;
    }

    static set scaleMode (value)
    {
        this.#scaleMode = value;

        if (value === 2) this.#UpdatePhysical();
    }

    static get scale ()
    {
        return this.#scale;
    }

    static set scale (value)
    {
        this.#scale = value;

        for (let i = 0; i < this.content.length; i++) this.content[i].Recalc();
    }

    static get referenceResolution ()
    {
        return this.#refRes;
    }

    static set referenceResolution (value)
    {
        this.#refRes = value;

        this.#OnResize();
    }

    static get matchMode ()
    {
        return this.#matchMode;
    }

    static set matchMode (value)
    {
        this.#matchMode = value;

        this.#OnResize();
    }

    static get match ()
    {
        return this.#match;
    }

    static set match (value)
    {
        this.#match = value;

        this.#OnResize();
    }

    static get physicalUnit ()
    {
        return this.#physicalUnit;
    }

    static set physicalUnit (value)
    {
        this.#physicalUnit = value;

        this.#UpdatePhysical();
    }

    static get fallbackDPI ()
    {
        return this.#fallbackDPI;
    }

    static set fallbackDPI (value)
    {
        this.#fallbackDPI = value;

        this.#UpdatePhysical();
    }

    static get spriteDPI ()
    {
        return this.#spriteDPI;
    }

    static set spriteDPI (value)
    {
        this.#spriteDPI = value;

        this.#UpdatePhysical();
    }

    static Init ()
    {
        this.htmlElement = document.createElement("div");
        this.htmlElement.style.pointerEvents = "none";
        this.htmlElement.style.userSelect = "none";
        this.htmlElement.style.width = "100%";
        this.htmlElement.style.height = "100%";
        this.htmlElement.style.position = "fixed";

        document.body.append(this.htmlElement);

        window.addEventListener("resize", () => this.#OnResize());
    }

    static #UpdatePhysical ()
    {
        const dpi = window.devicePixelRatio * 96 || this.#fallbackDPI;
        const targetDPIs = [
            2.54, // cm
            25.4, // mm
            1,    // in
            72,   // pt
            6     // pc
        ];

        this.scale = dpi / targetDPIs[this.#physicalUnit] / this.#spriteDPI;
    }

    static #OnResize ()
    {
        if (this.#scaleMode !== 1)
        {
            for (let i = 0; i < this.content.length; i++) this.content[i].Recalc();

            return;
        }

        const width = window.innerWidth / this.#refRes.x;
        const height = window.innerHeight / this.#refRes.y;

        switch (this.#matchMode)
        {
            case 0:
                this.scale = Math.pow(2, Math.Lerp(
                    Math.log2(width),
                    Math.log2(height),
                    this.#match
                ));
                break;
            case 1:
                this.scale = Math.min(width, height);
                break;
            case 2:
                this.scale = Math.max(width, height);
                break;
        }
    }

    static AddContent (element)
    {
        this.htmlElement.append(element.htmlElement);
        this.content.push(element);
    }

    static ScreenToUIPoint (point)
    {
        const scaler = 32 * HTMLUI.scale;
        const viewMat = Matrix3x3.Scale(new Vector2(
            window.innerWidth / scaler,
            window.innerHeight / scaler
        ));
        const pointMat = Matrix3x3.Translate(new Vector2(
            (point.x / window.innerWidth) - 0.5,
            (point.y / window.innerHeight) - 0.5
        ));
        const targetMat = Matrix3x3.Multiply(viewMat, pointMat);

        return new Vector2(targetMat.GetValue(2, 0), -targetMat.GetValue(2, 1));
    }

    static Update ()
    {
        for (let i = 0; i < this.content.length; i++) this.content[i].Update();
    }

    static UpdateEnd ()
    {
        for (let i = 0; i < this.content.length; i++) this.content[i].UpdateEnd();
    }
}

HTMLUI.Init();
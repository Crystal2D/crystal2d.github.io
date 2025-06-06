class InputManager extends GameBehavior
{
    #upBtn = null;
    #downBtn = null;
    #leftBtn = null;
    #rightBtn = null;
    #zBtn = null;
    #xBtn = null;

    Start ()
    {
        HTMLUI.referenceResolution = new Vector2(480, 432);
        HTMLUI.scaleMode = HUIScaleMode.Screen;
        HTMLUI.matchMode = HUIMatchMode.Shrink;

        this.#upBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#upBtn.position = new Vector2(2.25, 3);
        this.#upBtn.horizontalOrigin = HUIOriginX.Left;
        this.#upBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#downBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#downBtn.position = new Vector2(2.25, 1);
        this.#downBtn.rotation = 180;
        this.#downBtn.horizontalOrigin = HUIOriginX.Left;
        this.#downBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#leftBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#leftBtn.position = new Vector2(1.25, 2);
        this.#leftBtn.rotation = 90;
        this.#leftBtn.horizontalOrigin = HUIOriginX.Left;
        this.#leftBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#rightBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#rightBtn.position = new Vector2(3.25, 2);
        this.#rightBtn.rotation = 270;
        this.#rightBtn.horizontalOrigin = HUIOriginX.Left;
        this.#rightBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#zBtn = new HTMLUI.Button(Resources.Find("ctrls/z"));
        this.#zBtn.position = new Vector2(-2.5, 1.5);
        this.#zBtn.horizontalOrigin = HUIOriginX.Right;
        this.#zBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#xBtn = new HTMLUI.Button(Resources.Find("ctrls/x"));
        this.#xBtn.position = new Vector2(-1.25, 2.25);
        this.#xBtn.horizontalOrigin = HUIOriginX.Right;
        this.#xBtn.verticalOrigin = HUIOriginY.Bottom;
    }

    Update ()
    {
        if (this.#zBtn.pressedDown)
        {
            this.#zBtn.opacity = 0.7;
        }

        if (this.#zBtn.pressedUp) this.#zBtn.opacity = 1;
    }
}
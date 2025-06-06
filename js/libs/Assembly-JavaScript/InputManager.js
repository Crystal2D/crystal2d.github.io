class InputManager extends GameBehavior
{
    #zBtn = null;

    Start ()
    {
        HTMLUI.referenceResolution = new Vector2(480, 432);
        HTMLUI.scaleMode = HUIScaleMode.Screen;
        HTMLUI.matchMode = HUIMatchMode.Shrink;

        this.#zBtn = new HTMLUI.Button(Resources.Find("ctrls/z"));
        this.#zBtn.position = new Vector2(-2, 2);
        this.#zBtn.horizontalOrigin = HUIOriginX.Right;
        this.#zBtn.verticalOrigin = HUIOriginY.Bottom;
    }

    Update ()
    {
        if (this.#zBtn.pressedDown)
        {
            this.#zBtn.opacity = 0.7;

            AudioManager.instance.PlaySelect();
        }

        if (this.#zBtn.pressedUp) this.#zBtn.opacity = 1;
    }
}
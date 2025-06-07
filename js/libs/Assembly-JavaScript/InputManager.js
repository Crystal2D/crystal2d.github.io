class InputManager extends GameBehavior
{
    static instance = null;

    #keys = [];

    #upBtn = null;
    #downBtn = null;
    #leftBtn = null;
    #rightBtn = null;
    #zBtn = null;
    #xBtn = null;

    #Key = class
    {
        #inputs = [];
        #gamepadInputs = [];
        #touchInputs = [];

        name = null;

        get pressed ()
        {
            for (let i = 0; i < this.#inputs.length; i++)
            {
                if (Input.GetKey(this.#inputs[i])) return true;
            }

            for (let i = 0; i < this.#gamepadInputs.length; i++)
            {
                if (GamepadInput.GetKey(this.#gamepadInputs[i])) return true;
            }
            
            for (let i = 0; i < this.#touchInputs.length; i++)
            {
                if (this.#touchInputs[i].pressed) return true;
            }

            return false;
        }

        get pressedDown ()
        {
            for (let i = 0; i < this.#inputs.length; i++)
            {
                if (Input.GetKeyDown(this.#inputs[i])) return true;
            }

            for (let i = 0; i < this.#gamepadInputs.length; i++)
            {
                if (GamepadInput.GetKeyDown(this.#gamepadInputs[i])) return true;
            }
            
            for (let i = 0; i < this.#touchInputs.length; i++)
            {
                if (this.#touchInputs[i].pressedDown) return true;
            }

            return false;
        }

        constructor (name)
        {
            this.name = name;
        }

        KeyboardInput (key)
        {
            this.#inputs.push(key);
        }

        GamepadInput (key)
        {
            this.#gamepadInputs.push(key);
        }

        TouchInput (button)
        {
            this.#touchInputs.push(button);
        }
    }

    static FindKey (name)
    {
        return this.instance.FindKey(name);
    }

    static GetKey (name)
    {
        return this.instance.GetKey(name);
    }

    static GetKeyDown (name)
    {
        return this.instance.GetKeyDown(name);
    }

    static GetKeyUp (name)
    {
        return this.instance.GetKeyUp(name);
    }


    Start ()
    {
        InputManager.instance = this;

        HTMLUI.referenceResolution = new Vector2(480, 432);
        HTMLUI.scaleMode = HUIScaleMode.Screen;
        HTMLUI.matchMode = HUIMatchMode.Shrink;

        this.#upBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#upBtn.position = new Vector2(2.25, 3);
        this.#upBtn.horizontalOrigin = HUIOriginX.Left;
        this.#upBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#upBtn.registerSlide = true;

        this.#downBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#downBtn.position = new Vector2(2.25, 1);
        this.#downBtn.rotation = 180;
        this.#downBtn.horizontalOrigin = HUIOriginX.Left;
        this.#downBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#downBtn.registerSlide = true;

        this.#leftBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#leftBtn.position = new Vector2(1.25, 2);
        this.#leftBtn.rotation = 90;
        this.#leftBtn.horizontalOrigin = HUIOriginX.Left;
        this.#leftBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#leftBtn.registerSlide = true;

        this.#rightBtn = new HTMLUI.Button(Resources.Find("ctrls/f"));
        this.#rightBtn.position = new Vector2(3.25, 2);
        this.#rightBtn.rotation = 270;
        this.#rightBtn.horizontalOrigin = HUIOriginX.Left;
        this.#rightBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#rightBtn.registerSlide = true;

        this.#zBtn = new HTMLUI.Button(Resources.Find("ctrls/z"));
        this.#zBtn.position = new Vector2(-2.5, 1.5);
        this.#zBtn.horizontalOrigin = HUIOriginX.Right;
        this.#zBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#xBtn = new HTMLUI.Button(Resources.Find("ctrls/x"));
        this.#xBtn.position = new Vector2(-1.25, 2.25);
        this.#xBtn.horizontalOrigin = HUIOriginX.Right;
        this.#xBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#keys = [
            new this.#Key("up"),
            new this.#Key("down"),
            new this.#Key("left"),
            new this.#Key("right"),
            new this.#Key("z"),
            new this.#Key("x"),
        ];

        this.#keys[0].KeyboardInput(KeyCode.ArrowUp);
        this.#keys[0].GamepadInput(KeyCode.DpadUp);
        this.#keys[0].TouchInput(this.#upBtn);

        this.#keys[1].KeyboardInput(KeyCode.ArrowDown);
        this.#keys[1].GamepadInput(KeyCode.DpadDown);
        this.#keys[1].TouchInput(this.#downBtn);

        this.#keys[2].KeyboardInput(KeyCode.ArrowLeft);
        this.#keys[2].GamepadInput(KeyCode.ArrowLeft);
        this.#keys[2].TouchInput(this.#leftBtn);

        this.#keys[3].KeyboardInput(KeyCode.ArrowRight);
        this.#keys[3].GamepadInput(KeyCode.DpadRight);
        this.#keys[3].TouchInput(this.#rightBtn);
        
        this.#keys[4].KeyboardInput(KeyCode.Z);
        this.#keys[4].GamepadInput(KeyCode.SouthButton);
        this.#keys[4].TouchInput(this.#zBtn);

        this.#keys[5].KeyboardInput(KeyCode.X);
        this.#keys[5].GamepadInput(KeyCode.WestButton);
        this.#keys[5].TouchInput(this.#xBtn);
    }

    Update ()
    {
        if (this.#upBtn.pressedDown)this.#upBtn.opacity = 0.7;
        else if (this.#upBtn.pressedUp) this.#upBtn.opacity = 1;

        if (this.#downBtn.pressedDown)this.#downBtn.opacity = 0.7;
        else if (this.#downBtn.pressedUp) this.#downBtn.opacity = 1;
        
        if (this.#leftBtn.pressedDown)this.#leftBtn.opacity = 0.7;
        else if (this.#leftBtn.pressedUp) this.#leftBtn.opacity = 1;

        if (this.#rightBtn.pressedDown)this.#rightBtn.opacity = 0.7;
        else if (this.#rightBtn.pressedUp) this.#rightBtn.opacity = 1;

        if (this.#zBtn.pressedDown)this.#zBtn.opacity = 0.7;
        else if (this.#zBtn.pressedUp) this.#zBtn.opacity = 1;

        if (this.#xBtn.pressedDown)this.#xBtn.opacity = 0.7;
        else if (this.#xBtn.pressedUp) this.#xBtn.opacity = 1;
    }

    LateUpdate ()
    {
        HTMLUI.UpdateEnd();
        HTMLUI.Update();
    }

    OnDisable ()
    {
        HTMLUI.Clear();
    }

    FindKey (name)
    {
        return this.#keys.find(item => item.name === name);
    }

    GetKey (name)
    {
        return this.FindKey(name).pressed;
    }

    GetKeyDown (name)
    {
        return this.FindKey(name).pressedDown;
    }

    GetKeyUp (name)
    {
        return this.FindKey(name).pressedUp;
    }
}
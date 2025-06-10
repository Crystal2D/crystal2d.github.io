// Some things will be weird here
// just to mimic how dep's og engine did stuff
class InputManager extends GameBehavior
{
    static instance = null;

    #touchEnabled = true;
    #repeated = false;
    #pressedTime = 0;
    #repeatWait = 0.4;
    #repeatInterval = 0.1;
    #repeatTime = 0;
    #keys = [];

    #upBtn = null;
    #downBtn = null;
    #leftBtn = null;
    #rightBtn = null;
    #zBtn = null;
    #xBtn = null;
    #lastKey = null;

    #Key = class
    {
        #inputs = [];
        #gamepadInputs = [];
        #gamepadAxes = [];
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

            for (let i = 0; i < this.#gamepadAxes.length; i++)
            {
                if (this.#gamepadAxes[i].state) return true;
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

            for (let i = 0; i < this.#gamepadAxes.length; i++)
            {
                if (this.#gamepadAxes[i].state && !this.#gamepadAxes[i].lastState) return true;
            }
            
            for (let i = 0; i < this.#touchInputs.length; i++)
            {
                if (this.#touchInputs[i].pressedDown) return true;
            }

            return false;
        }

        get pressedUp ()
        {
            for (let i = 0; i < this.#inputs.length; i++)
            {
                if (Input.GetKeyUp(this.#inputs[i])) return true;
            }

            for (let i = 0; i < this.#gamepadInputs.length; i++)
            {
                if (GamepadInput.GetKeyUp(this.#gamepadInputs[i])) return true;
            }

            for (let i = 0; i < this.#gamepadAxes.length; i++)
            {
                if (!this.#gamepadAxes[i].state && this.#gamepadAxes[i].lastState) return true;
            }
            
            for (let i = 0; i < this.#touchInputs.length; i++)
            {
                if (this.#touchInputs[i].pressedUp) return true;
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

        GamepadAxis (name, dir, threshold)
        {
            this.#gamepadAxes.push({
                name: name,
                dir: dir,
                pull: threshold,
                state: false,
                lastState: false
            });
        }

        TouchInput (button)
        {
            this.#touchInputs.push(button);
        }

        Update ()
        {
            for (let i = 0; i < this.#gamepadAxes.length; i++)
            {
                const axis = this.#gamepadAxes[i];

                if (axis.dir > 0) axis.state = GamepadInput.GetAxis(axis.name) >= axis.pull;
                else axis.state = GamepadInput.GetAxis(axis.name) <= -axis.pull;
            }
        }

        UpdateEnd ()
        {
            for (let i = 0; i < this.#gamepadAxes.length; i++) this.#gamepadAxes[i].lastState = this.#gamepadAxes[i].state;
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

    static IsPressed (name)
    {
        return this.instance.IsPressed(name);
    }

    static IsTriggered (name)
    {
        return this.instance.IsTriggered(name);
    }

    static IsLongPressed (name)
    {
        return this.instance.IsLongPressed(name);
    }

    static IsRepeated (name)
    {
        return this.instance.IsRepeated(name);
    }

    static Clear ()
    {
        this.instance.Clear();
    }

    #SetTouch (state)
    {
        if (this.#touchEnabled === state) return;

        this.#upBtn.SetActive(state);
        this.#downBtn.SetActive(state);
        this.#leftBtn.SetActive(state);
        this.#rightBtn.SetActive(state);
        this.#zBtn.SetActive(state);
        this.#xBtn.SetActive(state);

        this.#touchEnabled = state;
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

        if (!Application.isMobilePlatform) this.#SetTouch(false);

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
        this.#keys[0].GamepadAxis(
            "left stick vertical",
            1,
            0.5
        );
        this.#keys[0].TouchInput(this.#upBtn);

        this.#keys[1].KeyboardInput(KeyCode.ArrowDown);
        this.#keys[1].GamepadInput(KeyCode.DpadDown);
        this.#keys[1].GamepadAxis(
            "left stick vertical",
            -1,
            0.5
        );
        this.#keys[1].TouchInput(this.#downBtn);

        this.#keys[2].KeyboardInput(KeyCode.ArrowLeft);
        this.#keys[2].GamepadInput(KeyCode.DpadLeft);
        this.#keys[2].GamepadAxis(
            "left stick horizontal",
            -1,
            0.5
        );
        this.#keys[2].TouchInput(this.#leftBtn);

        this.#keys[3].KeyboardInput(KeyCode.ArrowRight);
        this.#keys[3].GamepadInput(KeyCode.DpadRight);
        this.#keys[3].GamepadAxis(
            "left stick horizontal",
            1,
            0.5
        );
        this.#keys[3].TouchInput(this.#rightBtn);
        
        this.#keys[4].KeyboardInput(KeyCode.Z);
        this.#keys[4].GamepadInput(KeyCode.SouthButton);
        this.#keys[4].TouchInput(this.#zBtn);

        this.#keys[5].KeyboardInput(KeyCode.X);
        this.#keys[5].GamepadInput(KeyCode.EastButton);
        this.#keys[5].TouchInput(this.#xBtn);
    }

    EarlyUpdate ()
    {
        HTMLUI.Update();

        let pressed = false;

        for (let i = 0; i < this.#keys.length; i++)
        {
            const key = this.#keys[i];

            key.Update();

            if (key.pressedDown)
            {
                this.#lastKey = key.name;
                this.#pressedTime = 0;
                this.#repeatTime = 0;
            }

            if (this.#lastKey === key.name && key.pressed) pressed = true;
        }

        if (!pressed) this.#lastKey = null;

        if (this.#lastKey != null)
        {
            this.#repeated = false;

            if (this.#pressedTime >= this.#repeatTime)
            {
                this.#repeated = true;
                this.#repeatTime = this.#pressedTime + this.#repeatInterval;
            }

            this.#pressedTime += Time.deltaTime;
        }
    }

    Update ()
    {
        if (!this.#touchEnabled)
        {
            if (Input.touchCount > 0) this.#SetTouch(true);

            return;
        }

        if (Input.anyKeyDown || GamepadInput.anyKey) this.#SetTouch(false);

        if (this.#upBtn.pressedDown) this.#upBtn.opacity = 0.7;
        else if (this.#upBtn.pressedUp) this.#upBtn.opacity = 1;

        if (this.#downBtn.pressedDown) this.#downBtn.opacity = 0.7;
        else if (this.#downBtn.pressedUp) this.#downBtn.opacity = 1;
        
        if (this.#leftBtn.pressedDown) this.#leftBtn.opacity = 0.7;
        else if (this.#leftBtn.pressedUp) this.#leftBtn.opacity = 1;

        if (this.#rightBtn.pressedDown) this.#rightBtn.opacity = 0.7;
        else if (this.#rightBtn.pressedUp) this.#rightBtn.opacity = 1;

        if (this.#zBtn.pressedDown) this.#zBtn.opacity = 0.7;
        else if (this.#zBtn.pressedUp) this.#zBtn.opacity = 1;

        if (this.#xBtn.pressedDown) this.#xBtn.opacity = 0.7;
        else if (this.#xBtn.pressedUp) this.#xBtn.opacity = 1;
    }

    LateUpdate ()
    {
        HTMLUI.UpdateEnd();

        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].UpdateEnd();
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

    IsPressed (name)
    {
        return this.GetKey(name);
    }

    IsTriggered (name)
    {
        return this.GetKeyDown(name);
    }

    IsLongPressed (name)
    {
        return this.#lastKey === name && this.#pressedTime >= this.#repeatWait;
    }

    IsRepeated (name)
    {
        return this.IsTriggered(name) || (this.IsLongPressed(name) && this.#repeated);
    }

    Clear ()
    {
        this.#lastKey = null;
    }
}
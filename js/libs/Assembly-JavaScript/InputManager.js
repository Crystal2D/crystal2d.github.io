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
    #textures = [];

    #dpad = null;
    #upBtn = null;
    #downBtn = null;
    #leftBtn = null;
    #rightBtn = null;
    #zBtn = null;
    #xBtn = null;
    #shiftBtn = null;
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

        this.#dpad.SetActive(state);
        this.#upBtn.SetActive(state);
        this.#downBtn.SetActive(state);
        this.#leftBtn.SetActive(state);
        this.#rightBtn.SetActive(state);
        this.#zBtn.SetActive(state);
        this.#xBtn.SetActive(state);
        this.#shiftBtn.SetActive(state);

        this.#touchEnabled = state;
    }

    Start ()
    {
        this.#textures = [
            Resources.Find("ctrls/dpad"),
            Resources.Find("ctrls/dpad/up"),
            Resources.Find("ctrls/dpad/down"),
            Resources.Find("ctrls/dpad/left"),
            Resources.Find("ctrls/dpad/right"),
            Resources.Find("ctrls/z"),
            Resources.Find("ctrls/z1"),
            Resources.Find("ctrls/x"),
            Resources.Find("ctrls/x1"),
            Resources.Find("ctrls/shift"),
            Resources.Find("ctrls/shift1")
        ];

        InputManager.instance = this;

        HTMLUI.referenceResolution = new Vector2(480, 432);
        HTMLUI.scaleMode = HUIScaleMode.Screen;
        HTMLUI.matchMode = HUIMatchMode.Shrink;

        this.#dpad = new HTMLUI.Image(this.#textures[0]);
        this.#dpad.position = new Vector2(2.25, 2);
        this.#dpad.horizontalOrigin = HUIOriginX.Left;
        this.#dpad.verticalOrigin = HUIOriginY.Bottom;

        const boundsTex = Resources.Find("ctrls/bounds");

        this.#upBtn = new HTMLUI.Button(boundsTex);
        this.#upBtn.position = new Vector2(2.25, 2.8333);
        this.#upBtn.horizontalOrigin = HUIOriginX.Left;
        this.#upBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#upBtn.registerSlide = true;
        this.#upBtn.opacity = 0;

        this.#downBtn = new HTMLUI.Button(boundsTex);
        this.#downBtn.position = new Vector2(2.25, 1.1667);
        this.#downBtn.rotation = 180;
        this.#downBtn.horizontalOrigin = HUIOriginX.Left;
        this.#downBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#downBtn.registerSlide = true;
        this.#downBtn.opacity = 0;

        this.#leftBtn = new HTMLUI.Button(boundsTex);
        this.#leftBtn.position = new Vector2(1.4167, 2);
        this.#leftBtn.rotation = 90;
        this.#leftBtn.horizontalOrigin = HUIOriginX.Left;
        this.#leftBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#leftBtn.registerSlide = true;
        this.#leftBtn.opacity = 0;

        this.#rightBtn = new HTMLUI.Button(boundsTex);
        this.#rightBtn.position = new Vector2(3.0833, 2);
        this.#rightBtn.rotation = 270;
        this.#rightBtn.horizontalOrigin = HUIOriginX.Left;
        this.#rightBtn.verticalOrigin = HUIOriginY.Bottom;
        this.#rightBtn.registerSlide = true;
        this.#rightBtn.opacity = 0;

        this.#zBtn = new HTMLUI.Button(this.#textures[5]);
        this.#zBtn.position = new Vector2(-2.5, 1);
        this.#zBtn.horizontalOrigin = HUIOriginX.Right;
        this.#zBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#xBtn = new HTMLUI.Button(this.#textures[7]);
        this.#xBtn.position = new Vector2(-1.5, 2);
        this.#xBtn.horizontalOrigin = HUIOriginX.Right;
        this.#xBtn.verticalOrigin = HUIOriginY.Bottom;

        this.#shiftBtn = new HTMLUI.Button(this.#textures[9]);
        this.#shiftBtn.position = new Vector2(-3.5, 2);
        this.#shiftBtn.horizontalOrigin = HUIOriginX.Right;
        this.#shiftBtn.verticalOrigin = HUIOriginY.Bottom;

        if (!Application.isMobilePlatform) this.#SetTouch(false);

        this.#keys = [
            new this.#Key("up"),
            new this.#Key("down"),
            new this.#Key("left"),
            new this.#Key("right"),
            new this.#Key("z"),
            new this.#Key("x"),
            new this.#Key("shift")
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

        this.#keys[6].KeyboardInput(KeyCode.Shift);
        this.#keys[6].GamepadInput(KeyCode.WestButton);
        this.#keys[6].TouchInput(this.#shiftBtn);
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

        if (this.#upBtn.pressed) this.#dpad.texture = this.#textures[1];
        else if (this.#downBtn.pressed) this.#dpad.texture = this.#textures[2];
        else if (this.#leftBtn.pressed) this.#dpad.texture = this.#textures[3];
        else if (this.#rightBtn.pressed) this.#dpad.texture = this.#textures[4];
        else this.#dpad.texture = this.#textures[0];

        this.#zBtn.texture = this.#textures[5 + +this.#zBtn.pressed];
        this.#xBtn.texture = this.#textures[7 + +this.#xBtn.pressed];
        this.#shiftBtn.texture = this.#textures[9 + +this.#shiftBtn.pressed];
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
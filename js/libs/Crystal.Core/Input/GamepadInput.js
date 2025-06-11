class GamepadInput
{
    static #eventsUnsupported = false;
    static #gamepads = [];
    static #keys = [];
    static #axes = [];

    static #Key = class
    {
        active = false;
        lastState = false;
        name = "";
        
        constructor (name)
        {
            this.name = name;
        }
    }

    static #Axis = class
    {
        value = 0;
        name = "";

        constructor (name)
        {
            this.name = name;
        }
    }

    static #FindKey (name)
    {
        let output = -1;
        
        this.#keys.find((element, index) => {
            if (element.name !== name) return false;
            
            output = index;
            
            return true;
        });
        
        return output;
    }

    static get isConnected ()
    {
        return this.#gamepads.length !== 0;
    }

    static get anyKey ()
    {
        for (let i = 0; i < this.#keys.length; i++)
        {
            if (this.#keys[i].active) return true;
        }

        for (let i = 0; i < this.#axes.length; i++)
        {
            if (Math.abs(this.#axes[i].value) >= 1e-3) return true;
        }

        return false;
    }

    static get anyKeyDown ()
    {
        for (let i = 0; i < this.#keys.length; i++)
        {
            if (this.#keys[i].active && !this.#keys[i].lastState) return true;
        }

        return false;
    }

    static get anyKeyUp ()
    {
        for (let i = 0; i < this.#keys.length; i++)
        {
            if (!this.#keys[i].active && this.#keys[i].lastState) return true;
        }

        return false;
    }

    static Init ()
    {
        this.#keys = [
            new this.#Key("south button"),
            new this.#Key("east button"),
            new this.#Key("west button"),
            new this.#Key("north button"),
            new this.#Key("left bumper"),
            new this.#Key("right bumper"),
            new this.#Key("left trigger"),
            new this.#Key("right trigger"),
            new this.#Key("select"),
            new this.#Key("start"),
            new this.#Key("left stick button"),
            new this.#Key("right stick button"),
            new this.#Key("dpad up"),
            new this.#Key("dpad down"),
            new this.#Key("dpad left"),
            new this.#Key("dpad right"),
            new this.#Key("home")
        ];

        this.#axes = [
            new this.#Axis("left trigger"),
            new this.#Axis("right trigger"),
            new this.#Axis("left stick horizontal"),
            new this.#Axis("left stick vertical"),
            new this.#Axis("right stick horizontal"),
            new this.#Axis("right stick vertical")
        ];

        if ("GamepadEvent" in window)
        {
            window.addEventListener("gamepadconnected", event => this.#gamepads.push(event.gamepad));
            window.addEventListener("gamepaddisconnected", event => {
                this.#gamepads.splice(this.#gamepads.indexOf(event.gamepad), 1);
                
                this.Clear();
            });
        }
        else if ("WebkitGamepadEvent" in window)
        {
            window.addEventListener("webkitgamepadconnected", event => this.#gamepads.push(event.gamepad));
            window.addEventListener("webkitgamepaddisconnected", event => {
                this.#gamepads.splice(this.#gamepads.indexOf(event.gamepad), 1);

                this.Clear();
            });
        }
        else this.#eventsUnsupported = true;
    }

    static Update ()
    {
        const gamepads = navigator.getGamepads != null ? navigator.getGamepads() : (navigator.webkitGetGamepads != null ? navigator.webkitGetGamepads() : []);

        if (this.#eventsUnsupported)
        {
            this.#gamepads = gamepads.filter(item => item != null);

            if (this.#gamepads.length === 0) this.Clear();
        }

        const processButton = button => button.pressed || button.touched || button.value > 0;

        for (let i = 0; i < this.#gamepads.length && gamepads.length > 0; i++)
        {
            const gamepad = gamepads[this.#gamepads[i]?.index];

            this.#keys[0].active = processButton(gamepad.buttons[0]);
            this.#keys[1].active = processButton(gamepad.buttons[1]);
            this.#keys[2].active = processButton(gamepad.buttons[2]);
            this.#keys[3].active = processButton(gamepad.buttons[3]);
            this.#keys[4].active = processButton(gamepad.buttons[4]);
            this.#keys[5].active = processButton(gamepad.buttons[5]);
            this.#keys[6].active = processButton(gamepad.buttons[6]);
            this.#keys[7].active = processButton(gamepad.buttons[7]);
            this.#keys[8].active = processButton(gamepad.buttons[8]);
            this.#keys[9].active = processButton(gamepad.buttons[9]);
            this.#keys[10].active = processButton(gamepad.buttons[10]);
            this.#keys[11].active = processButton(gamepad.buttons[11]);
            this.#keys[12].active = processButton(gamepad.buttons[12]);
            this.#keys[13].active = processButton(gamepad.buttons[13]);
            this.#keys[14].active = processButton(gamepad.buttons[14]);
            this.#keys[15].active = processButton(gamepad.buttons[15]);
            this.#keys[16].active = processButton(gamepad.buttons[16]);

            this.#axes[0].value = gamepad.buttons[6].value;
            this.#axes[1].value = gamepad.buttons[7].value;
            this.#axes[2].value = gamepad.axes[0];
            this.#axes[3].value = -gamepad.axes[1];
            this.#axes[4].value = gamepad.axes[2];
            this.#axes[5].value = -gamepad.axes[3];
        }
    }

    static End ()
    {
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].lastState = this.#keys[i].active;
    }

    static Clear ()
    {
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].active = false;
        for (let i = 0; i < this.#axes.length; i++) this.#axes[i].value = 0;
    }

    static GetKey (key)
    {
        let keyIndex = key;
        
        if (typeof key === "string")
        {
            keyIndex = this.#FindKey(key);
            
            if (keyIndex == null) return false;
        }
        else if (key < 0 || key >= this.#keys.length) return;
        
        return this.#keys[keyIndex].active;
    }
    
    static GetKeyDown (key)
    {
        let keyIndex = key;
        
        if (typeof key === "string")
        {
            keyIndex = this.#FindKey(key);
            
            if (keyIndex == null) return false;
        }
        else if (key < 0 || key >= this.#keys.length) return;
        
        return this.#keys[keyIndex].active && !this.#keys[keyIndex].lastState;
    }
    
    static GetKeyUp (key)
    {
        let keyIndex = key;
        
        if (typeof key === "string")
        {
            keyIndex = this.#FindKey(key);
            
            if (keyIndex == null) return false;
        }
        else if (key < 0 || key >= this.#keys.length) return;
        
        return !this.#keys[keyIndex].active && this.#keys[keyIndex].lastState;
    }

    static GetAxis (name)
    {
        const axis = this.#axes.find(item => item.name === name);

        return axis.value;
    }

    static GetAxisRaw (name)
    {
        return Math.round(this.GetAxis(name));
    }
}
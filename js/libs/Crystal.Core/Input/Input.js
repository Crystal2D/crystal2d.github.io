class Input
{
    static #terminating = false;
    static #terminated = false;
    static #mouseOver = false;
    static #keys = [];
    static #nativeTouches = [];
    static #changedTouches = [];
    static #cancelledTouches = [];
    static #touches = [];
    static #mousePos = new Vector2();
    static #mouseDelta = new Vector2();

    static get mousePresent ()
    {
        return this.#mouseOver;
    }

    static get mousePosition ()
    {
        return this.#mousePos.Duplicate();
    }

    static get mousePositionDelta ()
    {
        return this.#mouseDelta.Duplicate();
    }
    
    static get touchCount ()
    {
        return this.#touches.length;
    }

    static get touches ()
    {
        return [...this.#touches];
    }

    static get anyKey ()
    {
        for (let i = 0; i < this.#keys.length; i++)
        {
            if (this.#keys[i].active) return true;
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
    
    static #Key = class
    {
        active = false;
        lastState = false;
        isLetter = false;
        name = "";
        code = "";
        
        constructor (name, code, isLetter)
        {
            this.name = name;
            this.code = code;
            this.isLetter = isLetter ?? false;
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
    
    static #FindKeyByCode (code)
    {
        let output = -1;
        
        this.#keys.find((element, index) => {
            if (element.code !== (element.isLetter ? code.toLowerCase() : code)) return false;
            
            output = index;
            
            return true;
        });
        
        return output;
    }
    
    static Init ()
    {
        this.#keys = [
            new this.#Key("alt", "Alt"),
            new this.#Key("altgr", "AltGraph"),
            new this.#Key("capslock", "CapsLock"),
            new this.#Key("numlock", "NumLock"),
            new this.#Key("scrollock", "ScrollLock"),
            new this.#Key("ctrl", "Control"),
            new this.#Key("meta", "Meta"),
            new this.#Key("shift", "Shift"),

            new this.#Key("enter", "Enter"),
            new this.#Key("tab", "Tab"),
            new this.#Key("space", " "),

            new this.#Key("arrowup", "ArrowUp"),
            new this.#Key("arrowdown", "ArrowDown"),
            new this.#Key("arrowleft", "ArrowLeft"),
            new this.#Key("arrowright", "ArrowRight"),
            new this.#Key("end", "End"),
            new this.#Key("home", "Home"),
            new this.#Key("pagedown", "PageDown"),
            new this.#Key("pageup", "PageUp"),

            new this.#Key("backspace", "Backspace"),
            new this.#Key("clear", "Clear"),
            new this.#Key("delete", "Delete"),
            new this.#Key("insert", "Insert"),

            new this.#Key("menu", "ContextMenu"),
            new this.#Key("esc", "Escape"),
            new this.#Key("help", "Help"),
            new this.#Key("pause", "Pause"),
            new this.#Key("print", "Print"),
            new this.#Key("printscreen", "PrintScreen"),

            new this.#Key("num0", "0"),
            new this.#Key("num1", "1"),
            new this.#Key("num2", "2"),
            new this.#Key("num3", "3"),
            new this.#Key("num4", "4"),
            new this.#Key("num5", "5"),
            new this.#Key("num6", "6"),
            new this.#Key("num7", "7"),
            new this.#Key("num8", "8"),
            new this.#Key("num9", "9"),

            new this.#Key("tilde", "~"),
            new this.#Key("exclaim", "!"),
            new this.#Key("at", "@"),
            new this.#Key("hash", "#"),
            new this.#Key("dollar", "$"),
            new this.#Key("percent", "%"),
            new this.#Key("caret", "^"),
            new this.#Key("ampersand", "&"),
            new this.#Key("asterisk", "*"),
            new this.#Key("leftparen", "("),
            new this.#Key("rightparen", "("),
            new this.#Key("minus", "-"),
            new this.#Key("underscore", "_"),
            new this.#Key("equals", "="),
            new this.#Key("plus", "+"),
            new this.#Key("quote", "'"),
            new this.#Key("doublequote", "\""),
            new this.#Key("backquote", "`"),
            new this.#Key("leftbracket", "["),
            new this.#Key("rightbracket", "["),
            new this.#Key("leftcurlybracket", "{"),
            new this.#Key("rightcurlybracket", "{"),
            new this.#Key("slash", "/"),
            new this.#Key("backslash", "\\"),
            new this.#Key("pipe", "|"),
            new this.#Key("colon", ":"),
            new this.#Key("semicolon", ";"),
            new this.#Key("less", "<"),
            new this.#Key("greater", ">"),
            new this.#Key("question", "?"),
            new this.#Key("period", "."),
            new this.#Key("comma", ","),

            new this.#Key("f1", "F1"),
            new this.#Key("f2", "F2"),
            new this.#Key("f3", "F3"),
            new this.#Key("f4", "F4"),
            new this.#Key("f5", "F5"),
            new this.#Key("f6", "F6"),
            new this.#Key("f7", "F7"),
            new this.#Key("f8", "F8"),
            new this.#Key("f9", "F9"),
            new this.#Key("f10", "F10"),
            new this.#Key("f11", "F11"),
            new this.#Key("f12", "F12"),

            new this.#Key("a", "a", true),
            new this.#Key("b", "b", true),
            new this.#Key("c", "c", true),
            new this.#Key("d", "d", true),
            new this.#Key("e", "e", true),
            new this.#Key("f", "f", true),
            new this.#Key("g", "g", true),
            new this.#Key("h", "h", true),
            new this.#Key("i", "i", true),
            new this.#Key("j", "j", true),
            new this.#Key("k", "k", true),
            new this.#Key("l", "l", true),
            new this.#Key("m", "m", true),
            new this.#Key("n", "n", true),
            new this.#Key("o", "o", true),
            new this.#Key("p", "p", true),
            new this.#Key("q", "q", true),
            new this.#Key("r", "r", true),
            new this.#Key("s", "s", true),
            new this.#Key("t", "t", true),
            new this.#Key("u", "u", true),
            new this.#Key("v", "v", true),
            new this.#Key("w", "w", true),
            new this.#Key("x", "x", true),
            new this.#Key("y", "y", true),
            new this.#Key("z", "z", true),

            new this.#Key("mouse0", "mouse0"),
            new this.#Key("mouse1", "mouse1"),
            new this.#Key("mouse2", "mouse2"),
        ];

        
        document.addEventListener("keydown", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            if (Application.debugMode && event.ctrlKey && event.shiftKey && (["j", "i", "c"]).includes(event.key.toLowerCase()))
            {
                if (Application.isInElectron) Application.electronIPC.invoke("OpenDevtools");

                return;
            }
            
            event.preventDefault();

            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex >= 0) this.#keys[keyIndex].active = true;
        });
        document.addEventListener("keyup", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;
            
            event.preventDefault();

            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex >= 0) this.#keys[keyIndex].active = false;
        });


        document.addEventListener("mousemove", event => {
            setMousePos(event);

            this.#mouseOver = true;
        });
        document.addEventListener("mouseleave", event => {
            setMousePos(event);

            this.#mouseOver = false;
        });
        document.addEventListener("contextmenu", event => event.preventDefault());

        const getScreenPos = (x, y) => new Vector2(
            Math.Clamp(x, 0, window.innerWidth),
            Math.Clamp(y, 0, window.innerHeight)
        );
        const setMousePos = event => {
            this.#mouseDelta = new Vector2(event.movementX, event.movementY);
            this.#mousePos = getScreenPos(event.clientX, event.clientY);
        };
        const mouseKeys = [
            "mouse0",
            "mouse2",
            "mouse1"
        ];

        document.addEventListener("mousedown", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            setMousePos(event);

            const keyIndex = this.#FindKeyByCode(mouseKeys[event.button]);
            
            this.#keys[keyIndex].active = true;
        });
        document.addEventListener("mouseup", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            setMousePos(event);

            const keyIndex = this.#FindKeyByCode(mouseKeys[event.button]);
            
            this.#keys[keyIndex].active = false;
        });


        document.addEventListener("touchstart", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            this.#nativeTouches = event.touches;

            const changed = event.changedTouches;
            
            for (let i = 0; i < changed.length; i++) this.#changedTouches.push(changed[i].identifier);
        }, { passive: false });
        document.addEventListener("touchmove", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            this.#nativeTouches = event.touches;

            const changed = event.changedTouches;
            
            for (let i = 0; i < changed.length; i++) this.#changedTouches.push(changed[i].identifier);
        }, { passive: false });
        document.addEventListener("touchend", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            this.#nativeTouches = event.touches;

            const changed = event.changedTouches;

            if (event.type === "touchcancel") for (let i = 0; i < changed.length; i++) this.#cancelledTouches.push(changed[i].identifier);
        });
        document.addEventListener("touchcancel", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            this.#nativeTouches = event.touches;
        });

        GamepadInput.Init();
    }
    
    static Terminate ()
    {
        this.#terminating = true;
    }
    
    static Update ()
    {
        if (this.#terminated) return;

        if (!PlayerLoop.isPlaying)
        {
            this.Clear();

            return;
        }

        const getScreenPos = (x, y) => new Vector2(
            Math.Clamp(x, 0, window.innerWidth),
            Math.Clamp(y, 0, window.innerHeight)
        );

        let contacts = [];

        for (let i = 0; i < this.#nativeTouches.length; i++)
        {
            const contact = this.#nativeTouches[i];

            if (!this.#cancelledTouches.includes(contact.identifier)) contacts.push(contact);
        }

        for (let i = 0; i < contacts.length; i++)
        {
            const contact = contacts[i];

            if (!this.#changedTouches.includes(contact.identifier)) continue;

            let touch = this.#touches.find(item => item.fingerID === contact.identifier);

            if (touch == null)
            {
                touch = new Touch();
                this.#touches.push(touch);

                touch.fingerID = contact.identifier;
                touch.pressure = contact.force;
                touch.lastTime = Time.time;
                touch.radius = (contact.radiusX + contact.radiusY) * 0.5;
                touch.rawPosition = new Vector2(contact.clientX, contact.clientY);
                touch.position = getScreenPos(contact.clientX, contact.clientY);

                continue;
            }
            
            touch.pressure = contact.force;
            touch.deltaTime = Time.time - touch.lastTime;
            touch.lastTime = Time.time;
            touch.radius = (contact.radiusX + contact.radiusY) * 0.5;
            touch.rawPosition = new Vector2(contact.clientX, contact.clientY);

            const currentPos = getScreenPos(contact.clientX, contact.clientY);

            touch.deltaPosition = Vector2.Subtract(currentPos, touch.position);
            touch.position = currentPos;

            if (touch.phase === TouchPhase.Began || touch.phase === TouchPhase.Stationary) touch.phase = TouchPhase.Moved;
        }

        for (let i = 0; i < this.#touches.length; i++)
        {
            const touch = this.#touches[i];
            
            if (contacts.map(item => item.identifier).includes(touch.fingerID)) continue;
            
            touch.phase = this.#cancelledTouches.includes(touch.fingerID) ? TouchPhase.Cancelled : TouchPhase.Ended;
        }

        this.#changedTouches = [];
        this.#cancelledTouches = [];

        GamepadInput.Update();
        Cursor.Update();
    }
    
    static End ()
    {
        if (this.#terminated || !PlayerLoop.isPlaying) return;
        
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].lastState = this.#keys[i].active;

        this.#mouseDelta = Vector2.zero;

        let removingTouches = [];

        for (let i = 0; i < this.#touches.length; i++)
        {
            const touch = this.#touches[i];

            switch (touch.phase)
            {
                case TouchPhase.Began:
                case TouchPhase.Moved:
                    touch.phase = TouchPhase.Stationary;
                    break;
                case TouchPhase.Ended:
                case TouchPhase.Cancelled:
                    removingTouches.push(touch);
                    break;
            }
        }

        for (let i = 0; i < removingTouches.length; i++) this.#touches.splice(this.#touches.indexOf(removingTouches[i]), 1);

        GamepadInput.End();
        
        if (this.#terminating) this.#terminated = true;
    }

    static Clear ()
    {
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].active = false;

        this.#nativeTouches = [];

        GamepadInput.Clear();
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

    static GetMouseButton (key)
    {
        const mouseKeys = [
            "mouse0",
            "mouse1",
            "mouse2"
        ];

        return this.GetKey(mouseKeys[key]);
    }

    static GetMouseButtonDown (key)
    {
        const mouseKeys = [
            "mouse0",
            "mouse1",
            "mouse2"
        ];

        return this.GetKeyDown(mouseKeys[key]);
    }

    static GetMouseButtonUp (key)
    {
        const mouseKeys = [
            "mouse0",
            "mouse1",
            "mouse2"
        ];

        return this.GetKeyUp(mouseKeys[key]);
    }

    static GetTouch (index)
    {
        return this.#touches[index];
    }
}
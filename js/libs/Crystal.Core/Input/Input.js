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
    static #mousePosOld = new Vector2();

    static get mousePresent ()
    {
        return this.#mouseOver;
    }

    static get mousePosition ()
    {
        return new Vector2(this.#mousePos.x, this.#mousePos.y);
    }

    static get mousePositionDelta ()
    {
        return Vector2.Subtract(this.#mousePos, this.#mousePosOld);
    }
    
    static get touchCount ()
    {
        return this.#touches.length;
    }

    static get touches ()
    {
        return [...this.#touches];
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
            new this.#Key("up", "ArrowUp"),
            new this.#Key("down", "ArrowDown"),
            new this.#Key("left", "ArrowLeft"),
            new this.#Key("right", "ArrowRight"),
            new this.#Key("shift", "Shift"),
            new this.#Key("f4", "F4"),
            new this.#Key("f1", "F1"),
            new this.#Key("f2", "F2"),
            new this.#Key("f3", "F3"),
            new this.#Key("f5", "F5"),
            new this.#Key("f6", "F6"),
            new this.#Key("f7", "F7"),
            new this.#Key("f8", "F8"),
            new this.#Key("f9", "F9"),
            new this.#Key("f10", "F10"),
            new this.#Key("f11", "F11"),
            new this.#Key("f12", "F12"),
            new this.#Key("x", "x", true),
            new this.#Key("z", "z", true),
            new this.#Key("mouse0", "mouse0"),
            new this.#Key("mouse1", "mouse1"),
            new this.#Key("mouse2", "mouse2")
        ];

        
        document.addEventListener("keydown", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;
            
            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex === -1) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = true;
        });
        document.addEventListener("keyup", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;
            
            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex === -1) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = false;
        });


        document.addEventListener("mousemove", event => {
            setMousePos(event.clientX, event.clientY);

            if (this.#mouseOver) return;

            this.#mouseOver = true;
        });
        document.addEventListener("mouseleave", event => {
            setMousePos(event.clientX, event.clientY);

            this.#mouseOver = false;
        });
        document.addEventListener("contextmenu", event => event.preventDefault());

        const getScreenPos = (x, y) => new Vector2(
            Math.Clamp(x - (window.innerWidth - Window.canvasWidth) * 0.5, 0, Window.canvasWidth),
            Math.Clamp(y - (window.innerHeight - Window.canvasHeight) * 0.5, 0, Window.canvasHeight)
        );
        const setMousePos = (x, y) => {
            this.#mousePosOld = this.#mousePos;
            this.#mousePos = getScreenPos(x, y);
        };
        const mouseKeys = [
            "mouse0",
            "mouse2",
            "mouse1"
        ];

        document.addEventListener("mousedown", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            setMousePos(event.clientX, event.clientY);

            const keyIndex = this.#FindKeyByCode(mouseKeys[event.button]);
            
            this.#keys[keyIndex].active = true;
        });
        document.addEventListener("mouseup", event => {
            if (!PlayerLoop.isPlaying || this.#terminated) return;

            event.preventDefault();

            setMousePos(event.clientX, event.clientY);

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
            if (!PlayerLoop.isPlaying && this.#terminated) return;

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

        const getScreenPos = (x, y) => new Vector2(
            Math.Clamp(x - (window.innerWidth - Window.canvasWidth) * 0.5, 0, Window.canvasWidth),
            Math.Clamp(y - (window.innerHeight - Window.canvasHeight) * 0.5, 0, Window.canvasHeight)
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
    }
    
    static End ()
    {
        if (this.#terminated) return;
        
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].lastState = this.#keys[i].active;

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
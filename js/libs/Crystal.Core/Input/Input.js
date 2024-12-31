class Input
{
    static #terminating = false;
    static #terminated = false;
    static #keys = [];
    
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
            new this.#Key("z", "z", true)
        ];
        
        document.addEventListener("keydown", event => {
            if (!document.hasFocus() || this.#terminated) return;
            
            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex === -1) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = true;
        });
        document.addEventListener("keyup", event => {
            if (!document.hasFocus() || this.#terminated) return;
            
            const keyIndex = this.#FindKeyByCode(event.key);
            
            if (keyIndex === -1) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = false;
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

        GamepadInput.Update();
    }
    
    static End ()
    {
        if (this.#terminated) return;
        
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].lastState = this.#keys[i].active;

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
}
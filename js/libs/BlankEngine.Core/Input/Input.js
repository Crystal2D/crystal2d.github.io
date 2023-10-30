class Input
{
    static #loaded = false;
    static #terminating = false;
    static #terminated = false;
    static #keys = [];
    
    static #key = class
    {
        name = "";
        code = "";
        active = false;
        lastState = false;
        
        constructor (name, code)
        {
            this.name = name;
            this.code = code;
        }
    }
    
    static #findKey (name)
    {
        for (let i = 0; i < this.#keys.length; i++) if (this.#keys[i].name === name) return i;
        
        return null;
    }
    
    static #findKeyByCode (code)
    {
        for (let i = 0; i < this.#keys.length; i++) if (this.#keys[i].code === code) return i;
        
        return null;
    }
    
    static Init ()
    {
        this.#keys = [
            new this.#key("up", "ArrowUp"),
            new this.#key("down", "ArrowDown"),
            new this.#key("left", "ArrowLeft"),
            new this.#key("right", "ArrowRight"),
            new this.#key("shift", "Shift"),
            new this.#key("f4", "F4")
        ];
        
        document.addEventListener("keydown", event => {
            if (!document.hasFocus() || this.#terminated) return;
            
            const keyIndex = this.#findKeyByCode(event.key);
            
            if (keyIndex == null) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = true;
        });
        document.addEventListener("keyup", event => {
            if (!document.hasFocus() || this.#terminated) return;
            
            const keyIndex = this.#findKeyByCode(event.key);
            
            if (keyIndex == null) return;
            
            event.preventDefault();
            
            this.#keys[keyIndex].active = false;
        });
    }
    
    static Terminate ()
    {
        this.#terminating = true;
    }
    
    static Update ()
    {
        if (this.#terminated) return;
    }
    
    static End ()
    {
        if (this.#terminated) return;
        
        for (let i = 0; i < this.#keys.length; i++) this.#keys[i].lastState = this.#keys[i].active;
        
        if (this.#terminating) this.#terminated = true;
    }
    
    static GetKey (key)
    {
        let keyIndex = key;
        
        if (typeof key === "string")
        {
            keyIndex = this.#findKey(key);
            
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
            keyIndex = this.#findKey(key);
            
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
            keyIndex = this.#findKey(key);
            
            if (keyIndex == null) return false;
        }
        else if (key < 0 || key >= this.#keys.length) return;
        
        return !this.#keys[keyIndex].active && this.#keys[keyIndex].lastState;
    }
}
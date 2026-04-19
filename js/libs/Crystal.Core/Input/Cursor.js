class Cursor
{
    static #shown = true;
    
    static locked = false;

    static get visible ()
    {
        return this.#shown;
    }

    static set visible (value)
    {
        if (value === this.#shown) return;

        this.#shown = value;

        document.body.style.cursor = value ? "": "none";
    }

    static Update ()
    {
        if (document.hasFocus())
        {
            if (document.pointerLockElement && !this.locked) document.exitPointerLock();
            else if (!document.pointerLockElement && this.locked) document.documentElement.requestPointerLock().catch(() => { });
        }
    }
}
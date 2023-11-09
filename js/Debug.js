class Debug
{
    static #debugMode = false;
    
    static get isDebugMode ()
    {
        return this.#debugMode;
    }
    
    static Set (debugMode)
    {
        this.#debugMode = debugMode;
    }
}
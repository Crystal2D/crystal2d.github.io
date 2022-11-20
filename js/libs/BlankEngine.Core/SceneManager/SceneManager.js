class SceneManager
{
    static #scenes = [];
    static #activeScene = null;
    static #loaded = false;
    static #unloaded = false;
    
    static get sceneLoaded ()
    {
        return this.#loaded;
    }
    
    static get sceneUnloaded ()
    {
        return this.#unloaded;
    }
    
    static GetActiveScene ()
    {
        return this.#activeScene ?? { isLoaded : false };
    }
    
    static async Set (scenes)
    {
        if (scenes != null && !Array.isArray(scenes)) throw BlankEngine.Err(0);
        
        this.#scenes = await scenes;
    }
    
    static async Load (index)
    {
        this.#activeScene = await new this.Scene(this.#scenes[index].name, {
            resources : this.#scenes[index].resources,
            gameObjects : this.#scenes[index].gameObjects,
            buildIndex : this.#scenes[index].buildIndex,
            path : this.#scenes[index].path
        }) ?? await new this.Scene();
        
        this.#loaded = true;
    }
}
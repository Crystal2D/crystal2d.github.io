class TilePalette
{
    static #loaded = false;

    static #unloadedPal = [];
    static #palettes = [];

    name = "";
    sprites = [];

    static get isLoaded ()
    {
        return this.#loaded;
    }

    static async Set ()
    {
        if (this.#loaded) return;

        const dataRequest = await fetch(`data/tilepalettes.json`);
        this.#unloadedPal = await dataRequest.json();

        this.#loaded = true;
    }

    static async Load (name)
    {
        const data = this.#unloadedPal.find(item => item.name === name);

        const obj = new TilePalette();
        obj.name = name;

        for (let i = 0; i < data.textures?.length; i++)
        {
            const sprites = [...Resources.Find(data.textures[i]).sprites];
            sprites.shift();

            obj.sprites.push(...sprites);
        }

        for (let i = 0; i < data.sprites?.length; i++)
        {
            const sprite = await SceneManager.CreateObject("Sprite", data.sprites[i]);

            obj.sprites.push(sprite);
        }

        this.#palettes.push(obj);
    }

    static async UnloadAll ()
    {
        this.#palettes = [];
    }
    
    static Find (name)
    {
        return this.#palettes.find(item => item.name === name);
    }
}

TilePalette.Set();
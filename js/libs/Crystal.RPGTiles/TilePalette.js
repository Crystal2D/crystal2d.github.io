class TilePalette
{
    static #loaded = false;

    static #unloadedPal = new Map();
    static #palettes = new Map();

    static get isLoaded ()
    {
        return this.#loaded;
    }

    static async Set ()
    {
        if (this.#loaded) return;

        const dataRequest = await FetchFile("data/tilepalettes.json");
        const data = await dataRequest.json();

        this.#unloadedPal = new Map(data.map(item => [item.name, item]));

        this.#loaded = true;
    }

    static async Load (name)
    {
        const data = this.#unloadedPal.get(name);

        const obj = new TilePalette();
        obj.name = name;

        const textures = [];
        const unloadCall = () => {
            for (let i = 0; i < textures.length; i++) textures[i].onUnload.Remove(unloadCall);

            this.Unload(name);
        };

        for (let i = 0; i < data.textures.length; i++)
        {
            if (data.textures.sprites?.length === 0) continue;

            const texture = Resources.Find(data.textures[i].src);
            texture.onUnload.Add(unloadCall);
            textures.push(texture);

            const sprites = data.textures[i].sprites;

            for (let i = 0; i < sprites.length; i++)
            {
                const sprite = sprites[i].name != null ? texture.sprites.find(spr => spr.name === sprites[i].name) : texture.sprites[sprites[i].index ?? 0];

                obj.sprites.set(sprites[i].id, sprite.Duplicate());
            }
        }

        this.#palettes.set(name, obj);
    }

    static Unload (name)
    {   
        this.#palettes.delete(name);
    }

    static UnloadAll ()
    {
        this.#palettes = new Map();
    }
    
    static Find (name)
    {
        return this.#palettes.get(name);
    }

    name = "";
    sprites = new Map();
}

TilePalette.Set();
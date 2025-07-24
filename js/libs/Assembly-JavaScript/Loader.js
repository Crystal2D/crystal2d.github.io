class Loader extends GameBehavior
{
    static #loaderLoaded = false;

    static loaded = false;
    static index = 0;

    static async ReadyLoader ()
    {
        await SceneManager.Load(1);

        this.#loaderLoaded = true;
    }

    static async Ready (index)
    {
        this.loaded = false;
        this.index = index;

        await SceneManager.Load(index);

        this.loaded = true;
    }

    static async Switch ()
    {
        await CrystalEngine.Wait(() => this.#loaderLoaded);

        this.#loaderLoaded = false;

        SceneManager.SetActiveScene(1);
    }

    #t = 0;

    #spr = null;

    Start ()
    {
        this.#spr = this.GetComponent("SpriteRenderer");
        this.#spr.color.a = 0;
    }

    Update ()
    {
        if (Loader.loaded) (async () => {
            await SceneManager.SetActiveScene(Loader.index);
            Loader.ReadyLoader();
        })();

        if (this.#t >= 0.3333) this.#spr.color.a = Math.min((this.#t - 0.3333) * 2, 1);
        
        this.#t += Time.deltaTime;
    }
}